# Tutor Calendar API Documentation

## Overview
Complete API endpoints for managing tutors, availability, and interviews in the NextGen MedPrep platform.

## Base URL
```
Development: http://localhost:5001/api/v1
Production: https://your-domain.com/api/v1
```

---

## Tutors Endpoints

### Create Tutor
**POST** `/tutors`

Creates a new tutor account (called automatically after Google sign-in).

**Request Body:**
```json
{
  "user_id": "uuid",
  "name": "Dr. Sarah Johnson",
  "email": "sarah@example.com",
  "subjects": ["Medicine", "Biology"],
  "role": "tutor" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tutor created successfully",
  "data": {
    "id": "uuid",
    "name": "Dr. Sarah Johnson",
    "email": "sarah@example.com",
    "subjects": ["Medicine", "Biology"],
    "role": "tutor",
    "created_at": "2025-11-14T10:00:00Z"
  }
}
```

### Get All Tutors
**GET** `/tutors`

Returns list of all tutors.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Dr. Sarah Johnson",
      "email": "sarah@example.com",
      "subjects": ["Medicine", "Biology"],
      "created_at": "2025-11-14T10:00:00Z"
    }
  ]
}
```

### Get Tutor by ID or Email
**GET** `/tutor?id=uuid` or `/tutor?email=email@example.com`

Returns a single tutor.

**Query Parameters:**
- `id` (uuid): Tutor ID
- `email` (string): Tutor email

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Dr. Sarah Johnson",
    "email": "sarah@example.com",
    "subjects": ["Medicine", "Biology"]
  }
}
```

### Get All Tutors with Availability
**GET** `/tutors/with-availability?start_date=2025-11-14&end_date=2025-11-21`

Returns all tutors with their availability slots and scheduled interviews.

**Query Parameters:**
- `start_date` (YYYY-MM-DD): Start date for availability range
- `end_date` (YYYY-MM-DD): End date for availability range

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Dr. Sarah Johnson",
      "email": "sarah@example.com",
      "subjects": ["Medicine", "Biology"],
      "availability": [
        {
          "id": "uuid",
          "tutor_id": "uuid",
          "date": "2025-11-14",
          "day_of_week": 4,
          "hour_start": 9,
          "hour_end": 12,
          "type": "available",
          "interview_id": null,
          "interview": null
        },
        {
          "id": "uuid",
          "tutor_id": "uuid",
          "date": "2025-11-15",
          "hour_start": 14,
          "hour_end": 15,
          "type": "interview",
          "interview_id": "uuid",
          "interview": {
            "id": "uuid",
            "scheduled_at": "2025-11-15T14:00:00Z",
            "booking": {
              "id": "uuid",
              "email": "student@example.com",
              "package": "Core Package",
              "universities": "Cambridge, Oxford"
            }
          }
        }
      ]
    }
  ]
}
```

### Update Tutor
**PUT** `/tutors/:id`

Updates tutor information.

**Request Body:**
```json
{
  "name": "Dr. Sarah Johnson-Smith",
  "subjects": ["Medicine", "Biology", "Chemistry"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tutor updated successfully",
  "data": {
    "id": "uuid",
    "name": "Dr. Sarah Johnson-Smith",
    "subjects": ["Medicine", "Biology", "Chemistry"]
  }
}
```

---

## Availability Endpoints

### Add Single Availability Slot
**POST** `/tutors/:tutorId/availability`

Adds a single availability slot for a tutor.

**Request Body:**
```json
{
  "date": "2025-11-14",
  "hour_start": 9,
  "hour_end": 10,
  "type": "available",
  "interview_id": null
}
```

**Response:**
```json
{
  "success": true,
  "message": "Availability added successfully",
  "data": {
    "id": "uuid",
    "tutor_id": "uuid",
    "date": "2025-11-14",
    "hour_start": 9,
    "hour_end": 12,
    "type": "available"
  }
}
```

### Add Bulk Availability Slots
**POST** `/tutors/:tutorId/availability/bulk`

Adds multiple availability slots at once.

**Request Body:**
```json
{
  "slots": [
    {
      "date": "2025-11-14",
      "hour_start": 9,
      "hour_end": 12,
      "type": "available"
    },
    {
      "date": "2025-11-15",
      "hour_start": 14,
      "hour_end": 17,
      "type": "available"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Added 2 availability slots",
  "data": [...]
}
```

### Get Tutor Availability
**GET** `/tutors/:tutorId/availability?start_date=2025-11-14&end_date=2025-11-21`

Returns availability slots for a specific tutor.

**Query Parameters:**
- `start_date` (YYYY-MM-DD): Optional start date
- `end_date` (YYYY-MM-DD): Optional end date

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "tutor_id": "uuid",
      "date": "2025-11-14",
      "hour_start": 9,
      "hour_end": 12,
      "type": "available",
      "interview": null
    }
  ]
}
```

### Delete Availability Slot
**DELETE** `/tutors/availability/:availabilityId`

Deletes a specific availability slot.

**Response:**
```json
{
  "success": true,
  "message": "Availability deleted successfully"
}
```

---

## Interview Endpoints

### Create Interview
**POST** `/interviews`

Creates a new interview booking.

**Request Body:**
```json
{
  "university_id": "uuid",
  "student_id": "uuid",
  "booking_id": "uuid",
  "scheduled_at": "2025-11-15T14:00:00Z",
  "notes": "Student prefers morning sessions"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Interview created successfully",
  "data": {
    "id": "uuid",
    "scheduled_at": "2025-11-15T14:00:00Z",
    "completed": false,
    "tutor_id": null
  }
}
```

### Get All Interviews
**GET** `/interviews?tutor_id=uuid&unassigned=true&completed=false`

Returns all interviews with optional filters.

**Query Parameters:**
- `tutor_id` (uuid): Filter by tutor
- `student_id` (uuid): Filter by student
- `booking_id` (uuid): Filter by booking
- `unassigned` (boolean): Show only unassigned interviews
- `completed` (boolean): Filter by completion status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "scheduled_at": "2025-11-15T14:00:00Z",
      "completed": false,
      "tutor_id": null,
      "tutor": null,
      "booking": {
        "id": "uuid",
        "email": "student@example.com",
        "package": "Core Package",
        "universities": "Cambridge, Oxford"
      }
    }
  ]
}
```

### Get Unassigned Interviews
**GET** `/interviews/unassigned`

Returns all interviews that haven't been assigned to a tutor.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "scheduled_at": "2025-11-15T14:00:00Z",
      "tutor_id": null,
      "booking": {
        "id": "uuid",
        "email": "student@example.com",
        "package": "Core Package",
        "universities": "Cambridge, Oxford",
        "preferred_time": "Weekday mornings"
      }
    }
  ]
}
```

