-- Migration: Add Resources and Resource Downloads tables
-- Version: 001
-- Date: 2025-06-02

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- Resources Table
-- Stores information about downloadable resources (PDFs, guides, etc.)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    allowed_tiers TEXT[] NOT NULL DEFAULT ARRAY['free'],
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add update trigger for resources
CREATE TRIGGER IF NOT EXISTS resources_updated_at_modtime
    BEFORE UPDATE ON public.resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_resources_active ON public.resources(is_active);
CREATE INDEX IF NOT EXISTS idx_resources_tiers ON public.resources USING GIN(allowed_tiers);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources(created_at);

-- -----------------------------------------------------------------------------
-- Resource Downloads Table
-- Tracks resource download events for analytics
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resource_downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    resource_id TEXT NOT NULL,
    download_source TEXT,
    downloaded_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    -- Foreign key constraint to resources table
    CONSTRAINT fk_resource_downloads_resource_id 
        FOREIGN KEY (resource_id) REFERENCES public.resources(id) ON DELETE CASCADE
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_resource_downloads_email ON public.resource_downloads(email);
CREATE INDEX IF NOT EXISTS idx_resource_downloads_resource_id ON public.resource_downloads(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_downloads_downloaded_at ON public.resource_downloads(downloaded_at);
CREATE INDEX IF NOT EXISTS idx_resource_downloads_source ON public.resource_downloads(download_source);

-- -----------------------------------------------------------------------------
-- Insert Sample Resources
-- -----------------------------------------------------------------------------
INSERT INTO public.resources (id, name, description, file_path, allowed_tiers) VALUES
    ('ugam-guide', 'Ultimate Guide to Medicine Application', 'Comprehensive guide for medical school applications including UCAS, personal statements, and interview preparation', 'ugam-guide.pdf', ARRAY['free', 'newsletter_only', 'premium_basic', 'premium_plus']),
    ('mcat-prep-guide', 'MCAT Preparation Guide', 'Essential MCAT preparation strategies and study techniques', 'mcat-prep-guide.pdf', ARRAY['free', 'newsletter_only', 'premium_basic', 'premium_plus']),
    ('interview-prep-advanced', 'Advanced Interview Preparation', 'Advanced medical school interview techniques and mock scenarios', 'interview-prep-advanced.pdf', ARRAY['premium_basic', 'premium_plus']),
    ('premium-templates', 'Premium Application Templates', 'Exclusive templates for personal statements and application essays', 'premium-templates.pdf', ARRAY['premium_plus'])
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    file_path = EXCLUDED.file_path,
    allowed_tiers = EXCLUDED.allowed_tiers,
    updated_at = now();

-- -----------------------------------------------------------------------------
-- RLS (Row Level Security) Policies
-- -----------------------------------------------------------------------------

-- Enable RLS on resources table
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active resources
CREATE POLICY "Anyone can read active resources" ON public.resources
    FOR SELECT USING (is_active = true);

-- Policy: Only authenticated users can manage resources (for admin endpoints)
-- Note: In production, you would want more specific admin-only policies
CREATE POLICY "Authenticated users can manage resources" ON public.resources
    FOR ALL USING (auth.role() = 'authenticated');

-- Enable RLS on resource downloads table
ALTER TABLE public.resource_downloads ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own downloads
CREATE POLICY "Users can see their own downloads" ON public.resource_downloads
    FOR SELECT USING (auth.email() = email);

-- Policy: Service can insert download logs
CREATE POLICY "Service can insert download logs" ON public.resource_downloads
    FOR INSERT WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- Storage Setup for free-resources bucket
-- -----------------------------------------------------------------------------

-- Note: The storage bucket 'free-resources' should be created in Supabase dashboard
-- with the following policies:

-- Policy for reading files (authenticated users only):
-- Name: "Authenticated users can download resources"
-- Operation: SELECT
-- Policy: (auth.role() = 'authenticated')

-- Policy for uploading files (admin only):
-- Name: "Admin can upload resources"  
-- Operation: INSERT
-- Policy: (auth.email() = 'admin@nextgenmedprep.com') -- Replace with your admin email
