import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Subscription, User, NewJoiner, CreateNewJoinerRequest, UpdateNewJoinerRequest, Booking, CreateBookingRequest, PersonalStatement, CreatePersonalStatementRequest, UpdatePersonalStatementRequest } from '@nextgenmedprep/common-types';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

class SupabaseService {
  public supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

    console.log('Environment Variables:', {
      SUPABASE_URL: supabaseUrl,
      SUPABASE_ANON_KEY: !!supabaseKey, // Log if the key is set
      SUPABASE_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_KEY // Log if the service key is set
    });

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Subscription methods
  async createSubscription(subscription: Omit<Subscription, 'subscribed_at' | 'updated_at'>): Promise<Subscription> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .insert(subscription)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create subscription: ${error.message}`);
    }

    return data;
  }

  async getSubscriptionByEmail(email: string): Promise<Subscription | null> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      throw new Error(`Failed to get subscription: ${error.message}`);
    }

    return data;
  }

  async updateSubscription(email: string, updates: Partial<Subscription>): Promise<Subscription> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .update(updates)
      .eq('email', email)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update subscription: ${error.message}`);
    }

    return data;
  }

  async deleteSubscription(email: string): Promise<void> {
    const { error } = await this.supabase
      .from('subscriptions')
      .delete()
      .eq('email', email);

    if (error) {
      throw new Error(`Failed to delete subscription: ${error.message}`);
    }
  }

  async getSubscriptions(
    filters: { subscription_tier?: string; opt_in_newsletter?: boolean } = {},
    pagination: { page?: number; limit?: number } = {}
  ): Promise<{ subscriptions: Subscription[]; total: number }> {
    let query = this.supabase.from('subscriptions').select('*', { count: 'exact' });

    // Apply filters
    if (filters.subscription_tier) {
      query = query.eq('subscription_tier', filters.subscription_tier);
    }
    if (filters.opt_in_newsletter !== undefined) {
      query = query.eq('opt_in_newsletter', filters.opt_in_newsletter);
    }

    // Apply pagination
    const page = pagination.page || 1;
    const limit = pagination.limit || 50;
    const offset = (page - 1) * limit;

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to get subscriptions: ${error.message}`);
    }

    return {
      subscriptions: data || [],
      total: count || 0
    };
  }

  async unsubscribeEmail(email: string): Promise<Subscription> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .update({ 
        unsubscribed_at: new Date().toISOString(),
        opt_in_newsletter: false 
      })
      .eq('email', email)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to unsubscribe: ${error.message}`);
    }

    return data;
  }

  // User methods
  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get user: ${error.message}`);
    }

    return data;
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get user: ${error.message}`);
    }

    return data;
  }

  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .insert(user)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return data;
  }

  // Link subscription to user when they register
  async linkSubscriptionToUser(email: string, userId: string): Promise<Subscription> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .update({ user_id: userId })
      .eq('email', email)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to link subscription to user: ${error.message}`);
    }

    return data;
  }

  // Resource methods
  async getResourceSignedUrl(filePath: string): Promise<string> {
    console.log("SupabaseService: Generating signed URL for file path:", filePath);
    
    const { data, error } = await this.supabase.storage
      .from('free-resources')
      .createSignedUrl(filePath, 3600); // 1 hour expiry
    
      console.log("SupabaseService: Signed URL generation result:", { data, error });

    if (error) {
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  async getResourceById(resourceId: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('resources')
      .select('*')
      .eq('id', resourceId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get resource: ${error.message}`);
    }

    return data;
  }

  async getResourcesForTier(subscriptionTier: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('resources')
      .select('*')
      .contains('allowed_tiers', [subscriptionTier])
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get resources: ${error.message}`);
    }

    return data || [];
  }

  async getAllResources(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get all resources: ${error.message}`);
    }

    return data || [];
  }

  async createResource(resource: {
    id: string;
    name: string;
    description: string;
    file_path: string;
    allowed_tiers: string[];
  }): Promise<any> {
    const { data, error } = await this.supabase
      .from('resources')
      .insert({
        ...resource,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create resource: ${error.message}`);
    }

    return data;
  }

  async updateResource(resourceId: string, updates: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('resources')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', resourceId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update resource: ${error.message}`);
    }

    return data;
  }

  async deleteResource(resourceId: string): Promise<void> {
    const { error } = await this.supabase
      .from('resources')
      .delete()
      .eq('id', resourceId);

    if (error) {
      throw new Error(`Failed to delete resource: ${error.message}`);
    }
  }

  async logResourceDownload(email: string, resourceId: string, source?: string): Promise<void> {
    const { error } = await this.supabase
      .from('resource_downloads')
      .insert({
        email,
        resource_id: resourceId,
        download_source: source || 'unknown',
        downloaded_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Failed to log resource download:', error);
      // Don't throw error - logging is optional
    }
  }

  // New Joiners methods
  async createNewJoiner(newJoinerData: CreateNewJoinerRequest): Promise<NewJoiner> {
    const { data, error } = await this.supabase
      .from('new_joiners')
      .insert(newJoinerData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create new joiner: ${error.message}`);
    }

    return data;
  }

  async getNewJoinerById(id: string): Promise<NewJoiner | null> {
    const { data, error } = await this.supabase
      .from('new_joiners')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get new joiner: ${error.message}`);
    }

    return data;
  }

  async getNewJoinerByEmail(email: string): Promise<NewJoiner | null> {
    const { data, error } = await this.supabase
      .from('new_joiners')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get new joiner by email: ${error.message}`);
    }

    return data;
  }

  async updateNewJoiner(id: string, updates: UpdateNewJoinerRequest): Promise<NewJoiner> {
    const { data, error } = await this.supabase
      .from('new_joiners')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update new joiner: ${error.message}`);
    }

    return data;
  }

  async deleteNewJoiner(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('new_joiners')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete new joiner: ${error.message}`);
    }
  }

  async getAllNewJoiners(
    filters: { 
      subjects_can_tutor?: string; 
      availability?: string;
      university_year?: string;
    } = {},
    pagination: { page?: number; limit?: number } = {}
  ): Promise<{ newJoiners: NewJoiner[]; total: number }> {
    let query = this.supabase.from('new_joiners').select('*', { count: 'exact' });

    // Apply filters
    if (filters.subjects_can_tutor) {
      query = query.contains('subjects_can_tutor', [filters.subjects_can_tutor]);
    }
    if (filters.availability) {
      query = query.contains('availability', [filters.availability]);
    }
    if (filters.university_year) {
      query = query.eq('university_year', filters.university_year);
    }

    // Apply pagination
    const page = pagination.page || 1;
    const limit = pagination.limit || 50;
    const offset = (page - 1) * limit;

    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to get new joiners: ${error.message}`);
    }

    return {
      newJoiners: data || [],
      total: count || 0
    };
  }

  async getNewJoinersBySubject(subject: string): Promise<NewJoiner[]> {
    const { data, error } = await this.supabase
      .from('new_joiners')
      .select('*')
      .contains('subjects_can_tutor', [subject])
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get new joiners by subject: ${error.message}`);
    }

    return data || [];
  }

  async getNewJoinersByAvailability(availability: string): Promise<NewJoiner[]> {
    const { data, error } = await this.supabase
      .from('new_joiners')
      .select('*')
      .contains('availability', [availability])
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get new joiners by availability: ${error.message}`);
    }

    return data || [];
  }

  // Booking methods
  async createBooking(bookingData: {
    user_id: string;
    package?: string;
    amount?: number;
    preferred_time?: string;
    email?: string;
    payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
    file_path?: string;
    notes?: string;
    universities?: string;
    field?: 'medicine' | 'dentistry';
    phone?: string;
  }): Promise<any> {
    console.log('=== Creating Booking in Database ===');
    console.log('Input booking data:', bookingData);
    
    const insertData = {
      ...bookingData,
      status: 'confirmed',
      payment_status: bookingData.payment_status || 'pending',
    };
    console.log('Data to insert into bookings:', insertData);
    
    const { data, error } = await this.supabase
      .from('bookings')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Database error creating booking:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw new Error(`Failed to create booking: ${error.message}`);
    }

    console.log('Successfully created booking:');
    return data;
  }

  async getBookingById(id: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get booking: ${error.message}`);
    }

    return data;
  }

  async updateBookingPaymentStatus(id: string, paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'): Promise<any> {
    const { data, error } = await this.supabase
      .from('bookings')
      .update({ 
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update booking payment status: ${error.message}`);
    }

    return data;
  }
  
  async updateBooking(id: string, updates: {
    start_time?: string;
    end_time?: string;
    status?: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
    payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
    tutor_id?: string;
    preferred_time?: string;
    reschedule_requested?: boolean;
    rescheduled_time?: string;
    feedback?: string;
    rating?: number;
    complete?: boolean;
  }): Promise<any> {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update booking: ${error.message}`);
    }

    return data;
  }

  async getUserBookings(userId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get user bookings: ${error.message}`);
    }

    return data || [];
  }

  async getAllBookings(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get all bookings: ${error.message}`);
    }

    return data || [];
  }

  async getBookingStats(): Promise<{
    total: number;
    recent: number;
    byStatus: Record<string, number>;
    byPackage: Record<string, number>;
    totalRevenue: number;
  }> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*');

    if (error) {
      throw new Error(`Failed to get booking stats: ${error.message}`);
    }

    const bookings = data || [];
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const stats = {
      total: bookings.length,
      recent: bookings.filter((b: any) => new Date(b.created_at) >= sevenDaysAgo).length,
      byStatus: {} as Record<string, number>,
      byPackage: {} as Record<string, number>,
      totalRevenue: 0,
    };

    bookings.forEach((booking: any) => {
      // Count by status
      const status = booking.status || 'pending';
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

      // Count by package
      const pkg = booking.package || 'other';
      stats.byPackage[pkg] = (stats.byPackage[pkg] || 0) + 1;

      // Sum revenue (only paid bookings)
      if (booking.payment_status === 'paid') {
        stats.totalRevenue += booking.amount || 0;
      }
    });

    return stats;
  }

  async getBookingsByPackage(packageIdentifier: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*')
      .eq('package', packageIdentifier)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get bookings by package: ${error.message}`);
    }

    return data || [];
  }

  // Personal Statement methods
  async createPersonalStatement(personalStatement: CreatePersonalStatementRequest): Promise<PersonalStatement> {
    console.log('=== Creating Personal Statement in Database ===');
    console.log('Input data:', personalStatement);
    
    const insertData = {
      ...personalStatement,
      reviewed: false,
      version: 1,
      status: 'pending' as const
    };
    console.log('Data to insert:', insertData);
    
    const { data, error } = await this.supabase
      .from('personal_statements')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Database error creating personal statement:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw new Error(`Failed to create personal statement: ${error.message}`);
    }

    console.log('Successfully created personal statement:', data);
    return data;
  }

  async getPersonalStatementById(id: string): Promise<PersonalStatement | null> {
    const { data, error } = await this.supabase
      .from('personal_statements')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get personal statement: ${error.message}`);
    }

    return data;
  }

  async getPersonalStatementsByEmail(email: string): Promise<PersonalStatement[]> {
    const { data, error } = await this.supabase
      .from('personal_statements')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get personal statements: ${error.message}`);
    }

    return data || [];
  }

  async getAllPersonalStatements(): Promise<PersonalStatement[]> {
    const { data, error } = await this.supabase
      .from('personal_statements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get all personal statements: ${error.message}`);
    }

    return data || [];
  }

  async getPersonalStatementsByStatus(status: 'pending' | 'in_review' | 'complete'): Promise<PersonalStatement[]> {
    const { data, error } = await this.supabase
      .from('personal_statements')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get personal statements by status: ${error.message}`);
    }

    return data || [];
  }

  async updatePersonalStatement(id: string, updates: UpdatePersonalStatementRequest): Promise<PersonalStatement> {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.supabase
      .from('personal_statements')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update personal statement: ${error.message}`);
    }

    return data;
  }

  async deletePersonalStatement(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('personal_statements')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete personal statement: ${error.message}`);
    }
  }

  // Get signed URL for personal statement download
  async getPersonalStatementSignedUrl(filePath: string): Promise<string> {
    console.log("SupabaseService: Generating signed URL for personal statement:", filePath);
    
    const { data, error } = await this.supabase.storage
      .from('Personal Statements')
      .createSignedUrl(filePath, 604800); // 7 days expiry (in seconds)
    
    console.log("SupabaseService: Signed URL generation result:", { data, error });

    if (error) {
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  // Student Availability methods
  async createStudentAvailability(availabilityData: {
    student_id: string;
    date: string;
    hour_start: number;
    hour_end: number;
    type?: 'interview' | 'tutoring' | 'consultation';
  }): Promise<any> {
    console.log('=== Creating Student Availability ===');
    console.log('Availability data:', availabilityData);

    const { data, error } = await this.supabase
      .from('student_availability')
      .insert(availabilityData)
      .select()
      .single();

    if (error) {
      console.error('Error creating student availability:', error);
      throw new Error(`Failed to create student availability: ${error.message}`);
    }

    console.log('Successfully created student availability:', data);
    return data;
  }

  async createBulkStudentAvailability(availabilityDataArray: Array<{
    student_id: string;
    date: string;
    hour_start: number;
    hour_end: number;
    type?: 'interview' | 'tutoring' | 'consultation';
  }>): Promise<any[]> {
    console.log('=== Creating Bulk Student Availability ===');
    console.log('Number of slots:', availabilityDataArray.length);

    const { data, error } = await this.supabase
      .from('student_availability')
      .insert(availabilityDataArray)
      .select();

    if (error) {
      console.error('Error creating bulk student availability:', error);
      throw new Error(`Failed to create bulk student availability: ${error.message}`);
    }

    console.log('Successfully created student availability records:', data?.length);
    return data || [];
  }

  // Interview methods
  async createInterview(interviewData: {
    student_id: string;
    booking_id: string;
    university?: string;
    notes?: string;
  }): Promise<any> {
    console.log('=== Creating Interview ===');
    console.log('Interview data:', interviewData);

    const { data, error } = await this.supabase
      .from('interviews')
      .insert(interviewData)
      .select()
      .single();

    if (error) {
      console.error('Error creating interview:', error);
      throw new Error(`Failed to create interview: ${error.message}`);
    }

    console.log('Successfully created interview:', data);
    return data;
  }

  async createBulkInterviews(interviewDataArray: Array<{
    student_id: string;
    booking_id: string;
    university?: string;
    notes?: string;
  }>): Promise<any[]> {
    console.log('=== Creating Bulk Interviews ===');
    console.log('Number of interviews:', interviewDataArray.length);

    const { data, error } = await this.supabase
      .from('interviews')
      .insert(interviewDataArray)
      .select();

    if (error) {
      console.error('Error creating bulk interviews:', error);
      throw new Error(`Failed to create bulk interviews: ${error.message}`);
    }

    console.log('Successfully created interview records:', data?.length);
    return data || [];
  }

  // Get client for direct queries if needed
  getClient(): SupabaseClient {
    return this.supabase;
  }
}

export default new SupabaseService();
