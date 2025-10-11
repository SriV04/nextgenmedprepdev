-- Migration: Add Personal Statements table
-- Version: 004
-- Date: 2025-10-11

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- Personal Statements Table
-- Stores personal statement review submissions and their status
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.personal_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    personal_statement_file_path TEXT NOT NULL,
    notes TEXT,
    reviewed BOOLEAN DEFAULT false NOT NULL,
    reviewed_at TIMESTAMPTZ,
    reviewer_email TEXT CHECK (reviewer_email IS NULL OR reviewer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    version INTEGER DEFAULT 1 NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'in_review', 'complete')),
    feedback_url TEXT,
    feedback_file_path TEXT
);

-- Add update trigger for personal_statements
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS personal_statements_updated_at_modtime
    BEFORE UPDATE ON public.personal_statements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_personal_statements_email ON public.personal_statements(email);
CREATE INDEX IF NOT EXISTS idx_personal_statements_status ON public.personal_statements(status);
CREATE INDEX IF NOT EXISTS idx_personal_statements_reviewed ON public.personal_statements(reviewed);
CREATE INDEX IF NOT EXISTS idx_personal_statements_created_at ON public.personal_statements(created_at);
CREATE INDEX IF NOT EXISTS idx_personal_statements_reviewer_email ON public.personal_statements(reviewer_email);

-- -----------------------------------------------------------------------------
-- RLS (Row Level Security) Policies
-- -----------------------------------------------------------------------------

-- Enable RLS on personal_statements table
ALTER TABLE public.personal_statements ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own personal statements
CREATE POLICY "Users can see their own personal statements" ON public.personal_statements
    FOR SELECT USING (
        auth.email() = email OR 
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.email = personal_statements.reviewer_email 
            AND auth.uid() = auth.users.id
        )
    );

-- Policy: Service role can insert personal statements
CREATE POLICY "Service can insert personal statements" ON public.personal_statements
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Policy: Service role and reviewers can update personal statements
CREATE POLICY "Service and reviewers can update personal statements" ON public.personal_statements
    FOR UPDATE USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.email = personal_statements.reviewer_email 
            AND auth.uid() = auth.users.id
        )
    );

-- Policy: Only service role can delete personal statements
CREATE POLICY "Service can delete personal statements" ON public.personal_statements
    FOR DELETE USING (auth.role() = 'service_role');