import { createClient } from '../../../utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;
  const code = searchParams.get('code');
  const redirectTo = searchParams.get('redirectTo') || '/tutor-dashboard';

  // Determine the correct origin (Vercel or localhost)
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 
                 (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : requestUrl.origin);

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
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
            subjects: ['Interviews', 'UCAT', 'Personal Statement'], // Default subject, can be updated later
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
      
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
