import dotenv from 'dotenv';
import path from 'path';
import { createSupabaseClient } from '../../supabase/config';

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

interface ZoomMeetingSettings {
  host_video?: boolean;
  participant_video?: boolean;
  join_before_host?: boolean;
  mute_upon_entry?: boolean;
  waiting_room?: boolean;
  audio?: 'both' | 'telephony' | 'voip';
  auto_recording?: 'none' | 'local' | 'cloud';
}

interface ZoomMeetingRequest {
  topic: string;
  type: 1 | 2 | 3 | 8; // 1=instant, 2=scheduled, 3=recurring no fixed time, 8=recurring with fixed time
  start_time?: string; // ISO 8601 format
  duration?: number; // Minutes
  timezone?: string;
  agenda?: string;
  settings?: ZoomMeetingSettings;
}

interface ZoomMeetingResponse {
  id: number;
  host_id: string;
  host_email: string;
  topic: string;
  type: number;
  status: string;
  start_time: string;
  duration: number;
  timezone: string;
  created_at: string;
  start_url: string;
  join_url: string;
  password?: string;
  h323_password?: string;
  pstn_password?: string;
  encrypted_password?: string;
  settings: ZoomMeetingSettings;
}

interface ZoomTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface ZoomHost {
  email: string;
  userId: string;
}

class ZoomService {
  private accountId: string;
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;
  
  // Licensed host accounts
  private zoomHosts: ZoomHost[] = [
    { email: 'tutor@nextgenmedprep.com', userId: 'tutor@nextgenmedprep.com' },
    { email: 'contact@nextgenmedprep.com', userId: 'contact@nextgenmedprep.com' },
  ];

  constructor() {
    this.accountId = process.env.ZOOM_ACCOUNT_ID || '';
    this.clientId = process.env.ZOOM_CLIENT_ID || '';
    this.clientSecret = process.env.ZOOM_CLIENT_SECRET || '';

    if (!this.accountId || !this.clientId || !this.clientSecret) {
      console.error('Zoom API credentials not configured');
      console.error({
        ZOOM_ACCOUNT_ID: !!this.accountId,
        ZOOM_CLIENT_ID: !!this.clientId,
        ZOOM_CLIENT_SECRET: !!this.clientSecret
      });
    }
    
    console.log(`Zoom service initialized with ${this.zoomHosts.length} licensed hosts:`, 
      this.zoomHosts.map(h => h.email).join(', '));
  }

  /**
   * Get OAuth access token using Server-to-Server OAuth
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    try {
      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await fetch(
        `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${this.accountId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get Zoom access token: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as ZoomTokenResponse;
      
      this.accessToken = data.access_token;
      // Set expiry 5 minutes before actual expiry for safety
      this.tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000;

      console.log('Successfully obtained Zoom access token');
      return this.accessToken;
    } catch (error) {
      console.error('Error getting Zoom access token:', error);
      throw error;
    }
  }

  /**
   * Get available host for a given time slot by checking database
   * Throws error if no hosts are available
   */
  private async getAvailableHost(startTime: Date): Promise<ZoomHost> {
    const supabase = createSupabaseClient();
    
    // Calculate time window (45 minutes before and after to account for overlapping meetings)
    const startWindow = new Date(startTime.getTime() - 45 * 60 * 1000); // 45 minutes before
    const endWindow = new Date(startTime.getTime() + 45 * 60 * 1000);   // 45 minutes after
    
    console.log(`Checking host availability for ${startTime.toISOString()}`);
    
    // Find a host that doesn't have a meeting in this time window
    for (const host of this.zoomHosts) {
      // Query database for any interviews assigned to this host during the time window
      const { data: conflicts, error } = await supabase
        .from('interviews')
        .select('id, scheduled_at, zoom_host_email')
        .eq('zoom_host_email', host.email)
        .gte('scheduled_at', startWindow.toISOString())
        .lte('scheduled_at', endWindow.toISOString())
        .not('completed', 'is', true); // Exclude completed interviews
      
      if (error) {
        console.error(`Error checking availability for ${host.email}:`, error);
        continue; // Skip this host if there's an error
      }
      
      if (!conflicts || conflicts.length === 0) {
        console.log(`✓ Host ${host.email} is available at ${startTime.toISOString()}`);
        return host;
      } else {
        console.log(`✗ Host ${host.email} has ${conflicts.length} conflicting meeting(s) at this time`);
      }
    }
    
    // If all hosts are busy, throw an error
    throw new Error(`All Zoom hosts are busy at ${startTime.toLocaleString('en-GB', { timeZone: 'Europe/London' })}. Please select a different time slot or contact support.`);
  }



