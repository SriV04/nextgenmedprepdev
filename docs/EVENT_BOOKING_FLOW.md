# Event Booking System - Complete Flow Documentation

## Overview
This document explains how event bookings work in the NextGen MedPrep platform, from the user clicking "Book" to the data being stored in the database.

## Database Schema

### Tables Involved:

1. **users** - Stores user information
   - `id` (UUID, primary key)
   - `email` (unique)
   - `full_name`
   - `role` (student/admin)
   - `stripe_customer_id`

2. **subscriptions** - Stores subscription/newsletter data
   - `email` (unique)
   - `user_id` (foreign key to users)
   - `subscription_tier` (free/premium)
   - `opt_in_newsletter`

3. **bookings** - Stores all bookings (interviews, events, consultations, etc.)
   - `id` (UUID, primary key)
   - `user_id` (foreign key to users)
   - `start_time` (timestamp)
   - `end_time` (timestamp)
   - `package` (string) - **This is where event info is stored**
   - `amount` (decimal)
   - `email`
   - `payment_status` (paid/pending/cancelled)
   - `preferred_time` (optional)
   - `created_at`

## Event Booking Flow

### 1. **Frontend - Events Page** (`/events`)

The user sees:
- **Featured upcoming event**: Interview Background Knowledge Conference (Nov 2, 2025)
- **Previous events section**: Past conferences for reference

Event data structure:
```typescript
{
  id: 'interview_background_knowledge_2025_11_02',  // Unique event identifier
  title: "Interview Background Knowledge Conference",
  date: "2025-11-02",
  time: "10:00 AM - 3:00 PM",
  type: "interview",
  price: 20,
  spots: 30
}
```

When user clicks "Book Your Spot Now", they are redirected to:
```
/event-pay?eventId=interview_background_knowledge_2025_11_02
          &event=Interview%20Background%20Knowledge%20Conference
          &date=2025-11-02
          &price=20
```

### 2. **Frontend - Payment Page** (`/event-pay`)

The payment page:
1. Reads URL parameters to get event details
2. User selects number of tickets
3. Fills in payment form with email and name
4. Metadata is prepared:
```typescript
{
  type: 'event_booking',
  event_id: 'interview_background_knowledge_2025_11_02',
  event_name: 'Interview Background Knowledge Conference',
  event_date: '2025-11-02',
  number_of_tickets: '2',
  price_per_ticket: '20'
}
```

5. Payment form sends this to backend: `POST /api/payments/create`

### 3. **Backend - Payment Creation**

**Controller**: `paymentController.createPayment()`
- Validates payment data
- Calls `stripeService.createCheckoutPayment()`

**Stripe Service**:
- Creates Stripe Checkout session
- Metadata is attached to the session
- User is redirected to Stripe payment page

### 4. **Payment Completion - Stripe Webhook**

When payment succeeds, Stripe sends webhook to: `POST /api/webhooks/stripe`

**Webhook Handler**:
1. `handleCheckoutSessionCompleted()` - Processes the session
2. Retrieves payment intent with metadata
3. Routes to `handleEventBookingPayment()` based on `type: 'event_booking'`

### 5. **Event Booking Processing**

**Function**: `handleEventBookingPayment(paymentIntent)`

**Steps**:

1. **Extract Metadata**:
```typescript
const metadata = paymentIntent.metadata;
const customerEmail = metadata.customer_email;      // "student@example.com"
const customerName = metadata.customer_name;        // "John Doe"
const eventId = metadata.event_id;                  // "interview_background_knowledge_2025_11_02"
const eventName = metadata.event_name;              // "Interview Background Knowledge Conference"
const eventDate = metadata.event_date;              // "2025-11-02"
const numberOfTickets = metadata.number_of_tickets; // "2"
const amount = paymentIntent.amount / 100;          // 40 (£40 total)
```

2. **Create/Find User**:
```typescript
let user = await supabaseService.getUserByEmail(customerEmail);
if (!user) {
  user = await supabaseService.createUser({
    email: customerEmail,
    full_name: customerName,
    role: 'student',
    stripe_customer_id: paymentIntent.customer
  });
}
```

3. **Create/Link Subscription**:
```typescript
let subscription = await supabaseService.getSubscriptionByEmail(customerEmail);
if (!subscription) {
  subscription = await supabaseService.createSubscription({
    email: customerEmail,
    user_id: user.id,
    subscription_tier: 'free',
    opt_in_newsletter: true
  });
}
```

