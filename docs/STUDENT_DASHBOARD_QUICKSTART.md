# Student Dashboard Quick Start Guide

## Prerequisites
- Backend server running
- Database migrations applied
- Frontend development server running

## 1. Apply Database Migration

```bash
# Navigate to backend directory
cd apps/backend

# Apply the migration (adjust path to your Supabase instance)
# Option A: Via Supabase CLI
supabase migration up

# Option B: Direct SQL execution
psql $DATABASE_URL -f supabase/migrations/007_add_student_profiles_and_enhance_availability.sql
```

## 2. Verify Environment Variables

Ensure your `.env` file has:
```bash
# Backend (.env in root or apps/backend)
FRONTEND_URL=http://localhost:3000  # Or your production URL

# Frontend (apps/frontend/.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 3. Start the Servers

```bash
# Terminal 1: Backend
cd apps/backend
npm run dev

# Terminal 2: Frontend
cd apps/frontend
npm run dev
```

## 4. Test the Flow

### Step 1: Create a Test Booking
Since you need a booking to create a student account, either:
- Make a test booking through the interview booking flow
- Manually create a user in the database

### Step 2: Get Student ID
```sql
-- Query to find a student ID
SELECT id, email, full_name FROM users WHERE role = 'student' LIMIT 1;
```

### Step 3: Access Dashboard
Navigate to:
```
http://localhost:3000/student-dashboard?student_id=YOUR_STUDENT_ID
```

Replace `YOUR_STUDENT_ID` with the actual UUID from step 2.

## 5. Test Features

### Test Availability Submission
1. Go to "My Availability" tab
2. Select timezone
3. Add a specific date (today or future)
4. Set time range (e.g., 9:00 - 17:00)
5. Click "Add Date"
6. Add notes (optional)
7. Click "Submit Availability"
8. Verify success message

### Verify in Database
```sql
-- Check student profile was created
SELECT * FROM student_profiles WHERE user_id = 'YOUR_STUDENT_ID';

-- Check availability was saved
SELECT * FROM student_availability WHERE student_id = 'YOUR_STUDENT_ID';
```

### Test Sessions View
1. Go to "My Sessions" tab
2. Toggle between "Upcoming" and "Previous"
3. Verify sessions display (if any exist)

### Create Test Session
```sql
-- Create a test interview session
INSERT INTO interviews (
    student_id, 
    university, 
    scheduled_at, 
    status
) VALUES (
    'YOUR_STUDENT_ID',
    'University of Cambridge',
    NOW() + INTERVAL '7 days',  -- 7 days from now
    'scheduled'
);
```

Refresh the dashboard to see the new session.

## 6. Test Email Template

### Trigger Confirmation Email
Complete a test booking through the payment flow. The confirmation email should:
- Include the student's name
- Show booking details
- **Have a blue dashboard section** with "Access Your Dashboard →" button
- Link should be: `http://localhost:3000/student-dashboard?student_id=STUDENT_ID`

### Manual Email Test
```typescript
// In apps/backend, create a test script or use the Node REPL
import emailService from './src/services/emailService';

await emailService.sendInterviewBookingConfirmationEmail(
  'test@example.com',
  {
    bookingId: 'test-booking-123',
    userName: 'John Doe',
    packageType: 'core',
    serviceType: 'live',
    universities: ['Oxford', 'Cambridge'],
    amount: 199,
    studentId: 'YOUR_STUDENT_ID'
  }
);
```

## 7. API Endpoint Testing

### Test with cURL

#### Get Student Profile
```bash
curl "http://localhost:5000/api/v1/student/profile?student_id=YOUR_STUDENT_ID"
```

#### Get Sessions
```bash
# All sessions
curl "http://localhost:5000/api/v1/student/sessions?student_id=YOUR_STUDENT_ID"

# Upcoming only
curl "http://localhost:5000/api/v1/student/sessions?student_id=YOUR_STUDENT_ID&filter=upcoming"

# Previous only
curl "http://localhost:5000/api/v1/student/sessions?student_id=YOUR_STUDENT_ID&filter=previous"
```

#### Submit Availability
```bash
curl -X POST http://localhost:5000/api/v1/student/availability \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "YOUR_STUDENT_ID",
    "timezone": "Europe/London",
    "specific_dates": [
      {
        "date": "2025-12-25",
        "hour_start": 9,
        "hour_end": 17,
        "type": "interview"
      }
    ],
    "notes": "Prefer morning sessions"
  }'
```

## 8. Common Issues & Solutions

### Issue: Dashboard shows "Authentication Required"
**Solution:** Ensure you have `?student_id=UUID` in the URL

### Issue: API returns 404 or CORS error
**Solution:** 
- Check backend is running on port 5000
- Verify `NEXT_PUBLIC_API_URL` in frontend env
- Check CORS settings in `apps/backend/src/app.ts`

### Issue: Email doesn't include dashboard link
**Solution:**
- Verify `FRONTEND_URL` is set in backend env
- Check `studentId` is passed to email service
- Look for `${dashboardLink}` in email template

### Issue: No sessions showing in dashboard
**Solution:**
- Verify interviews exist in database for that student_id
- Check `student_id` foreign key matches
- Ensure interviews have `scheduled_at` date set

### Issue: Availability submission fails
**Solution:**
- Check date format is `YYYY-MM-DD`
- Verify `hour_start` < `hour_end`
- Ensure `student_id` exists in `users` table

## 9. Database Inspection Queries

```sql
-- View all student profiles
SELECT 
    sp.*,
    u.email,
    u.full_name,
    b.id as booking_id
FROM student_profiles sp
JOIN users u ON sp.user_id = u.id
LEFT JOIN bookings b ON sp.created_from_booking_id = b.id;

-- View student availability
SELECT 
    sa.*,
    u.email,
    u.full_name
FROM student_availability sa
JOIN users u ON sa.student_id = u.id
ORDER BY sa.date DESC;

-- View interviews with student info
SELECT 
    i.*,
    u.full_name as student_name,
    u.email as student_email,
    t.name as tutor_name
FROM interviews i
JOIN users u ON i.student_id = u.id
LEFT JOIN tutors t ON i.tutor_id = t.id
ORDER BY i.scheduled_at DESC;
```

## 10. Next Steps

After testing locally:

1. **Deploy to Staging:**
   - Apply migration to staging database
   - Update environment variables
   - Deploy backend and frontend
   - Test complete booking flow

2. **Production Deployment:**
   - Backup production database
   - Apply migration during maintenance window
   - Update production environment variables
   - Monitor error logs after deployment
   - Send test booking to verify emails

3. **User Onboarding:**
   - Update documentation with dashboard instructions
   - Create help articles for students
   - Train support team on dashboard features

## 📚 Additional Resources

- [Complete Implementation Doc](./STUDENT_ACCOUNT_IMPLEMENTATION.md)
- [Original Plan](./STUDENT_ACCOUNT_PLAN.md)
- [API Documentation](../apps/backend/README.md)
- [Frontend Setup](../apps/frontend/README.md)

## 🆘 Getting Help

If you encounter issues:
1. Check the console logs (browser & backend)
2. Verify database schema matches migration
3. Review environment variables
4. Check network tab in browser dev tools
5. Consult implementation documentation

---

Happy testing! 🚀
