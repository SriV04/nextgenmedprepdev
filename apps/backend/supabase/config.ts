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

// Database schema setup scripts
export const setupDatabaseSchema = `
-- -----------------------------------------------------------------------------
-- Users Table
-- Stores information about registered users (students, tutors, admins).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    full_name TEXT,
    role TEXT DEFAULT 'student' NOT NULL,
    email_verified_at TIMESTAMPTZ,
    stripe_customer_id TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add a trigger to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS users_updated_at_modtime
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- -----------------------------------------------------------------------------
-- Subscriptions Table
-- Stores email subscriptions for newsletters, feature tiers, etc.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscriptions (
    email TEXT PRIMARY KEY CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    subscription_tier TEXT DEFAULT 'free' NOT NULL,
    opt_in_newsletter BOOLEAN DEFAULT true NOT NULL,
    stripe_subscription_id TEXT UNIQUE,
    stripe_subscription_status TEXT,
    current_period_starts_at TIMESTAMPTZ,
    current_period_ends_at TIMESTAMPTZ,
    canceled_at TIMESTAMPTZ,
    subscribed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    unsubscribed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER IF NOT EXISTS subscriptions_updated_at_modtime
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tier ON public.subscriptions(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_subscriptions_newsletter ON public.subscriptions(opt_in_newsletter);
`;

export default {
  supabaseConfig,
  createSupabaseClient,
  setupDatabaseSchema,
};