  /**
   * Create a Zoom meeting with automatic host selection
   */
  async createMeeting(params: {
    topic: string;
    startTime: Date;
    duration: number; // in minutes
    agenda?: string;
    tutorEmail?: string;
    studentName?: string;
  }): Promise<ZoomMeetingResponse> {
    try {
      const token = await this.getAccessToken();

      // Get available host for this time slot
      const host = await this.getAvailableHost(params.startTime);

      // Format start time in ISO 8601
      const startTimeISO = params.startTime.toISOString();

      const meetingData: ZoomMeetingRequest = {
        topic: params.topic,
        type: 2, // Scheduled meeting
        start_time: startTimeISO,
        duration: params.duration,
        timezone: 'Europe/London',
        agenda: params.agenda || `Interview session with ${params.studentName || 'student'}`,
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: true, // Allow participants to join without host
          mute_upon_entry: false,
          waiting_room: false,
          audio: 'both',
          auto_recording: 'none',
        },
      };

      // Create meeting for the selected host user
      const response = await fetch(`https://api.zoom.us/v2/users/${host.userId}/meetings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create Zoom meeting: ${response.status} - ${errorText}`);
      }

      const meeting = await response.json() as ZoomMeetingResponse;
      
      console.log('Successfully created Zoom meeting:', {
        id: meeting.id,
        host: meeting.host_email,
        topic: meeting.topic,
        start_time: meeting.start_time,
        join_url: meeting.join_url,
      });

      return meeting;
    } catch (error) {
      console.error('Error creating Zoom meeting:', error);
      throw error;
    }
  }

  /**
   * Get meeting details by meeting ID
   */
  async getMeeting(meetingId: string | number): Promise<ZoomMeetingResponse> {
    try {
      const token = await this.getAccessToken();

      const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get Zoom meeting: ${response.status} - ${errorText}`);
      }

      const meeting = await response.json() as ZoomMeetingResponse;
      return meeting;
    } catch (error) {
      console.error('Error getting Zoom meeting:', error);
      throw error;
    }
  }

  /**
   * Update an existing Zoom meeting
   */
  async updateMeeting(
    meetingId: string | number,
    updates: {
      topic?: string;
      startTime?: Date;
      duration?: number;
      agenda?: string;
    }
  ): Promise<void> {
    try {
      const token = await this.getAccessToken();

      const updateData: Partial<ZoomMeetingRequest> = {};

      if (updates.topic) updateData.topic = updates.topic;
      if (updates.startTime) updateData.start_time = updates.startTime.toISOString();
      if (updates.duration) updateData.duration = updates.duration;
      if (updates.agenda) updateData.agenda = updates.agenda;

      const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update Zoom meeting: ${response.status} - ${errorText}`);
      }

      console.log('Successfully updated Zoom meeting:', meetingId);
    } catch (error) {
      console.error('Error updating Zoom meeting:', error);
      throw error;
    }
  }

  /**
   * Delete a Zoom meeting and clear host schedule
   */
  async deleteMeeting(meetingId: string | number): Promise<void> {
    try {
      const token = await this.getAccessToken();

      // Get meeting details to find the host and time
      const meeting = await this.getMeeting(meetingId);

      const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok && response.status !== 204) {
        const errorText = await response.text();
        throw new Error(`Failed to delete Zoom meeting: ${response.status} - ${errorText}`);
      }

      console.log('Successfully deleted Zoom meeting:', meetingId);
    } catch (error) {
      console.error('Error deleting Zoom meeting:', error);
      throw error;
    }
  }

  /**
   * Create a meeting for interview booking with automatic host selection
   */
  async createInterviewMeeting(params: {
    studentName: string;
    tutorName?: string;
    universityName?: string;
    startTime: Date;
    duration?: number;
  }): Promise<{ meetingId: string; joinUrl: string; startUrl: string; password?: string; hostEmail: string }> {
    const topic = `Interview Session - ${params.studentName}${params.universityName ? ` (${params.universityName})` : ''}`;
    const agenda = `Mock interview session for ${params.studentName}${params.tutorName ? ` with tutor ${params.tutorName}` : ''}`;

    const meeting = await this.createMeeting({
      topic,
      startTime: params.startTime,
      duration: params.duration || 60, // Default 60 minutes
      agenda,
      studentName: params.studentName,
    });

    return {
      meetingId: meeting.id.toString(),
      joinUrl: meeting.join_url,
      startUrl: meeting.start_url,
      password: meeting.password,
      hostEmail: meeting.host_email,
    };
  }

  /**
   * Get all licensed hosts
   */
  getHosts(): ZoomHost[] {
    return this.zoomHosts;
  }

  /**
   * Get schedule for a specific host from database
   */
  async getHostSchedule(hostEmail: string): Promise<Array<{ id: string; scheduled_at: string; zoom_meeting_id?: string }>> {
    const supabase = createSupabaseClient();
    
    const { data, error } = await supabase
      .from('interviews')
      .select('id, scheduled_at, zoom_meeting_id')
      .eq('zoom_host_email', hostEmail)
      .not('completed', 'is', true)
      .order('scheduled_at', { ascending: true });
    
    if (error) {
      console.error(`Error getting schedule for ${hostEmail}:`, error);
      return [];
    }
    
    return data || [];
  }

  /**
   * Check if Zoom is configured properly
   */
  isConfigured(): boolean {
    return !!(this.accountId && this.clientId && this.clientSecret);
  }
}

export default new ZoomService();
