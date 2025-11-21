# Interview Confirmation Workflow

## Overview
This document describes the interview confirmation workflow that allows tutors to assign interviews and send automated confirmation emails with Zoom links to both tutors and students.

## Features

### 1. Pending Changes Tracking
- **Location**: `apps/frontend/contexts/TutorCalendarContext.tsx`
- When an interview is assigned to a tutor, it's added to a pending changes array
- Changes are stored locally until explicitly committed
- Provides visibility into uncommitted assignments

### 2. Commit Changes UI
- **Component**: `apps/frontend/components/tutor-calendar/CommitChangesBar.tsx`
- Displays a prominent bar when there are pending changes
- Shows count of pending assignments
- Provides two actions:
  - **Commit & Send Emails**: Sends confirmation emails to all tutors and students
  - **Discard**: Removes pending changes and refreshes to original state

### 3. Email Confirmation Backend
- **Service**: `apps/backend/src/services/emailService.ts`
- **Method**: `sendInterviewConfirmationEmail()`
- Generates Zoom meeting links (placeholder for now - integrate Zoom API later)
- Sends separate emails to tutor and student with:
  - Interview date and time
  - Zoom meeting link
  - Formatted HTML templates with branding

### 4. Confirmation Endpoint
- **Route**: `POST /api/v1/interviews/:id/confirm`
- **Controller**: `apps/backend/src/controllers/interviewController.ts`
- **Function**: `confirmInterview()`
- Validates interview assignment
- Retrieves tutor email from database
- Triggers email notifications

## Workflow

1. **Assign Interview**
   - Tutor drags/assigns interview in calendar UI
   - Frontend validates availability slot
   - Backend updates database (interview + availability slot)
   - Frontend adds to pending changes array
   - UI shows pending count in commit bar

2. **Commit Changes**
   - User clicks "Commit & Send Emails" button
   - Frontend iterates through pending changes
   - For each assignment:
     - Calls `POST /api/v1/interviews/:id/confirm`
     - Backend retrieves tutor email
     - Backend sends emails to tutor and student
   - Pending changes cleared
   - Success message displayed

3. **Email Delivery**
   - **Tutor Email**: "New Interview Scheduled"
     - Student name
     - Date and time
     - Zoom link
   - **Student Email**: "Interview Confirmed"
     - Tutor name
     - Date and time
     - Zoom link
     - Tip to join 5 minutes early

## API Contract

### Confirm Interview Request
```typescript
POST /api/v1/interviews/:id/confirm

Body:
{
  "tutor_id": "uuid",
  "tutor_name": "string",
  "scheduled_at": "ISO 8601 datetime",
  "student_email": "email",
  "student_name": "string"
}

Response:
{
  "success": true,
  "message": "Confirmation emails sent successfully",
  "data": {
    "interview_id": "uuid",
    "tutor_email": "email",
    "student_email": "email"
  }
}
```

## Future Enhancements

### Zoom API Integration
Replace placeholder Zoom link generation with actual Zoom API integration:
```typescript
// In emailService.ts - generateZoomLink()
import axios from 'axios';

private async generateZoomLink(interviewId: string, scheduledAt: string): Promise<string> {
  const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
    topic: `Medical School Interview - ${interviewId}`,
    type: 2, // Scheduled meeting
    start_time: scheduledAt,
    duration: 60,
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: true,
      waiting_room: false,
    }
  }, {
    headers: {
      Authorization: `Bearer ${process.env.ZOOM_JWT_TOKEN}`
    }
  });
  
  return response.data.join_url;
}
```

### Calendar Integration
- Add `.ics` file attachments to emails
- Allow users to add directly to Google Calendar/Outlook

### Reminder System
- Schedule reminder emails 24 hours before interview
- Send follow-up emails after interview completion

### Bulk Operations
- Support bulk assignment confirmation
- Batch email sending for multiple interviews

## Testing

### Manual Testing Steps
1. Navigate to tutor dashboard at `/tutor-dashboard`
2. Switch to Calendar tab
3. Assign an unassigned interview to a tutor slot
4. Verify pending changes bar appears
5. Click "Commit & Send Emails"
6. Check both tutor and student email inboxes
7. Verify Zoom links are included
8. Test "Discard" button functionality

### Environment Variables Required
```env
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-password
EMAIL_FROM=NextGen MedPrep <noreply@nextgenmedprep.com>
```

## Files Modified

### Frontend
- `apps/frontend/contexts/TutorCalendarContext.tsx` - Added pending changes state and commit logic
- `apps/frontend/components/tutor-calendar/CommitChangesBar.tsx` - New component for commit UI
- `apps/frontend/app/tutor-dashboard/page.tsx` - Added CommitChangesBar import and rendering

### Backend
- `apps/backend/src/services/emailService.ts` - Added interview confirmation email methods
- `apps/backend/src/controllers/interviewController.ts` - Added confirmInterview controller
- `apps/backend/src/routes/interviews.ts` - Added confirmation route

## Architecture Decisions

1. **Pending Changes Pattern**: Allows batch confirmation instead of immediate email sending, giving tutors flexibility to review assignments before committing

2. **Separate Tutor/Student Templates**: Different email content for different audiences (tutor gets "new assignment", student gets "confirmation")

3. **Placeholder Zoom Links**: Deferred Zoom API integration to avoid complexity; can be added later without changing workflow

4. **Frontend-Driven Confirmation**: Frontend orchestrates the confirmation loop, allowing UI feedback and error handling per interview