4. **Create Booking Record**:
```typescript
const booking = await supabaseService.createBooking({
  user_id: user.id,
  start_time: eventDate + 'T10:00:00Z',           // Event start time
  end_time: eventDate + 'T15:00:00Z',             // Event end time
  package: 'event_interview_background_knowledge_2025_11_02',  // ← EVENT IDENTIFIER
  amount: 40,                                      // Total amount paid
  email: customerEmail,
  payment_status: 'paid'
});
```

**The `package` field** is the key - it's set to:
```typescript
package: `event_${eventId}`
// Results in: "event_interview_background_knowledge_2025_11_02"
```

5. **Send Emails**:
- **Customer confirmation email**: "Thank you for booking Interview Background Knowledge Conference"
- **Admin notification email**: Details about the new booking

### 6. **Database State After Booking**

**users table**:
```
id: 550e8400-e29b-41d4-a716-446655440000
email: student@example.com
full_name: John Doe
role: student
stripe_customer_id: cus_xxxxx
```

**subscriptions table**:
```
email: student@example.com
user_id: 550e8400-e29b-41d4-a716-446655440000
subscription_tier: free
opt_in_newsletter: true
```

**bookings table**:
```
id: 660e8400-e29b-41d4-a716-446655440001
user_id: 550e8400-e29b-41d4-a716-446655440000
start_time: 2025-11-02 10:00:00
end_time: 2025-11-02 15:00:00
package: event_interview_background_knowledge_2025_11_02  ← EVENT STORED HERE
amount: 40.00
email: student@example.com
payment_status: paid
created_at: 2025-10-13 14:30:00
```

## How to Query Event Bookings

### Find all bookings for a specific event:
```sql
SELECT b.*, u.full_name, u.email
FROM bookings b
JOIN users u ON b.user_id = u.id
WHERE b.package = 'event_interview_background_knowledge_2025_11_02'
  AND b.payment_status = 'paid';
```

### Find all event bookings (any event):
```sql
SELECT b.*, u.full_name, u.email
FROM bookings b
JOIN users u ON b.user_id = u.id
WHERE b.package LIKE 'event_%'
  AND b.payment_status = 'paid';
```

### Extract event ID from package field:
```sql
SELECT 
  b.id,
  u.full_name,
  u.email,
  SUBSTRING(b.package FROM 7) as event_id,  -- Removes 'event_' prefix
  b.amount,
  b.created_at
FROM bookings b
JOIN users u ON b.user_id = u.id
WHERE b.package LIKE 'event_%';
```

### Count attendees for November 2nd event:
```sql
SELECT COUNT(*) as total_attendees
FROM bookings
WHERE package = 'event_interview_background_knowledge_2025_11_02'
  AND payment_status = 'paid';
```

## Important Notes

1. **Event Identifier Format**: `event_{event_id}`
   - Example: `event_interview_background_knowledge_2025_11_02`
   - The event_id should be unique and descriptive

2. **Number of Tickets**: 
   - Stored in Stripe metadata but NOT in bookings table
   - Each booking represents ONE transaction (even if multiple tickets)
   - To track individual tickets, would need separate `event_tickets` table

3. **Email Notifications**:
   - Customer gets confirmation with event details
   - Admin team gets notification for tracking
   - Both emails sent via `emailService`

4. **Payment Status**:
   - Always set to 'paid' when webhook processes successfully
   - Can be 'pending' if payment is processing
   - Can be 'cancelled' if refunded

## Future Improvements

### Recommended: Create dedicated `event_bookings` table
```sql
CREATE TABLE event_bookings (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  event_id VARCHAR NOT NULL,
  event_name VARCHAR NOT NULL,
  event_date DATE NOT NULL,
  number_of_tickets INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

This would:
- Separate event-specific data from general bookings
- Allow better querying and reporting
- Store ticket count properly
- Enable better event management features

## Testing the Flow

1. **Local Development**:
   - Use Stripe CLI for webhooks: `stripe listen --forward-to localhost:5000/api/webhooks/stripe`
   - Use test credit card: 4242 4242 4242 4242
   - Check Supabase database after payment

2. **Verify Data**:
```typescript
// Check if booking was created
const { data, error } = await supabase
  .from('bookings')
  .select('*, users(*)')
  .eq('package', 'event_interview_background_knowledge_2025_11_02')
  .order('created_at', { ascending: false });

console.log('Event bookings:', data);
```

## Contact
For questions about the event booking system, contact the development team.
