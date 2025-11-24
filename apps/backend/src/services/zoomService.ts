import dotenv from 'dotenv';
import path from 'path';

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

class ZoomService {
  private accountId: string;
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

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
   * Create a Zoom meeting
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
          join_before_host: false,
          mute_upon_entry: false,
          waiting_room: true,
          audio: 'both',
          auto_recording: 'none',
        },
      };

      const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
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
   * Delete a Zoom meeting
   */
  async deleteMeeting(meetingId: string | number): Promise<void> {
    try {
      const token = await this.getAccessToken();

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
   * Create a meeting for interview booking
   */
  async createInterviewMeeting(params: {
    studentName: string;
    tutorName?: string;
    universityName?: string;
    startTime: Date;
    duration?: number;
  }): Promise<{ meetingId: string; joinUrl: string; startUrl: string; password?: string }> {
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
    };
  }

  /**
   * Check if Zoom is configured properly
   */
  isConfigured(): boolean {
    return !!(this.accountId && this.clientId && this.clientSecret);
  }
}

export default new ZoomService();
