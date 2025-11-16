# Quick Start: Enable Google Authentication

## ✅ What I've Done

1. **Installed Supabase packages** in frontend
2. **Created authentication utilities**:
   - Client-side Supabase client
   - Server-side Supabase client  
   - Middleware for session management
3. **Created login page** at `/auth/login` with Google sign-in button
4. **Created auth callback handler** at `/auth/callback`
5. **Protected tutor dashboard** - requires authentication
6. **Added sign-out functionality** to dashboard
7. **Updated environment variables** template

## 🚀 What You Need to Do

### Step 1: Get Supabase Credentials (5 minutes)

1. Go to https://app.supabase.com
2. Open your project
3. Click **Project Settings** (gear icon) → **API**
4. Copy these values and update `apps/frontend/.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```

### Step 2: Configure Google OAuth (10 minutes)

1. Go to https://console.cloud.google.com
2. Create a new project (or select existing)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure consent screen if prompted
6. For redirect URI, add:
   ```
   https://<your-supabase-ref>.supabase.co/auth/v1/callback
   ```
7. Copy **Client ID** and **Client Secret**

### Step 3: Enable Google in Supabase (2 minutes)

1. In Supabase Dashboard → **Authentication** → **Providers**
2. Find **Google** and enable it
3. Paste your Google **Client ID** and **Client Secret**
4. Click **Save**

### Step 4: Configure URLs (2 minutes)

1. In Supabase → **Authentication** → **URL Configuration**
2. Set **Site URL**: `http://localhost:3000`
3. Add **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   ```

### Step 5: Test It! (1 minute)

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Test the flow:**
   - Visit http://localhost:3000/tutor-dashboard
   - You should be redirected to login
   - Click "Continue with Google"
   - Sign in with your Google account
   - You should land back on the dashboard! 🎉

## 📝 How It Works

```
User visits /tutor-dashboard
         ↓
   Not authenticated?
         ↓
Redirect to /auth/login
         ↓
User clicks "Continue with Google"
         ↓
   Google OAuth flow
         ↓
Redirect to /auth/callback
         ↓
Exchange code for session
         ↓
Redirect to /tutor-dashboard
         ↓
    ✅ Authenticated!
```

## 🔒 What's Protected

- **`/tutor-dashboard`** - Only accessible when logged in
- Session persists across page refreshes
- Automatic redirect to login if session expires

## 📚 Full Documentation

See `docs/SUPABASE_AUTH_SETUP.md` for:
- Detailed setup instructions
- Troubleshooting guide
- Production deployment
- Role-based access control
- Security best practices

## 🆘 Common Issues

### "Invalid redirect URL"
➡️ Add `http://localhost:3000/auth/callback` to Supabase redirect URLs

### "Google OAuth error"  
➡️ Check that redirect URI in Google Console matches Supabase callback URL

### Environment variables not working
➡️ Make sure to restart dev server after updating `.env.local`

---

**Need help?** Check the browser console and Supabase Dashboard → Logs for errors.
