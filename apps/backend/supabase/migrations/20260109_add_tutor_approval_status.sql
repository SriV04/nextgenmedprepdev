-- Add approval_status column to tutors table
-- This allows us to control which tutors can access the portal

ALTER TABLE public.tutors 
ADD COLUMN IF NOT EXISTS approval_status text NOT NULL DEFAULT 'pending' 
CHECK (approval_status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text]));

-- Add approved_at timestamp
ALTER TABLE public.tutors 
ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone;

-- Add approved_by to track who approved the tutor
ALTER TABLE public.tutors 
ADD COLUMN IF NOT EXISTS approved_by uuid;

-- Add comment for clarity
COMMENT ON COLUMN public.tutors.approval_status IS 'Approval status for tutor access: pending, approved, rejected';
COMMENT ON COLUMN public.tutors.approved_at IS 'Timestamp when the tutor was approved';
COMMENT ON COLUMN public.tutors.approved_by IS 'User ID of admin who approved the tutor';

-- Set existing tutors to approved (grandfathering existing accounts)
UPDATE public.tutors 
SET approval_status = 'approved', 
    approved_at = created_at 
WHERE approval_status = 'pending';
