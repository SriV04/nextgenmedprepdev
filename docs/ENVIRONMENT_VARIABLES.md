# Environment Variables Configuration Guide

## Overview

This NextGen MedPrep monorepo uses environment variables for configuration across both frontend and backend applications.

## File Structure

```
nextgenmedprepdev/
├── .env                           # Backend environment variables (shared)
├── apps/
│   ├── backend/
│   │   └── (no .env files needed) # Uses root .env
│   └── frontend/
│       ├── .env.local            # Frontend-specific variables (development)
│       ├── .env.production       # Frontend production variables (optional)
│       └── .env.example          # Template for frontend vars
└── .env.example                  # Template for backend vars
```

## Backend Environment Variables

**Location**: Root `.env` file
**Loading**: Automatically loaded in `apps/backend/src/app.ts`

### Required Variables
```bash
# Supabase Configuration
SUPABASE_URL="your_supabase_project_url"
SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_KEY="your_supabase_service_key"

# Email Service (SMTP)
EMAIL_HOST="your_smtp_host"
EMAIL_PORT=465
EMAIL_USER="your_email@domain.com"
EMAIL_PASS="your_email_password"
EMAIL_FROM="your_from_email@domain.com"
```

### Optional Variables
```bash
# Server Configuration
PORT=5001                         # Backend server port
NODE_ENV=development              # Environment mode
FRONTEND_URL=http://localhost:3000 # Frontend URL for CORS

# Security (Production)
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000       # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Payment Processing (Stripe)
STRIPE_SECRET_KEY=sk_test_...     # Your Stripe secret key (backend only)
STRIPE_WEBHOOK_SECRET=whsec_...   # Stripe webhook endpoint secret
BACKEND_URL=http://localhost:5001 # Backend URL for webhook callbacks
FRONTEND_URL=http://localhost:3000 # Frontend URL for payment redirects

# Logging
LOG_LEVEL=info
```

## Frontend Environment Variables

**Location**: `apps/frontend/.env.local`
**Prefix**: All client-side variables must start with `NEXT_PUBLIC_`

### Configuration
```bash
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_APP_ENV=development

# Payment Processing (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Optional: Third-party services
# NEXT_PUBLIC_GA_TRACKING_ID=your_google_analytics_id
# NEXT_PUBLIC_HOTJAR_ID=your_hotjar_id
```

## Environment-Specific Files

### Development
- **Backend**: Use root `.env` file
- **Frontend**: Use `apps/frontend/.env.local`

### Production
- **Backend**: Set environment variables in your hosting platform
- **Frontend**: Create `apps/frontend/.env.production`

## Usage Examples

### Backend (Node.js/Express)
```typescript
// Environment variables are automatically available
const port = process.env.PORT || 5000;
const supabaseUrl = process.env.SUPABASE_URL;

// Validation (recommended)
import { validateEnvVariables } from './utils/database';
validateEnvVariables(); // Throws error if required vars are missing
```

### Frontend (Next.js/React)
```typescript
// Only NEXT_PUBLIC_ variables are available in browser
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

// Usage in components
const response = await fetch(`${apiUrl}/api/${apiVersion}/subscriptions`);
```

## Security Best Practices

### ✅ Do's
- Use `NEXT_PUBLIC_` prefix only for variables that MUST be exposed to browser
- Store sensitive keys (API secrets, database passwords) only in backend environment
- Use different values for development/staging/production
- Add `.env*` files to `.gitignore` (except `.env.example`)

### ❌ Don'ts
- Never put sensitive data in `NEXT_PUBLIC_` variables
- Don't commit actual `.env` files to version control
- Don't use production credentials in development

## Environment File Priority (Next.js)

Next.js loads environment variables in this order (higher priority overrides lower):
1. `process.env`
2. `.env.$(NODE_ENV).local`
3. `.env.local` (not loaded when NODE_ENV is test)
4. `.env.$(NODE_ENV)`
5. `.env`

## Deployment Considerations

### Vercel (Frontend)
- Set environment variables in Vercel dashboard
- Use different values for Preview vs Production environments

### Railway/Heroku (Backend)
- Set environment variables in platform dashboard
- Use production-grade values for database connections and API keys

### Docker
```dockerfile
# Use build args for build-time variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Use environment variables for runtime secrets
ENV DATABASE_URL=$DATABASE_URL
```