# Zoom API Integration Guide

## Overview

This guide explains how to set up and use the Zoom API integration for automatic meeting creation in the NextGen MedPrep interview booking system.

## Features

- ✅ Automatic Zoom meeting creation when interviews are scheduled
- ✅ Unique meeting links for each interview session
- ✅ Automatic meeting cleanup when interviews are deleted
- ✅ Email notifications with meeting links to both tutors and students
- ✅ Waiting room and security features enabled by default

## Prerequisites

1. A Zoom account (Pro, Business, or Enterprise)
2. Zoom Server-to-Server OAuth app credentials

## Setup Instructions

### Step 1: Create a Zoom Server-to-Server OAuth App

1. Go to [Zoom App Marketplace](https://marketplace.zoom.us/)
2. Click **Develop** → **Build App**
3. Choose **Server-to-Server OAuth**
4. Fill in the app information:
   - **App Name**: NextGen MedPrep Interview Scheduler
   - **Company Name**: NextGen MedPrep
   - **Developer Email**: Your email
5. Click **Create**

### Step 2: Configure App Credentials

1. After creating the app, you'll see:
   - **Account ID**
   - **Client ID**
   - **Client Secret**
2. Copy these values (you'll need them for environment variables)

### Step 3: Add Required Scopes

Navigate to the **Scopes** tab and add:
- `meeting:write:admin` - Create meetings
- `meeting:read:admin` - Read meeting details
- `meeting:update:admin` - Update meetings
- `meeting:delete:admin` - Delete meetings

Click **Continue** and **Activate** the app.

### Step 4: Configure Environment Variables

Add the following to your root `.env` file:

```bash
# Zoom API Configuration
ZOOM_ACCOUNT_ID="your_account_id_here"
ZOOM_CLIENT_ID="your_client_id_here"
ZOOM_CLIENT_SECRET="your_client_secret_here"
```

Replace the placeholder values with your actual credentials from Step 2.

### Step 5: Apply Database Migration

Run the database migration to add Zoom fields to the interviews table:

```sql
-- Add Zoom meeting ID column
ALTER TABLE interviews 
ADD COLUMN zoom_meeting_id VARCHAR(255);

-- Add Zoom join URL column
ALTER TABLE interviews 
ADD COLUMN zoom_join_url TEXT;

-- Add index for efficient lookups
CREATE INDEX idx_interviews_zoom_meeting_id ON interviews(zoom_meeting_id);
```

See `docs/ZOOM_INTEGRATION_MIGRATION.md` for detailed migration instructions.

### Step 6: Restart the Backend Server

```bash
cd apps/backend
npm run dev
```

## How It Works

### 1. Interview Assignment with Zoom Meeting Creation

When an admin assigns a tutor to an interview with a scheduled time:

```typescript
// POST /api/interviews/:id/assign
{
  "tutor_id": "uuid-of-tutor",
  "scheduled_at": "2024-01-15T14:00:00Z",
  "availability_slot_id": "uuid-of-slot"
}
```

The system automatically:
1. Creates a Zoom meeting for the scheduled time
2. Stores the meeting ID and join URL in the database
3. Returns the interview with Zoom details

### 2. Sending Confirmation Emails

When confirmation emails are sent:

```typescript
// POST /api/interviews/:id/confirm
{
  "tutor_id": "uuid",
  "tutor_name": "John Doe",
  "scheduled_at": "2024-01-15T14:00:00Z",
  "student_email": "student@example.com",
  "student_name": "Jane Smith"
}
```

The system:
1. Checks if a Zoom meeting exists for the interview
2. Creates one if it doesn't exist
3. Sends emails to both tutor and student with the Zoom link

### 3. Deleting Interviews

When an interview is deleted:

```typescript
// DELETE /api/interviews/:id
```

The system automatically:
1. Deletes the Zoom meeting from Zoom
2. Clears the tutor availability slot
3. Removes the interview from the database

## Zoom Meeting Settings

Default settings for all created meetings:

```javascript
{
  host_video: true,              // Host video on by default
  participant_video: true,       // Participant video on by default
  join_before_host: false,       // Require host to start
  mute_upon_entry: false,        // Don't mute participants
  waiting_room: true,            // Enable waiting room for security
  audio: 'both',                 // Allow phone and computer audio
  auto_recording: 'none'         // Don't auto-record
}
```

## API Reference

### ZoomService Methods

```typescript
// Create a meeting
const meeting = await zoomService.createInterviewMeeting({
  studentName: 'Jane Smith',
  tutorName: 'John Doe',
  universityName: 'Oxford',
  startTime: new Date('2024-01-15T14:00:00Z'),
  duration: 60 // minutes
});
// Returns: { meetingId, joinUrl, startUrl, password }

// Get meeting details
const details = await zoomService.getMeeting(meetingId);

// Update a meeting
await zoomService.updateMeeting(meetingId, {
  topic: 'Updated Topic',
  startTime: new Date('2024-01-16T15:00:00Z'),
  duration: 90
});

// Delete a meeting
await zoomService.deleteMeeting(meetingId);

// Check if Zoom is configured
const isConfigured = zoomService.isConfigured();
```

## Troubleshooting

### "Zoom API credentials not configured" Warning

**Problem**: The backend logs show Zoom credentials are not configured.

**Solution**: 
1. Verify your `.env` file has all three Zoom variables
2. Restart the backend server
3. Check that the `.env` file is in the root directory

### "Failed to get Zoom access token"

**Problem**: Unable to authenticate with Zoom API.

**Solution**:
1. Verify your credentials are correct
2. Ensure your Server-to-Server OAuth app is activated
3. Check that all required scopes are added
4. Verify Account ID, Client ID, and Client Secret match

### "Failed to create Zoom meeting"

**Problem**: Meeting creation fails.

**Solution**:
1. Check that your Zoom account has an active Pro/Business/Enterprise license
2. Verify the `meeting:write:admin` scope is enabled
3. Check that the scheduled time is in the future
4. Review backend logs for specific error messages

### Meetings Not Appearing in Zoom Dashboard

**Problem**: Meetings are created but don't show in your Zoom account.

**Solution**:
- Server-to-Server OAuth meetings are created under the account, not a specific user
- Check in Zoom Admin Dashboard → Account Management → Meeting Reports
- The meetings will appear when the scheduled time arrives

## Testing

### Test Zoom Configuration

```bash
# Check if Zoom is configured (from backend directory)
curl http://localhost:5001/api/health
```

### Create a Test Meeting

```javascript
// Using the zoomService directly
import zoomService from './services/zoomService';

const testMeeting = await zoomService.createInterviewMeeting({
  studentName: 'Test Student',
  startTime: new Date(Date.now() + 3600000), // 1 hour from now
  duration: 30
});

console.log('Test meeting created:', testMeeting.joinUrl);
```

## Security Best Practices

1. **Never commit credentials**: Ensure `.env` is in `.gitignore`
2. **Use environment-specific credentials**: Different credentials for dev/staging/production
3. **Rotate secrets regularly**: Update Client Secret periodically
4. **Monitor API usage**: Check Zoom API dashboard for unusual activity
5. **Enable waiting rooms**: Already enabled by default for security

## Production Deployment

### Vercel / Railway / Heroku

Set environment variables in your platform's dashboard:

```
ZOOM_ACCOUNT_ID=your_account_id
ZOOM_CLIENT_ID=your_client_id  
ZOOM_CLIENT_SECRET=your_client_secret
```

### Docker

Add to your `docker-compose.yml`:

```yaml
services:
  backend:
    environment:
      - ZOOM_ACCOUNT_ID=${ZOOM_ACCOUNT_ID}
      - ZOOM_CLIENT_ID=${ZOOM_CLIENT_ID}
      - ZOOM_CLIENT_SECRET=${ZOOM_CLIENT_SECRET}
```

## Rate Limits

Zoom API rate limits (as of 2024):
- **Meeting API**: 100 requests per day per user
- **OAuth Token**: Cached for ~1 hour, automatically refreshed

The service includes token caching to minimize API calls.

## Support Resources

- [Zoom API Documentation](https://marketplace.zoom.us/docs/api-reference/introduction)
- [Server-to-Server OAuth Guide](https://marketplace.zoom.us/docs/guides/build/server-to-server-oauth-app)
- [Zoom API Forum](https://devforum.zoom.us/)

## Related Documentation

- `docs/ENVIRONMENT_VARIABLES.md` - All environment variables
- `docs/ZOOM_INTEGRATION_MIGRATION.md` - Database migration guide
- `docs/INTERVIEW_CONFIRMATION_WORKFLOW.md` - Interview booking workflow
