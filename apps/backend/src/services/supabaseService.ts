import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Subscription, User } from '@nextgenmedprep/common-types';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

class SupabaseService {
  private supabase: SupabaseClient;

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

  // Get client for direct queries if needed
  getClient(): SupabaseClient {
    return this.supabase;
  }
}

export default new SupabaseService();