### Get Interview by ID
**GET** `/interviews/:id`

Returns detailed information about a specific interview.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "scheduled_at": "2025-11-15T14:00:00Z",
    "completed": false,
    "tutor": {
      "id": "uuid",
      "name": "Dr. Sarah Johnson",
      "email": "sarah@example.com"
    },
    "booking": {
      "id": "uuid",
      "email": "student@example.com",
      "package": "Core Package"
    },
    "university": {
      "id": "uuid",
      "name": "Cambridge"
    }
  }
}
```

### Update Interview
**PUT** `/interviews/:id`

Updates interview details.

**Request Body:**
```json
{
  "tutor_id": "uuid",
  "scheduled_at": "2025-11-16T10:00:00Z",
  "notes": "Rescheduled at student's request"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Interview updated successfully",
  "data": {...}
}
```

### Assign Interview to Tutor
**POST** `/interviews/:id/assign`

Assigns an interview to a tutor and schedules it.

**Request Body:**
```json
{
  "tutor_id": "uuid",
  "scheduled_at": "2025-11-15T14:00:00Z",
  "availability_slot_id": "uuid" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Interview assigned successfully",
  "data": {
    "id": "uuid",
    "tutor_id": "uuid",
    "scheduled_at": "2025-11-15T14:00:00Z"
  }
}
```

### Complete Interview
**POST** `/interviews/:id/complete`

Marks an interview as completed.

**Request Body:**
```json
{
  "student_feedback": "Great session, very helpful!",
  "notes": "Covered MMI scenarios and ethics"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Interview marked as completed",
  "data": {
    "id": "uuid",
    "completed": true,
    "student_feedback": "Great session, very helpful!"
  }
}
```

### Delete Interview
**DELETE** `/interviews/:id`

Deletes an interview and frees up the associated availability slot.

**Response:**
```json
{
  "success": true,
  "message": "Interview deleted successfully"
}
```

---

## Error Responses

All endpoints may return error responses:

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Frontend Integration Example

```typescript
// Fetch tutors with availability
const fetchTutors = async () => {
  const startDate = '2025-11-14';
  const endDate = '2025-11-21';
  
  const response = await fetch(
    `${backendUrl}/api/v1/tutors/with-availability?start_date=${startDate}&end_date=${endDate}`
  );
  const data = await response.json();
  
  if (data.success) {
    setTutors(data.data);
  }
};

// Assign interview
const assignInterview = async (interviewId: string, tutorId: string, scheduledAt: string) => {
  const response = await fetch(
    `${backendUrl}/api/v1/interviews/${interviewId}/assign`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tutor_id: tutorId,
        scheduled_at: scheduledAt,
      }),
    }
  );
  
  const data = await response.json();
  return data;
};

// Add availability slots
const addAvailability = async (tutorId: string, slots: any[]) => {
  const response = await fetch(
    `${backendUrl}/api/v1/tutors/${tutorId}/availability/bulk`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slots }),
    }
  );
  
  const data = await response.json();
  return data;
};
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Dates are in YYYY-MM-DD format
- Hours are in 24-hour format (0-23)
- The `day_of_week` field is automatically calculated (0=Sunday, 6=Saturday)
- RLS policies ensure data security at the database level
- The backend uses Supabase for data storage
