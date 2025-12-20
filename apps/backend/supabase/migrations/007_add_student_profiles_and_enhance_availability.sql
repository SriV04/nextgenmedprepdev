-- Migration: Add Student Profiles and Enhance Student Availability
-- Version: 007
-- Date: 2025-12-20
-- Purpose: Support student account auto-creation and improved availability tracking

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- Student Profiles Table
-- Extends the users table with student-specific information
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    auth_id UUID, -- Reference to auth.users id
    created_from_booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    timezone TEXT DEFAULT 'UTC',
    weekly_availability JSONB, -- Store weekly availability preferences
    preferences TEXT, -- Additional notes or preferences
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(user_id)
);

-- Add update trigger for student_profiles
CREATE TRIGGER IF NOT EXISTS student_profiles_updated_at_modtime
    BEFORE UPDATE ON public.student_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON public.student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_auth_id ON public.student_profiles(auth_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_booking_id ON public.student_profiles(created_from_booking_id);

-- -----------------------------------------------------------------------------
-- Student Availability Table (if not exists)
-- Tracks specific time slots when students are available
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    hour_start INTEGER NOT NULL CHECK (hour_start >= 0 AND hour_start <= 23),
    hour_end INTEGER NOT NULL CHECK (hour_end >= 1 AND hour_end <= 24),
    type TEXT DEFAULT 'interview' CHECK (type IN ('interview', 'tutoring', 'consultation')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add update trigger for student_availability
CREATE TRIGGER IF NOT EXISTS student_availability_updated_at_modtime
    BEFORE UPDATE ON public.student_availability
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_student_availability_student_id ON public.student_availability(student_id);
CREATE INDEX IF NOT EXISTS idx_student_availability_date ON public.student_availability(date);
CREATE INDEX IF NOT EXISTS idx_student_availability_type ON public.student_availability(type);

-- -----------------------------------------------------------------------------
-- Add created_from_booking_id to users table if not exists
-- -----------------------------------------------------------------------------
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'created_from_booking_id'
    ) THEN
        ALTER TABLE public.users 
        ADD COLUMN created_from_booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL;
        
        CREATE INDEX IF NOT EXISTS idx_users_created_from_booking ON public.users(created_from_booking_id);
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- Add phone_number to users table if not exists
-- -----------------------------------------------------------------------------
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'phone_number'
    ) THEN
        ALTER TABLE public.users 
        ADD COLUMN phone_number TEXT;
    END IF;
END $$;

-- Comment on tables and key columns
COMMENT ON TABLE public.student_profiles IS 'Student-specific profile information extending the users table';
COMMENT ON COLUMN public.student_profiles.auth_id IS 'Reference to Supabase auth.users table for authentication';
COMMENT ON COLUMN public.student_profiles.created_from_booking_id IS 'The booking that triggered auto-creation of this student account';
COMMENT ON COLUMN public.student_profiles.weekly_availability IS 'JSON object storing weekly recurring availability preferences';

COMMENT ON TABLE public.student_availability IS 'Specific date/time slots when students are available for sessions';
COMMENT ON COLUMN public.student_availability.type IS 'Type of session student is available for (interview, tutoring, consultation)';
