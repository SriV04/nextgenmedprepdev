import { createClient } from '../../../utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const redirectTo = searchParams.get('redirectTo') || '/tutor-dashboard';

  // Determine the correct origin (Vercel or localhost)
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 
                 (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : requestUrl.origin);

  // Check for OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(error)}&message=${encodeURIComponent(errorDescription || 'Authentication failed')}`);
  }

  if (code) {
    const supabase = await createClient();
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError);
      return NextResponse.redirect(`${origin}/auth/login?error=session_error&message=${encodeURIComponent(exchangeError.message)}`);
    }
    
    if (data.user) {
      console.log('User authenticated successfully:', data.user.email);
      
      // Create tutor account in backend
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
        
        const response = await fetch(`${backendUrl}/api/v1/tutors`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: data.user.id,
            name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Tutor',
            email: data.user.email,
            subjects: ['Interviews', 'UCAT', 'Personal Statement'],
            role: 'tutor',
          }),
        });

        const result = await response.json();
        
        if (result.success) {
          console.log('Tutor account created/verified:', result.data);
        } else {
          console.error('Failed to create tutor account:', result);
        }
      } catch (backendError) {
        console.error('Error calling backend to create tutor:', backendError);
        // Continue anyway - user is authenticated
      }
      
      // Create redirect response
      const redirectResponse = NextResponse.redirect(`${origin}${redirectTo}`);
      return redirectResponse;
    }
  }

  // Return the user to an error page with instructions
  console.error('No code or user found in callback');
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed&message=${encodeURIComponent('No authentication code received')}`);
}
