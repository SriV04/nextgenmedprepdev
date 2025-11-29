# Zoom Integration - Quick Reference

## 🚀 Quick Start

```bash
# 1. Install dependencies (already done)
cd apps/backend && npm install

# 2. Add to .env
ZOOM_ACCOUNT_ID="your_account_id"
ZOOM_CLIENT_ID="your_client_id"
ZOOM_CLIENT_SECRET="your_client_secret"

# 3. Run database migration
# Execute SQL from docs/ZOOM_INTEGRATION_MIGRATION.md in Supabase

# 4. Restart server
npm run dev
```

## 📁 Files Modified

```
apps/backend/src/
├── services/
│   ├── zoomService.ts           [NEW] - Zoom API integration
│   └── emailService.ts           [MODIFIED] - Uses real Zoom links
└── controllers/
    ├── interviewBookingController.ts  [MODIFIED] - Booking flow
    └── interviewController.ts         [MODIFIED] - Zoom meeting lifecycle

docs/
├── ZOOM_INTEGRATION_GUIDE.md         [NEW] - Complete setup guide
├── ZOOM_INTEGRATION_MIGRATION.md     [NEW] - DB migration
├── ZOOM_IMPLEMENTATION_SUMMARY.md    [NEW] - Implementation details
└── ENVIRONMENT_VARIABLES.md          [MODIFIED] - Added Zoom vars
```

## 🔧 API Usage

### Import the Service
```typescript
import zoomService from '../services/zoomService';
```

### Create Meeting
```typescript
const meeting = await zoomService.createInterviewMeeting({
  studentName: 'Jane Smith',
  tutorName: 'John Doe',
  universityName: 'Oxford',
  startTime: new Date('2024-01-15T14:00:00Z'),
  duration: 60
});
// Returns: { meetingId, joinUrl, startUrl, password }
```

### Check Configuration
```typescript
if (zoomService.isConfigured()) {
  // Zoom is ready to use
}
```

### Get Meeting
```typescript
const details = await zoomService.getMeeting(meetingId);
```

### Update Meeting
```typescript
await zoomService.updateMeeting(meetingId, {
  startTime: new Date('2024-01-16T15:00:00Z'),
  duration: 90
});
```

### Delete Meeting
```typescript
await zoomService.deleteMeeting(meetingId);
```

## 🗄️ Database Schema

```sql
interviews table:
  + zoom_meeting_id VARCHAR(255)  -- Zoom's meeting ID
  + zoom_join_url TEXT            -- Full join URL for participants
```

## 🔄 Integration Points

### 1. Interview Assignment (`assignInterviewToTutor`)
- **When**: Admin assigns tutor with scheduled time
- **Action**: Creates Zoom meeting automatically
- **Stores**: `zoom_meeting_id`, `zoom_join_url`

### 2. Interview Confirmation (`confirmInterview`)
- **When**: Sending confirmation emails
- **Action**: Creates meeting if doesn't exist
- **Sends**: Emails with Zoom link to tutor and student

### 3. Interview Deletion (`deleteInterview`)
- **When**: Interview is cancelled
- **Action**: Deletes Zoom meeting from Zoom
- **Cleans**: Meeting data from database

## 📧 Email Integration

```typescript
// Old (removed)
const zoomLink = this.generateZoomLink(interviewId); // ❌

// New
await emailService.sendInterviewConfirmationEmail(
  tutorEmail,
  tutorName,
  studentEmail,
  studentName,
  scheduledAt,
  interviewId,
  zoomJoinUrl  // ✅ Real Zoom URL passed as parameter
);
```

## 🎛️ Meeting Settings

```javascript
Default configuration:
- Host video: ON
- Participant video: ON
- Join before host: OFF (host must start)
- Waiting room: ON (security)
- Audio: Both phone and computer
- Auto-recording: OFF
- Duration: 60 minutes
- Timezone: Europe/London
```

## 🧪 Testing

```bash
# Check Zoom configuration logs
npm run dev
# Look for: "Zoom API credentials configured" or "not configured"

# Test meeting creation
# Assign interview via API and check Supabase interviews table
# for zoom_meeting_id and zoom_join_url fields
```

## ⚠️ Error Handling

The integration gracefully handles:
- Missing Zoom credentials (logs warning, continues without Zoom)
- API failures (logs error, continues with placeholder)
- Token expiration (automatically refreshes)
- Network issues (catches and logs)

## 🔒 Security Notes

- Credentials stored in `.env` (not in code)
- Token cached in memory (not persisted)
- Waiting room enabled by default
- Host required to start meeting

## 📊 Rate Limits

- Meeting API: 100 requests/day/user
- Token refresh: Auto-handled (cached ~1 hour)

## 🆘 Troubleshooting

### "Zoom not configured"
- Check `.env` has all three variables
- Restart backend server

### "Failed to create meeting"
- Verify Zoom app is activated
- Check scopes: `meeting:write:admin`, `meeting:read:admin`, etc.
- Ensure Pro/Business/Enterprise account

### Meeting not in Zoom dashboard
- Server-to-Server meetings don't show in personal list
- Check: Admin Dashboard → Account Management → Reports

## 📞 Support

- Zoom API Docs: https://marketplace.zoom.us/docs/api-reference
- Detailed Guide: `docs/ZOOM_INTEGRATION_GUIDE.md`
- Migration Steps: `docs/ZOOM_INTEGRATION_MIGRATION.md`
