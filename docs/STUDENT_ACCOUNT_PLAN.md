# Student Account Auto-Creation Plan

## Goal
Automatically create a student account at the moment an interview is booked, using the booking email. Send the student an email with account details and a direct link to their dashboard. The dashboard should allow availability submission and show upcoming and previous sessions from the database.

## Scope
- Trigger account creation when a booking is confirmed.
- Use the booking email as the primary identifier.
- Send an email containing:
  - Login method or first-time access instructions
  - Dashboard link
- Provide a student dashboard page with:
  - Availability submission section
  - Lists of upcoming and previous sessions

## Data Flow (Happy Path)
1. Booking confirmed event received.
2. Look up student by booking email.
3. If no account exists, create one.
4. Provision initial password or one-time login token.
5. Persist linkage between booking and student account.
6. Send booking confirmation email that includes account details and dashboard link.
7. Student visits dashboard to submit availability and review sessions.

## Data Model Additions
- users table:
  - id (uuid, PK)
  - auth_id (auth.user id)
  - created_from_booking_id (nullable)
  - created_at, updated_at

## Auth + Account Creation
- On booking confirmation:
  - check if user record present and has auth_id associated to it
  - if either not - create new account for that email populating the auth_id
- Avoid duplicate accounts by enforcing unique email in student_profiles and checking auth.users first.

## Email Requirements
- Extend booking confirmation template:
  - Dashboard link (deep link to student portal).
  - First-time access instructions:
    - If using magic link: include tokenized URL.
    - If using temp password: include password + reset link.
- Add tracking fields as needed for delivery status.

## Student Dashboard Page
### Availability Submission
- Form inputs:
  - Timezone
  - Weekly availability (day + time ranges)
  - Notes/preferences
- Submit to API to store in availability table.

### Sessions View
- Upcoming sessions:
  - status in ("upcoming", "scheduled")
  - scheduled_at in future
- Previous sessions:
  - status in ("completed", "canceled")
  - scheduled_at in past or completed_at set
- Sort and paginate if needed.

## API Endpoints
- POST /student/availability
  - Auth required
  - Upsert by student_user_id
- GET /student/sessions?filter=upcoming|previous
  - Auth required
- POST /booking/confirm (existing)
  - Hook to create/attach account and send email

## Security + Compliance
- Use server-side creation for accounts; do not expose temp password in logs.
- Rate-limit account creation on booking endpoint.
- Enforce RBAC for student-only resources.

## Rollout Steps
1. Add data model updates and migrations.
2. Implement account creation in booking confirmation flow.
3. Update email templates with account info and link.
4. Build student dashboard components and API endpoints.
5. QA with staging booking flow and email delivery.
6. Monitor auth user creation metrics and email bounce rates.

## Testing Checklist
- Booking with new email creates user and profile.
- Booking with existing email links to existing user.
- Email includes correct dashboard link.
- Availability submission saves and loads.
- Sessions list shows correct upcoming/previous data.
