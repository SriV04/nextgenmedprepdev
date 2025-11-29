# Tutor Calendar Type System

This document describes the centralized type definitions for the tutor calendar system.

## Overview

All types for the tutor-calendar components are defined in `tutor-calendar.ts`. This centralization provides:

- **Single source of truth** for all type definitions
- **Consistent type usage** across all components
- **Better maintainability** when types need to be updated
- **Improved code organization** and readability

## Type Categories

### Time Slot Types

#### `SlotType`
```typescript
type SlotType = 'available' | 'interview' | 'blocked';
```
Defines the three possible states of a calendar time slot.

#### `TimeSlot`
Core interface representing a single time slot in the calendar.
- `id`: Unique identifier
- `startTime` / `endTime`: Time in HH:MM format
- `type`: Slot state (available/interview/blocked)
- Optional fields for interview details (title, student, package, etc.)

#### `AvailabilitySlot`
Represents recurring availability patterns.
- `dayOfWeek`: 0 (Sunday) to 6 (Saturday)
- `startTime` / `endTime`: Time strings in HH:MM format

#### `DateAvailabilitySlot`
Specific availability for a particular date.
- `date`: ISO date string (YYYY-MM-DD)
- `hour_start` / `hour_end`: Hour numbers (0-23)
- `isExisting`: Whether slot already exists in database

### Student Types

#### `StudentAvailabilitySlot`
Student's availability information fetched from backend.
- Contains date, time range, and day of week information
- Used for drag-and-drop assignment validation

#### `UnassignedInterview`
Represents an interview that hasn't been assigned to a tutor yet.
- Complete student information (name, email, ID)
- Booking details (package, universities, preferred time)
- Additional context (field, phone, notes)

#### `InterviewDetails`
Extended interview information displayed in the details modal.
- Includes all `UnassignedInterview` fields
- Plus `studentAvailability` array for scheduling

### Tutor Types

#### `TutorSchedule`
Complete tutor information including their weekly schedule.
- `schedule`: Map of dates to TimeSlot arrays
- `availability`: Recurring availability patterns
- Visual properties (color, avatar)

#### `TutorInfo`
Simplified tutor identification.
- Basic info: tutorId, tutorName, tutorEmail
- Used for selectedTutor state

### Change Tracking Types

#### `PendingChange`
Represents a change pending confirmation (email sending).
- Interview assignment details
- Student and tutor information
- Scheduled date and time

#### `ChangeType`
Currently only supports 'assignment', extensible for future change types.

### Context Types

#### `TutorCalendarContextType`
Complete interface for the context provider.
- **State**: All component state (tutors, interviews, selections, etc.)
- **Actions**: Methods for data manipulation and API calls

### Component Props Types

Standard prop interfaces for each major component:
- `TutorCalendarProps`
- `UnassignedInterviewsProps`

### API Response Types

Backend data structures that get transformed to frontend types:
- `BackendTutorData`
- `BackendAvailabilitySlot`
- `BackendInterviewData`

### Utility Types

#### Type Aliases
- `DateString`: YYYY-MM-DD format
- `TimeString`: HH:MM format
- `ISODateTimeString`: Full ISO 8601 datetime

#### Helper Interfaces
- `InterviewFilters`: Search and filter state
- `DragData`: Drag-and-drop data transfer

## Usage Examples

### Importing Types

```typescript
import type {
  TutorSchedule,
  UnassignedInterview,
  TimeSlot,
  StudentAvailabilitySlot,
} from '../../types/tutor-calendar';
```

### Component with Props

```typescript
import type { TutorCalendarProps } from '../../types/tutor-calendar';

const TutorCalendar: React.FC<TutorCalendarProps> = ({ onSlotClick }) => {
  // Component implementation
};
```

### State with Types

```typescript
import type { DateAvailabilitySlot } from '../../types/tutor-calendar';

const [slots, setSlots] = useState<DateAvailabilitySlot[]>([]);
```

### Function Signatures

```typescript
import type { SlotType } from '../../types/tutor-calendar';

const getSlotColor = (type: SlotType): string => {
  // Implementation
};
```

## Type Transformations

### Backend → Frontend

The context transforms backend API responses to frontend types:

```typescript
// Backend format
interface BackendTutorData {
  id: string;
  name: string;
  email: string;
  availability?: BackendAvailabilitySlot[];
}

// Transforms to frontend format
interface TutorSchedule {
  tutorId: string;
  tutorName: string;
  tutorEmail: string;
  schedule: Record<string, TimeSlot[]>;
  // ...
}
```

### Frontend → Backend

When sending data to the API:

```typescript
// Frontend: DateAvailabilitySlot
{ date: '2024-01-15', hour_start: 9, hour_end: 10 }

// Backend API expects:
{ date: '2024-01-15', hour_start: 9, hour_end: 10, type: 'available' }
```

## Best Practices

1. **Always use type imports**: Use `import type` for better tree-shaking
2. **Avoid `any`**: Use proper types from this file instead of `any`
3. **Extend, don't duplicate**: If you need similar types, extend existing ones
4. **Document new types**: Add comments for complex type definitions
5. **Keep transformations in context**: Backend↔Frontend conversions belong in TutorCalendarContext

## File Structure

```
apps/frontend/
├── types/
│   ├── tutor-calendar.ts    # All type definitions
│   └── README.md            # This file
├── contexts/
│   └── TutorCalendarContext.tsx  # Uses and transforms types
└── components/
    └── tutor-calendar/
        ├── TutorCalendar.tsx
        ├── UnassignedInterviews.tsx
        ├── AvailabilityModal.tsx
        ├── InterviewDetailsModal.tsx
        └── CommitChangesBar.tsx
```

## Maintenance

When adding new features:

1. Add types to `tutor-calendar.ts`
2. Update this README with documentation
3. Use the new types in components
4. Add transformation logic to context if needed

When modifying existing types:
1. Check all usages across components
2. Update related types that depend on the changed type
3. Test all affected components
4. Update documentation
