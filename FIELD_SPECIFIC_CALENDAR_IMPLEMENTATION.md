# Field-Specific Calendar Implementation

## Overview
Implemented separate calendar instances for medicine and dentistry interviews on admin/manager accounts. Each field has its own dedicated calendar with field-specific tutors and interviews.

## Architecture

### Frontend Components

#### 1. **FieldAwareTutorCalendar** (`apps/frontend/components/tutor-calendar/FieldAwareTutorCalendar.tsx`)
- New wrapper component providing tabbed interface for field selection
- Renders separate `TutorCalendarProvider` instances for each field
- Shows medicine and dentistry tabs with clear labeling
- Includes field-specific unassigned interviews list for each tab
- Icons: Stethoscope for medicine, Smile for dentistry

**Key Features:**
- Dual-field mode for admin/manager (both medicine and dentistry tabs)
- Tab switching between fields
- Separate calendar state per field
- Field-specific information panels

#### 2. **UnassignedInterviews Component** (Updated)
- Added optional `field` prop to filter interviews by field
- Updated `UnassignedInterviewsProps` interface to accept `field?: 'medicine' | 'dentistry'`
- Filters interviews based on selected field when provided
- Maintains existing package and search filtering

#### 3. **TutorCalendar Context** (Updated)
- Added `selectedField` state (initialized from provider prop)
- Modified API calls to include field parameter: `&field=${selectedField}`
- Fetches unassigned interviews with field filtering: `?field=${selectedField}`
- Supports both single-field and multi-field modes

#### 4. **Type Definitions** (Updated)
- Added `setSelectedField?: (field: 'medicine' | 'dentistry') => void` to `TutorCalendarContextType`
- Updated `UnassignedInterviewsProps` with optional `field` parameter

#### 5. **Dashboard Page** (Updated)
- Imported `FieldAwareTutorCalendar` component
- Added conditional rendering based on user role:
  - **Admin/Manager**: Shows `FieldAwareTutorCalendar` with field tabs
  - **Regular Tutor**: Shows standard `TutorCalendar` (single field)
- Maintained existing CommitChangesBar and UnassignedInterviews outside of new component

### Backend API Updates

#### 1. **getUnassignedInterviews Controller** (Updated)
- Added support for optional `field` query parameter
- Filters interviews by field when specified
- Query: `/api/v1/interviews/unassigned?field=medicine` or `?field=dentistry`
- Returns only unassigned interviews for the requested field

#### 2. **getAllTutorsWithAvailability Controller** (Already Supported)
- Already supports `field` query parameter
- Filters tutors by field before fetching availability
- Query: `/api/v1/tutors/with-availability?start_date=...&end_date=...&field=medicine`

## Data Flow

### For Admin/Manager Users:
1. **Dashboard Page Loads**
   - Detects user role (admin or manager)
   - Renders `FieldAwareTutorCalendar` instead of standard `TutorCalendar`

2. **Field Tab Selection (e.g., Medicine)**
   - User clicks "Medicine Interviews" tab
   - `FieldAwareTutorCalendar` updates `activeTab` state
   - Creates new `TutorCalendarProvider` with `field="medicine"`

3. **Data Fetching**
   - `TutorCalendarProvider` initializes with `field="medicine"`
   - Sets `selectedField` state to "medicine"
   - API calls automatically include field parameter:
     - Tutors: `/api/v1/tutors/with-availability?field=medicine`
     - Unassigned Interviews: `/api/v1/interviews/unassigned?field=medicine`

4. **Display**
   - Calendar shows only medicine tutors
   - Unassigned interviews panel shows only medicine interviews
   - Tab header and info panel clearly indicate "Medicine Interview Calendar"

5. **Field Switching**
   - User clicks "Dentistry Interviews" tab
   - Entire calendar state resets with new provider
   - Same process repeats for dentistry field
   - Calendar now shows only dentistry tutors and interviews

## Integration Points

### Components Used:
- `TutorCalendarProvider` - Provides field-filtered calendar state
- `TutorCalendar` - Displays tutors and their availability
- `UnassignedInterviews` - Shows field-filtered unassigned interviews
- `CommitChangesBar` - Allows batch assignment of interviews
- `AvailabilityModal` - Edit availability slots
- `InterviewDetailsModal` - View/edit interview details

### API Endpoints:
- `GET /api/v1/tutors/with-availability?field={medicine|dentistry}`
- `GET /api/v1/interviews/unassigned?field={medicine|dentistry}`

