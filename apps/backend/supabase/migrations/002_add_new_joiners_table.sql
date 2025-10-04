-- Migration for new_joiners table and types
-- Run this migration to set up the new joiners functionality

-- ENUM for tutoring subjects
DO $$ BEGIN
    CREATE TYPE tutoring_subject AS ENUM (
        'UCAT',
        'A-Level Biology',
        'A-Level Chemistry',
        'A-Level Maths',
        'GCSE - Various',
        'Interview Prep',
        'Personal Statement Review'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ENUM for availability
DO $$ BEGIN
    CREATE TYPE availability_slot AS ENUM (
        'Weekdays',
        'Evenings',
        'Weekends',
        'Flexible'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Main table for new joiners
CREATE TABLE IF NOT EXISTS new_joiners (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),

    -- Basic Info
    full_name text NOT NULL,
    email text NOT NULL UNIQUE,
    phone_number text,

    -- Academic Background
    alevel_subjects_grades text NOT NULL,
    university_year text NOT NULL,
    med_dent_grades jsonb NOT NULL, 

    -- Admissions Test Scores
    ucat jsonb NOT NULL, 
    bmat jsonb,          

    -- Offers
    med_school_offers text NOT NULL,

    -- Tutoring Preferences
    subjects_can_tutor tutoring_subject[] NOT NULL,
    exam_boards text,

    -- Experience & Motivation
    tutoring_experience text NOT NULL,
    why_tutor text NOT NULL,

    -- Availability
    availability availability_slot[] NOT NULL,

    -- Documents
    cv_url text
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_new_joiners_email ON new_joiners(email);
CREATE INDEX IF NOT EXISTS idx_new_joiners_created_at ON new_joiners(created_at);
CREATE INDEX IF NOT EXISTS idx_new_joiners_subjects_can_tutor ON new_joiners USING GIN (subjects_can_tutor);
CREATE INDEX IF NOT EXISTS idx_new_joiners_availability ON new_joiners USING GIN (availability);
CREATE INDEX IF NOT EXISTS idx_new_joiners_university_year ON new_joiners(university_year);

-- Row Level Security (RLS) policies
ALTER TABLE new_joiners ENABLE ROW LEVEL SECURITY;

-- Policy for service role (backend) - full access
CREATE POLICY IF NOT EXISTS "Service role can manage new_joiners" 
ON new_joiners 
FOR ALL 
TO service_role 
USING (true);

-- Policy for authenticated users to read their own data
CREATE POLICY IF NOT EXISTS "Users can view their own application" 
ON new_joiners 
FOR SELECT 
TO authenticated 
USING (auth.email() = email);

-- Policy for authenticated users to insert their own data
CREATE POLICY IF NOT EXISTS "Users can insert their own application" 
ON new_joiners 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.email() = email);

-- Policy for authenticated users to update their own data
CREATE POLICY IF NOT EXISTS "Users can update their own application" 
ON new_joiners 
FOR UPDATE 
TO authenticated 
USING (auth.email() = email);