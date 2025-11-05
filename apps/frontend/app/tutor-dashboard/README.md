# Admin Dashboard

The Admin Dashboard provides a comprehensive interface for managing bookings and viewing statistics.

## Features

### Statistics Overview
- **Total Bookings**: Total number of all bookings in the system
- **Recent Bookings**: Bookings created in the last 7 days
- **Total Revenue**: Sum of all paid bookings
- **Completed Bookings**: Number of bookings marked as completed

### Filters
Filter bookings by:
- **Search**: Search by customer email or name in notes
- **Customer View**: Click "View all bookings →" next to any customer email to see all their bookings
- **Status**: confirmed, completed, cancelled, no_show
- **Payment Status**: paid, pending, failed, refunded
- **Package Type**: essentials, core, premium, career consultation, event

### Quick Customer Access
- View a list of customers with booking counts
- Click on any customer to instantly filter and view all their bookings
- Displays up to 12 most recent customers for quick access
- Use search to find specific customers

### Bookings Table
View all bookings with the following information:
- Customer email
- Package type
- Amount
- Payment status
- Booking status
- Creation date

### Detailed Booking View
Click the expand button (chevron) to view:
- Full booking details (ID, field, universities, phone, notes)
- Update booking status
- Download personal statement (for interview bookings)

## Backend API Endpoints

The dashboard connects to the following backend endpoints:

### GET `/api/v1/bookings/all`
Returns all bookings in the system.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "package": "essentials_live",
      "amount": 150,
      "payment_status": "paid",
      "status": "confirmed",
      "created_at": "2025-11-05T...",
      ...
    }
  ]
}
```

### GET `/api/v1/bookings/stats`
Returns booking statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 45,
    "recent": 12,
    "byStatus": {
      "confirmed": 20,
      "completed": 15,
      "cancelled": 5,
      "no_show": 5
    },
    "byPackage": {
      "essentials_live": 10,
      "core_generated": 15,
      ...
    },
    "totalRevenue": 6750
  }
}
```

### PUT `/api/v1/bookings/:id`
Updates a booking's status.

**Request Body:**
```json
{
  "status": "confirmed" | "completed" | "cancelled" | "no_show"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated booking */ },
  "message": "Booking updated successfully"
}
```

### GET `/api/v1/interview-bookings/:id/personal-statement`
Gets a signed URL to download a personal statement.

**Response:**
```json
{
  "success": true,
  "data": {
    "download_url": "https://...",
    "file_path": "personal-statements/..."
  }
}
```

## Usage

1. Navigate to `/admin-dashboard` in your browser
2. The dashboard will automatically load all bookings and statistics
3. **Search for customers**: Type in the search bar to find bookings by customer email or name
4. **View customer bookings**: Click "View all bookings →" next to any email, or use the Quick Customer Access section
5. Use the filter dropdowns to narrow down bookings by status, payment, or package type
6. Click on the chevron icon to expand a booking and see details
7. Update booking status from the dropdown in the expanded view
8. Click "Download Personal Statement" to download uploaded files (for interview bookings)
9. Click "Refresh" to reload the latest data
10. Click "Clear all filters" to reset all filters and search

## Environment Variables

Make sure the following environment variable is set in your `.env.local` file:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
```

Or in production:
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com
```

## Security Considerations

⚠️ **Important**: This dashboard currently has no authentication. In production, you should:

1. Add authentication middleware to protect the route
2. Add role-based access control to ensure only admins can access
3. Add API authentication for the backend endpoints
4. Consider adding audit logging for admin actions

## Future Enhancements

Potential improvements:
- Pagination for large datasets
- Export bookings to CSV/Excel
- Search functionality
- Date range filters
- Email notifications for status changes
- Assign tutors to bookings
- Calendar view for scheduled sessions
- Revenue analytics charts
