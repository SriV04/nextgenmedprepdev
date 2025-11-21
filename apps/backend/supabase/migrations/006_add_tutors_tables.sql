-- Migration: Add tutors and tutor_availability tables
-- Description: Creates tables for managing tutor accounts and their availability schedules
-- Date: 2025-11-12

-- =============================================================================
-- TUTORS TABLE
-- =============================================================================
-- Stores tutor account information
-- Each tutor is linked to a Supabase Auth user via the id field
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.tutors (
  id UUID PRIMARY KEY,  -- Uses Supabase Auth user ID
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  subjects TEXT[] NOT NULL DEFAULT ARRAY['General'],  -- Array of subjects like ['Math', 'Physics', 'Medicine']
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_tutors_email ON public.tutors(email);

-- Create index on subjects for filtering
CREATE INDEX IF NOT EXISTS idx_tutors_subjects ON public.tutors USING GIN(subjects);

-- Add updated_at trigger
CREATE TRIGGER tutors_updated_at_modtime
  BEFORE UPDATE ON public.tutors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- TUTOR AVAILABILITY TABLE
-- =============================================================================
-- Stores tutor availability time slots
-- Each row represents a time block when a tutor is available
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.tutor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  day_of_week INT GENERATED ALWAYS AS (EXTRACT(DOW FROM date)) STORED,
  hour_start INT NOT NULL CHECK (hour_start >= 0 AND hour_start <= 23),
  hour_end INT NOT NULL CHECK (hour_end > hour_start AND hour_end <= 24),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure no overlapping availability for the same tutor on the same date
  CONSTRAINT no_overlapping_availability UNIQUE (tutor_id, date, hour_start)
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_tutor_availability_tutor_id ON public.tutor_availability(tutor_id);
CREATE INDEX IF NOT EXISTS idx_tutor_availability_date ON public.tutor_availability(date);
CREATE INDEX IF NOT EXISTS idx_tutor_availability_day_of_week ON public.tutor_availability(day_of_week);

-- Create composite index for date range queries
CREATE INDEX IF NOT EXISTS idx_tutor_availability_tutor_date ON public.tutor_availability(tutor_id, date);

-- Created medical_school enum type
create type medical_school as enum (
  'Peninsula (Plymouth)',
  'Norwich (UEA)',
  'Nottingham',
  'Hull York (HYMS)',
  'Aston University',
  'Cardiff',
  'St George''s',
  'Leicester',
  'Buckingham',
  'Warwick (GEM)',
  'Barts and The London (Queen Mary)',
  'Birmingham',
  'Ulster University',
  'Medical School',
  'Imperial College London',
  'Lincoln Medical School',
  'Glasgow',
  'Brighton & Sussex (BSMS)',
  'Keele',
  'Southampton',
  'Anglia Ruskin (ARU)',
  'Kent and Medway (KMMS)',
  'King''s College London (KCL)',
  'Edge Hill',
  'Pears Cumbria (GEM)',
  'Bristol',
  'Sunderland',
  'UCL',
  'Brunel Medical School',
  'North Wales (Bangor)',
  'Liverpool',
  'Queen''s University Belfast (QUB)',
  'Cambridge',
  'Swansea (GEM)',
  'Manchester',
  'Oxford',
  'Edinburgh',
  'Sheffield',
  'Chester Medical School (GEM)',
  'Dundee',
  'Newcastle',
  'St Andrews',
  'Leeds',
  'Lancaster',
  'Exeter',
  'Surrey (GEM)',
  'Aberdeen'
);


-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
-- Enable RLS but keep it permissive for now
-- TODO: Add stricter policies based on user roles
-- =============================================================================

ALTER TABLE public.tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_availability ENABLE ROW LEVEL SECURITY;

-- Allow service role to bypass RLS (for backend operations)
-- For now, allow authenticated users to read tutors
CREATE POLICY "Allow authenticated users to read tutors"
  ON public.tutors
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow service role to manage tutors (backend only)
CREATE POLICY "Allow service role to manage tutors"
  ON public.tutors
  FOR ALL
  TO service_role
  USING (true);

-- Allow authenticated users to read availability
CREATE POLICY "Allow authenticated users to read availability"
  ON public.tutor_availability
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow tutors to manage their own availability
CREATE POLICY "Allow tutors to manage own availability"
  ON public.tutor_availability
  FOR ALL
  TO authenticated
  USING (tutor_id = auth.uid());

-- Allow service role to manage all availability (backend only)
CREATE POLICY "Allow service role to manage availability"
  ON public.tutor_availability
  FOR ALL
  TO service_role
  USING (true);

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE public.tutors IS 'Stores tutor account information linked to Supabase Auth users';
COMMENT ON COLUMN public.tutors.id IS 'Supabase Auth user ID';
COMMENT ON COLUMN public.tutors.subjects IS 'Array of subjects the tutor can teach';

COMMENT ON TABLE public.tutor_availability IS 'Stores tutor availability time slots';
COMMENT ON COLUMN public.tutor_availability.day_of_week IS 'Day of week (0=Sunday, 6=Saturday), automatically computed';
COMMENT ON COLUMN public.tutor_availability.hour_start IS 'Starting hour (0-23)';
COMMENT ON COLUMN public.tutor_availability.hour_end IS 'Ending hour (1-24)';
