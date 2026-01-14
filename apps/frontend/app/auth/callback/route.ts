import { createClient } from '../../../utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const roleParam = searchParams.get('role');
  const redirectToParam = searchParams.get('redirectTo');
  const inferredRole = redirectToParam?.includes('/student-dashboard')
    ? 'student'
    : redirectToParam?.includes('/tutor-dashboard')
      ? 'tutor'
      : null;
  const authRole = roleParam === 'student' || roleParam === 'tutor'
    ? roleParam
    : inferredRole || 'student';
  const fallbackRedirect = authRole === 'student' ? '/student-dashboard' : '/tutor-dashboard';
  const redirectTo = redirectToParam || fallbackRedirect;

  // Determine the correct origin (Vercel or localhost)
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 
                 (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : requestUrl.origin);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
  const buildLoginRedirect = (errorCode: string, message: string) => {
    const loginUrl = new URL(`${origin}/auth/login`);
    loginUrl.searchParams.set('error', errorCode);
    loginUrl.searchParams.set('message', message);
    loginUrl.searchParams.set('role', authRole);
    loginUrl.searchParams.set('redirectTo', redirectTo);
    return loginUrl.toString();
  };

  const syncRoleProfile = async (user: { id: string; email?: string | null; user_metadata?: Record<string, any> }) => {
    if (!user.email) return;
    const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0];

    if (authRole === 'student') {
      const response = await fetch(`${backendUrl}/api/v1/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          full_name: displayName,
          role: 'student',
        }),
      });

      if (!response.ok && response.status !== 409) {
        throw new Error('Failed to sync student profile');
      }
      return;
    }

    const response = await fetch(`${backendUrl}/api/v1/tutors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user.id,
        name: displayName,
        email: user.email,
        subjects: ['Interviews', 'UCAT', 'Personal Statement'],
        role: 'tutor',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to sync tutor profile');
    }
  };

  // Check for OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(buildLoginRedirect(
      error,
      errorDescription || 'Authentication failed'
    ));
  }

  const supabase = await createClient();

  // Handle email verification (token_hash + type from confirmation link)
  if (token_hash && type) {
    console.log('Handling email verification:', { type });
    
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });

    if (verifyError) {
      console.error('Error verifying email:', verifyError);
      return NextResponse.redirect(buildLoginRedirect('verification_failed', verifyError.message));
    }

    if (data.user) {
      console.log('Email verified successfully:', data.user.email);
      
      try {
        await syncRoleProfile(data.user);
      } catch (backendError) {
        console.error('Error syncing profile:', backendError);
        // Continue anyway - user is authenticated
      }

      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  // Handle OAuth callback (code from OAuth provider)
  if (code) {
    console.log('Handling OAuth callback');
    
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError);
      return NextResponse.redirect(buildLoginRedirect('session_error', exchangeError.message));
    }
    
    if (data.user) {
      console.log('User authenticated successfully:', data.user.email);
      
      try {
        await syncRoleProfile(data.user);
      } catch (backendError) {
        console.error('Error syncing profile:', backendError);
        // Continue anyway - user is authenticated
      }
      
      // Create redirect response
      const redirectResponse = NextResponse.redirect(`${origin}${redirectTo}`);
      return redirectResponse;
    }
  }

  // Return the user to an error page with instructions
  console.error('No code, token_hash, or user found in callback');
  return NextResponse.redirect(buildLoginRedirect('auth_failed', 'No authentication code received'));
}
