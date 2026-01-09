import { createClient } from '@supabase/supabase-js';

export const supabaseConfig = {
  url: process.env.SUPABASE_URL!,
  anonKey: process.env.SUPABASE_ANON_KEY!,
  serviceKey: process.env.SUPABASE_SERVICE_KEY!,
};

// Initialize Supabase client for admin operations
export const createSupabaseClient = () => {
  return createClient(supabaseConfig.url, supabaseConfig.serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export default createSupabaseClient;
