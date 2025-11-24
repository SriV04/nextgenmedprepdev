# Zoom Integration - Database Migration

## Overview

This document describes the database schema changes required to support Zoom integration for interview bookings.

## Required Database Changes

### Interviews Table

Add the following columns to the `interviews` table in Supabase:

```sql
-- Add Zoom meeting ID column
ALTER TABLE interviews 
ADD COLUMN zoom_meeting_id VARCHAR(255);

-- Add Zoom join URL column
ALTER TABLE interviews 
ADD COLUMN zoom_join_url TEXT;

-- Add index for efficient Zoom meeting lookups
CREATE INDEX idx_interviews_zoom_meeting_id ON interviews(zoom_meeting_id);
```

## Migration Steps

### 1. Via Supabase Dashboard (Recommended)

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the SQL above
5. Execute the query

### 2. Via Supabase CLI

If you're using migrations in your project:

1. Create a new migration file:
   ```bash
   cd apps/backend/supabase
   supabase migration new add_zoom_fields_to_interviews
   ```

2. Add the SQL to the migration file created in `supabase/migrations/`

3. Apply the migration:
   ```bash
   supabase db push
   ```

## Field Descriptions

| Column | Type | Description |
|--------|------|-------------|
| `zoom_meeting_id` | VARCHAR(255) | Zoom's unique meeting identifier. Used to update or delete meetings via API |
| `zoom_join_url` | TEXT | The full Zoom meeting join URL that participants use to join the meeting |

## Verification

After applying the migration, verify the columns were added:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'interviews'
AND column_name IN ('zoom_meeting_id', 'zoom_join_url');
```

## Rollback

If you need to rollback these changes:

```sql
-- Remove Zoom columns
ALTER TABLE interviews 
DROP COLUMN IF EXISTS zoom_meeting_id,
DROP COLUMN IF EXISTS zoom_join_url;

-- Drop index
DROP INDEX IF EXISTS idx_interviews_zoom_meeting_id;
```

## Notes

- The `zoom_meeting_id` field is nullable because interviews can be created before they are scheduled with a specific time
- Zoom meetings are created when:
  1. An interview is assigned to a tutor with a scheduled time (via `assignInterviewToTutor`)
  2. A confirmation is sent (via `confirmInterview`) if the meeting doesn't exist yet
- Existing interviews will have NULL values for these fields until they are scheduled and Zoom meetings are created

## Related Files

- `apps/backend/src/services/zoomService.ts` - Zoom API integration service
- `apps/backend/src/controllers/interviewController.ts` - Interview assignment and confirmation logic
- `apps/backend/src/controllers/interviewBookingController.ts` - Initial booking creation
- `apps/backend/src/services/emailService.ts` - Email service with Zoom link integration
