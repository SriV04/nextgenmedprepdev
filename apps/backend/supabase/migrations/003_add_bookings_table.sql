-- Migration: Add Bookings table
-- Version: 003
-- Date: 2025-10-08

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- Bookings Table
-- Stores information about interview session bookings
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  tutor_id uuid NULL,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'confirmed'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  package text NULL,
  payment_status text NULL DEFAULT 'pending'::text,
  amount numeric(10, 2) NULL,
  complete boolean NULL DEFAULT false,
  preferred_time timestamp with time zone NULL,
  reschedule_requested boolean NULL DEFAULT false,
  rescheduled_time timestamp with time zone NULL,
  feedback text NULL,
  rating integer NULL,
  email text NULL,
  
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_tutor_id_fkey FOREIGN KEY (tutor_id) REFERENCES public.users (id) ON DELETE SET NULL,
  CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE,
  CONSTRAINT bookings_payment_status_check CHECK (
    payment_status = ANY (
      ARRAY[
        'pending'::text,
        'paid'::text,
        'failed'::text,
        'refunded'::text
      ]
    )
  ),
  CONSTRAINT bookings_status_check CHECK (
    status = ANY (
      ARRAY[
        'confirmed'::text,
        'cancelled'::text,
        'completed'::text,
        'no_show'::text
      ]
    )
  ),
  CONSTRAINT bookings_rating_check CHECK (
    (rating >= 1) AND (rating <= 5)
  ),
  CONSTRAINT check_booking_times CHECK (end_time > start_time)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON public.bookings USING btree (start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_tutor_id ON public.bookings USING btree (tutor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings USING btree (payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_complete ON public.bookings USING btree (complete);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings USING btree (status);

-- Add update trigger for bookings
CREATE TRIGGER IF NOT EXISTS bookings_updated_at_modtime
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- RLS (Row Level Security) Policies
-- -----------------------------------------------------------------------------

-- Enable RLS on bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT USING (auth.uid()::text = user_id::text OR auth.uid()::text = tutor_id::text);

-- Policy: Users can only create their own bookings
CREATE POLICY "Users can create their own bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Policy: Users can update their own bookings
CREATE POLICY "Users can update their own bookings" ON public.bookings
    FOR UPDATE USING (auth.uid()::text = user_id::text OR auth.uid()::text = tutor_id::text);

-- Policy: Service role has full access
CREATE POLICY "Service role can manage bookings" ON public.bookings
    FOR ALL TO service_role USING (true);

-- Policy: Authenticated users with admin role can manage all bookings
CREATE POLICY "Admins can manage all bookings" ON public.bookings
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role = 'admin'
        )
    );