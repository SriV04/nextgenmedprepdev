# Supabase Authentication Setup Guide

## Overview
This guide explains how to set up Supabase authentication with Google sign-in for the tutor dashboard. The authentication is handled entirely in the **frontend** using Supabase Auth SDK - no backend changes needed!

## Architecture

### Frontend-Only Authentication
- ✅ Uses Supabase Auth SDK directly in Next.js
- ✅ Middleware protects routes automatically
- ✅ Google OAuth handled by Supabase
- ✅ Session management via secure HTTP-only cookies
- ❌ No backend API changes required

## Step-by-Step Setup

### 1. Configure Supabase Dashboard

#### Enable Google OAuth Provider
1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** and click to configure
5. Enable the Google provider
6. Add your Google OAuth credentials:
   - **Client ID**: Get from Google Cloud Console
   - **Client Secret**: Get from Google Cloud Console

#### Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen if prompted
6. For Application type, select **Web application**
7. Add authorized redirect URIs:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
   For local development:
   ```
   http://localhost:54321/auth/v1/callback
   ```
8. Copy the **Client ID** and **Client Secret**
9. Paste them into Supabase Google provider settings
10. Click **Save**

#### Configure Site URL
1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL**: `http://localhost:3000` (development) or your production URL
3. Add **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   https://yourdomain.com/auth/callback
   ```

### 2. Update Environment Variables

Edit `apps/frontend/.env.local`:

```bash
# Replace these with your actual Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Backend URL (existing)
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
```

**Where to find these values:**
- Go to Supabase Dashboard → **Project Settings** → **API**
- Copy **Project URL** → use as `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon/public** key → use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Restart Development Server

After updating `.env.local`, restart your Next.js dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## How It Works

### Authentication Flow

1. **User visits `/tutor-dashboard`**
   - Middleware checks for valid session
   - If not authenticated → redirects to `/auth/login`

2. **User clicks "Continue with Google"**
   - Frontend calls Supabase Auth
   - Redirects to Google OAuth
   - User authorizes the app

3. **Google redirects back to `/auth/callback`**
   - Exchange OAuth code for session
   - Set secure HTTP-only cookies
   - Redirect to `/tutor-dashboard`

4. **User accesses dashboard**
   - Middleware validates session automatically
   - User info available via `supabase.auth.getUser()`

### Files Created

```
apps/frontend/
├── middleware.ts                    # Route protection
├── utils/supabase/
│   ├── client.ts                   # Client-side Supabase instance
│   ├── server.ts                   # Server-side Supabase instance
│   └── middleware.ts               # Session refresh logic
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx           # Login page with Google button
│   │   └── callback/
│   │       └── route.ts           # OAuth callback handler
│   └── tutor-dashboard/
│       └── page.tsx               # Protected dashboard (updated)
└── .env.local                      # Environment variables (updated)
```

### Protected Routes

The middleware automatically protects any route that matches:
- `/tutor-dashboard/*`

To add more protected routes, update `utils/supabase/middleware.ts`:

```typescript
// Add more protected routes
if (request.nextUrl.pathname.startsWith('/admin') && !user) {
  // Redirect to login
}
```

## Testing

### Test Authentication Flow

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test the flow:**
   - Visit http://localhost:3000/tutor-dashboard
   - Should redirect to http://localhost:3000/auth/login
   - Click "Continue with Google"
   - Sign in with Google account
   - Should redirect back to dashboard
   - Verify you can see your email and "Sign Out" button

3. **Test sign out:**
   - Click "Sign Out" button
   - Should redirect to login page
   - Try accessing dashboard directly
   - Should redirect back to login

### Common Issues

#### Issue: "Invalid redirect URL"
**Solution:** Add the callback URL to Supabase:
- Dashboard → Authentication → URL Configuration
- Add: `http://localhost:3000/auth/callback`

#### Issue: "Google OAuth error"
**Solution:** Check Google Cloud Console:
- Verify authorized redirect URIs include Supabase callback
- Make sure OAuth consent screen is configured
- Check if Client ID and Secret are correct in Supabase

#### Issue: "Environment variables not found"
**Solution:** 
- Make sure `.env.local` has correct values
- Restart Next.js dev server after changing env vars
- Verify variable names start with `NEXT_PUBLIC_`

## Production Deployment

### Update Environment Variables

For production (Vercel, Netlify, etc.):

1. Add environment variables in your hosting platform:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
   NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
   ```

2. Update Supabase redirect URLs:
   - Add production callback: `https://yourdomain.com/auth/callback`
   - Add to authorized URLs in Google Cloud Console

### Security Considerations

✅ **Implemented:**
- HTTP-only secure cookies for session storage
- Server-side session validation
- Middleware-based route protection
- PKCE flow for OAuth

✅ **Recommended:**
- Enable email verification in Supabase
- Set up Row Level Security (RLS) policies
- Add role-based access control (RBAC)
- Monitor authentication events in Supabase logs

## Next Steps

### Add Role-Based Access Control

Currently, any authenticated user can access the dashboard. To restrict to specific users:

1. **Add user roles to Supabase:**
   ```sql
   -- In Supabase SQL Editor
   CREATE TABLE public.user_roles (
     user_id UUID REFERENCES auth.users(id),
     role TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   -- Enable RLS
   ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
   ```

2. **Check role in dashboard:**
   ```typescript
   // In page.tsx
   useEffect(() => {
     const checkRole = async () => {
       const { data: { user } } = await supabase.auth.getUser();
       const { data: role } = await supabase
         .from('user_roles')
         .select('role')
         .eq('user_id', user.id)
         .single();
       
       if (role?.role !== 'tutor' && role?.role !== 'admin') {
         router.push('/unauthorized');
       }
     };
     checkRole();
   }, []);
   ```

### Add Email/Password Authentication

To support email/password alongside Google:

1. Enable Email provider in Supabase Dashboard
2. Update login page with email form:
   ```typescript
   const handleEmailSignIn = async (email: string, password: string) => {
     const { error } = await supabase.auth.signInWithPassword({
       email,
       password,
     });
   };
   ```

## Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Authentication](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## Support

If you encounter issues:
1. Check Supabase Dashboard → Logs → Authentication
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Test OAuth flow in incognito mode
