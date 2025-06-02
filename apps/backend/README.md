# NextGen MedPrep Backend API

A robust backend API for NextGen MedPrep's email subscription system built with Node.js, Express, TypeScript, and Supabase.

## Features

- 📧 **Email Subscription Management**: Create, update, and manage email subscriptions
- 🎯 **Tier-based Access Control**: Different subscription tiers with varying access levels
- 📬 **Email Services**: Automated welcome emails, newsletters, and notifications
- 🔒 **Data Validation**: Comprehensive input validation with Zod
- 🛡️ **Security**: Helmet for security headers, CORS configuration
- 🗄️ **Database**: Supabase PostgreSQL integration
- 📊 **Analytics**: Email statistics and subscription metrics

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Email**: Nodemailer
- **Validation**: Zod
- **Payment**: Stripe (ready for integration)

## Project Structure

```
backend/
├── src/
│   ├── app.ts                 # Main application entry point
│   ├── controllers/           # Request handlers
│   │   ├── subscriptionController.ts
│   │   └── emailController.ts
│   ├── routes/               # API routes
│   │   ├── index.ts
│   │   └── subscriptions.ts
│   ├── services/             # Business logic
│   │   ├── emailService.ts
│   │   └── supabaseService.ts
│   ├── middleware/           # Express middleware
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   └── utils/               # Utility functions
│       └── database.ts
├── supabase/                # Supabase configuration
│   └── config.ts
├── package.json
├── tsconfig.json
└── .env.example
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Email service (Gmail, SendGrid, etc.)

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Required environment variables**:
   ```env
   # Server
   PORT=3001
   NODE_ENV=development
   
   # Supabase
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_key
   
   # Email (Gmail example)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=noreply@nextgenmedprep.com
   
   # Frontend
   FRONTEND_URL=http://localhost:3000
   ```

4. **Database setup**:
   - Create tables in your Supabase dashboard using the schema provided
   - Or run the setup script (schema included in `/supabase/config.ts`)

5. **Start development server**:
   ```bash
   npm run dev
   ```

## API Endpoints

### Subscriptions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/subscriptions` | Create new subscription |
| GET | `/api/v1/subscriptions/:email` | Get subscription details |
| PUT | `/api/v1/subscriptions/:email` | Update subscription |
| DELETE | `/api/v1/subscriptions/:email` | Delete subscription |
| POST | `/api/v1/subscriptions/:email/unsubscribe` | Unsubscribe email |
| POST | `/api/v1/subscriptions/:email/resubscribe` | Resubscribe email |
| GET | `/api/v1/subscriptions` | List all subscriptions (admin) |
| GET | `/api/v1/subscriptions/:email/access` | Check content access |

### Emails

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/emails/newsletter` | Send newsletter |
| POST | `/api/v1/emails/welcome` | Send welcome email |
| POST | `/api/v1/emails/custom` | Send custom email |
| GET | `/api/v1/emails/test-config` | Test email configuration |
| GET | `/api/v1/emails/stats` | Get email statistics |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | API health status |

## Subscription Tiers

- **free**: Basic resources access
- **newsletter_only**: Email newsletters + basic resources
- **premium_basic**: Premium content + mock interviews
- **premium_plus**: All features + tutoring + unlimited tests

## Usage Examples

### Create Subscription

```javascript
POST /api/v1/subscriptions
{
  "email": "student@example.com",
  "subscription_tier": "free",
  "opt_in_newsletter": true
}
```

### Check Access

```javascript
GET /api/v1/subscriptions/student@example.com/access?resource_type=premium_content
```

### Send Newsletter

```javascript
POST /api/v1/emails/newsletter
{
  "subject": "Weekly Medical School Tips",
  "content": "<h1>This week's tips...</h1>",
  "target_tiers": ["premium_basic", "premium_plus"]
}
```

## Development

- **Development**: `npm run dev` (with hot reload)
- **Build**: `npm run build`
- **Start**: `npm start`
- **Lint**: `npm run lint`

## Security Features

- Input validation with Zod schemas
- SQL injection prevention via Supabase
- Rate limiting ready (implement as needed)
- CORS configuration
- Security headers via Helmet
- Environment variable validation

## Database Schema

The API uses two main tables:

1. **users**: User accounts and profiles
2. **subscriptions**: Email subscriptions with tier management

Full schema available in `/supabase/config.ts`

## Error Handling

Comprehensive error handling with:
- Custom AppError class
- Global error middleware
- Async error wrapping
- Development vs production error responses

## Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include input validation
4. Write descriptive commit messages
5. Test endpoints thoroughly

## License

MIT License - see LICENSE file for details