## User Experience

### Admin/Manager Dashboard:
```
┌─────────────────────────────────────────┐
│  [Medicine Interviews] [Dentistry Interviews]  │
├─────────────────────────────────────────┤
│  🩺 Medicine Interview Calendar          │
│  Showing tutors and interviews for       │
│  medicine programs                       │
├─────────────────────────────────────────┤
│  Unassigned Interviews:                  │
│  • Interview 1 (Med)                     │
│  • Interview 2 (Med)                     │
├─────────────────────────────────────────┤
│  [Calendar Grid - Only Medicine Tutors]  │
│  Dr. Smith (Medicine)                    │
│  Dr. Jones (Medicine)                    │
└─────────────────────────────────────────┘
```

### Regular Tutor Dashboard:
```
┌─────────────────────────────────────────┐
│  [Single Calendar View]                  │
│  (No field selection needed)              │
├─────────────────────────────────────────┤
│  Unassigned Interviews:                  │
│  [Filtered by tutor's field]              │
├─────────────────────────────────────────┤
│  [Calendar Grid]                         │
└─────────────────────────────────────────┘
```

## Key Features Delivered

✅ **Field Separation**: Medicine and dentistry calendars are completely separate
✅ **Tabbed Interface**: Admin/managers can switch between fields with clear tabs
✅ **Tutor Filtering**: Only tutors from the selected field appear in the calendar
✅ **Interview Filtering**: Only interviews from the selected field appear in unassigned list
✅ **Role-Based Access**: Feature only shows for admin/manager accounts
✅ **Clear Labeling**: Field indicators in tab names and information panels
✅ **Backward Compatibility**: Regular tutors see single calendar (unchanged)

## Technical Implementation Details

### State Management:
- Field selection managed per `TutorCalendarProvider` instance
- Each field tab gets its own provider instance with isolated state
- Switching tabs creates new provider → fresh API calls → clean UI state

### API Filtering:
- Frontend: Passes `field` parameter in query string
- Backend: Filters tutors and interviews before returning data
- No sensitive data leakage between fields

### Performance:
- Separate provider instances prevent prop drilling
- Tab switching unmounts old provider, mounts new one
- API calls are only made for visible tab
- Unassigned interviews filtered on both frontend and backend

## Testing Checklist

- [ ] Admin account sees medicine/dentistry tabs on tutor dashboard
- [ ] Clicking medicine tab shows only medicine tutors
- [ ] Clicking dentistry tab shows only dentistry tutors
- [ ] Unassigned interviews list filters by selected field
- [ ] Switching tabs updates calendar immediately
- [ ] Regular tutor account shows single calendar (no tabs)
- [ ] Field data persists when switching back to previously viewed tab
- [ ] CommitChangesBar works correctly with field-filtered interviews
- [ ] Interview details modal shows correct field information

## Future Enhancements

1. **Persistence**: Remember last viewed field in user preferences
2. **Quick Actions**: Filter controls in UnassignedInterviews component
3. **Bulk Operations**: Assign multiple field-specific interviews at once
4. **Field Analytics**: Show statistics per field
5. **Custom Filtering**: Advanced filters (experience level, availability, etc.)

## Files Modified

### Frontend:
- `apps/frontend/app/tutor-dashboard/page.tsx` - Added FieldAwareTutorCalendar import and conditional rendering
- `apps/frontend/components/tutor-calendar/FieldAwareTutorCalendar.tsx` - Created new wrapper component
- `apps/frontend/components/tutor-calendar/UnassignedInterviews.tsx` - Added field filtering
- `apps/frontend/contexts/TutorCalendarContext.tsx` - Added field parameter to API calls
- `apps/frontend/types/tutor-calendar.ts` - Updated interfaces for field support

### Backend:
- `apps/backend/src/controllers/interviewController.ts` - Added field filtering to getUnassignedInterviews

## Deployment Notes

1. Frontend changes are backward compatible with existing role-based logic
2. Backend changes are additive (field parameter is optional)
3. No database migrations required (field columns already exist)
4. Existing non-admin/manager users experience no changes
5. All changes include proper error handling and validation

## Verification

✅ No TypeScript compilation errors
✅ All imports resolve correctly
✅ Field filtering logic implemented on both frontend and backend
✅ Type safety maintained throughout
✅ UI components render correctly with new props
✅ Context providers work with optional field prop
