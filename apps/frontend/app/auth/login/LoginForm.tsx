'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../../utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [fieldsCanTutor, setFieldsCanTutor] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const roleParam = searchParams.get('role');
  const redirectParam = searchParams.get('redirectTo');
  const inferredRole = redirectParam?.includes('/student-dashboard')
    ? 'student'
    : redirectParam?.includes('/tutor-dashboard')
      ? 'tutor'
      : null;
  const authRole = roleParam === 'student' || roleParam === 'tutor'
    ? roleParam
    : inferredRole || 'student';
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

  useEffect(() => {
    // Check for error messages from callback
    const errorParam = searchParams.get('error');
    const messageParam = searchParams.get('message');
    if (errorParam) {
      setError(messageParam || 'Authentication failed. Please try again.');
    }

    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fallbackRedirect = authRole === 'student' ? '/student-dashboard' : '/tutor-dashboard';
        const redirectTo = searchParams.get('redirectTo') || fallbackRedirect;
        router.push(redirectTo);
      }
    };
    checkUser();
  }, [authRole, router, searchParams, supabase]);

  const handleRoleChange = (role: 'student' | 'tutor') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('role', role);
    params.set('redirectTo', role === 'student' ? '/student-dashboard' : '/tutor-dashboard');
    router.replace(`/auth/login?${params.toString()}`);
    setIsReset(false);
    setIsSignUp(false);
    setError(null);
    setInfo(null);
    setFieldsCanTutor([]);
  };

  const syncRoleProfile = async (
    userId: string,
    userEmail: string,
    fullName?: string,
    tutorFields?: string[]
  ) => {
    const displayName = fullName || userEmail.split('@')[0];
    if (authRole === 'student') {
      const response = await fetch(`${backendUrl}/api/v1/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        name: displayName,
        email: userEmail,
        subjects: ['Interviews', 'UCAT', 'Personal Statement'],
        field: tutorFields,
        role: 'tutor',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to sync tutor profile');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setInfo(null);

      const fallbackRedirect = authRole === 'student' ? '/student-dashboard' : '/tutor-dashboard';
      const redirectTo = searchParams.get('redirectTo') || fallbackRedirect;
      const origin = typeof window !== 'undefined' ? window.location.origin : '';

      if (isSignUp) {
        // Sign up
        if (authRole === 'tutor' && fieldsCanTutor.length === 0) {
          setError('Please select at least one field you can tutor.');
          setLoading(false);
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              field: authRole === 'tutor' ? fieldsCanTutor : undefined,
            },
            emailRedirectTo: `${origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}&role=${authRole}`,
          },
        });

        if (error) throw error;

        if (data.user) {
          // Check if email confirmation is required
          if (data.user.identities && data.user.identities.length === 0) {
            // Email already exists
            setError('An account with this email already exists. Please sign in instead.');
            setLoading(false);
            return;
          }

          // Check if email confirmation is required
          if (data.session) {
            // User is auto-confirmed (email confirmation disabled)
            try {
              await syncRoleProfile(
                data.user.id,
                email,
                name || data.user.user_metadata?.full_name,
                authRole === 'tutor' ? fieldsCanTutor : undefined
              );
            } catch (backendError) {
              console.error('Error syncing profile:', backendError);
              // Continue anyway
            }
            router.push(redirectTo);
          } else {
            // Email confirmation required
            alert('Account created! Please check your email to verify your account before signing in.');
            setIsSignUp(false);
            setEmail('');
            setPassword('');
            setName('');
            setFieldsCanTutor([]);
          }
        }
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        if (data.user) {
          try {
            await syncRoleProfile(
              data.user.id,
              data.user.email || email,
              data.user.user_metadata?.full_name
            );
          } catch (backendError) {
            console.error('Error syncing profile:', backendError);
            // Continue anyway
          }
        }
        router.push(redirectTo);
      }
    } catch (err: any) {
      console.error('Error with email auth:', err);
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setInfo(null);
      const origin = typeof window !== 'undefined' ? window.location.origin : '';

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/reset-password?role=${authRole}`,
      });

      if (error) throw error;
      setInfo('Password reset email sent. Check your inbox.');
      setIsReset(false);
    } catch (err: any) {
      console.error('Error sending reset email:', err);
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      setInfo(null);

      const fallbackRedirect = authRole === 'student' ? '/student-dashboard' : '/tutor-dashboard';
      const redirectTo = searchParams.get('redirectTo') || fallbackRedirect;
      
      // Get the current origin, prioritizing window.location for client-side
      let origin = '';
      if (typeof window !== 'undefined') {
        origin = window.location.origin;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}&role=${authRole}`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('Error signing in with Google:', err);
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 ${
      authRole === 'student'
        ? 'bg-gradient-to-br from-amber-50 via-white to-teal-50'
        : 'bg-gradient-to-br from-blue-50 via-white to-amber-50'
    }`}>
      <div className="max-w-5xl w-full grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-stretch">
        <div className="rounded-2xl border border-white/60 bg-white/80 shadow-lg backdrop-blur px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              NextGen MedPrep
            </span>
            <div className="flex gap-2 rounded-full bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                  authRole === 'student'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('tutor')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                  authRole === 'tutor'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Tutor
              </button>
            </div>
          </div>

          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {authRole === 'student' ? 'Student Portal' : 'Tutor Workspace'}
          </h2>
          <p className="mt-3 text-sm text-gray-600">
            {authRole === 'student'
              ? 'Track your interviews, manage bookings, and keep everything in one place.'
              : 'Manage interviews, calendars, and student requests with clarity.'}
          </p>

          <div className="mt-8 space-y-4 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"></span>
              <p>{authRole === 'student' ? 'Book sessions faster with saved preferences.' : 'See your weekly availability at a glance.'}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-blue-500"></span>
              <p>{authRole === 'student' ? 'Review tutor feedback and session notes.' : 'Coordinate with the team on upcoming interviews.'}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-amber-500"></span>
              <p>{authRole === 'student' ? 'Keep your prep timeline and resources aligned.' : 'Stay up to date on assigned students and bookings.'}</p>
            </div>
          </div>

          <div className="mt-10 text-sm text-gray-500">
            Not sure which one you need? Use the dashboard links on the homepage.
          </div>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              {isReset ? 'Reset your password' : isSignUp ? 'Create your account' : 'Welcome back'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {isReset
                ? 'Enter your email and we will send a reset link.'
                : isSignUp
                  ? `Set up your ${authRole === 'student' ? 'student' : 'tutor'} access in minutes.`
                  : `Sign in to continue to your ${authRole === 'student' ? 'student' : 'tutor'} dashboard.`}
            </p>
          </div>
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
              <p className="text-sm font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {info && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-4">
              <p className="text-sm font-medium">Success</p>
              <p className="text-sm">{info}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Email/Password Form */}
            <form onSubmit={isReset ? handlePasswordReset : handleEmailAuth} className="space-y-4">
              {isSignUp && !isReset && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isSignUp}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              {!isReset && (
                <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                {isSignUp && (
                  <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                )}
                </div>
              )}

              {isSignUp && authRole === 'tutor' && !isReset && (
                <div>
                  <p className="block text-sm font-medium text-gray-700 mb-2">
                    Fields you can tutor <span className="text-red-500">*</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {['medicine', 'dentistry'].map((field) => (
                      <label key={field} className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          value={field}
                          checked={fieldsCanTutor.includes(field)}
                          onChange={(e) => {
                            const { checked, value } = e.target;
                            setFieldsCanTutor((prev) =>
                              checked ? [...prev, value] : prev.filter((item) => item !== value)
                            );
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="capitalize">{field}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>
                      {isReset ? 'Sending link...' : isSignUp ? 'Creating account...' : 'Signing in...'}
                    </span>
                  </>
                ) : (
                  <span>{isReset ? 'Send reset link' : isSignUp ? 'Create account' : 'Sign in'}</span>
                )}
              </button>
            </form>

            {/* Toggle Sign Up / Sign In */}
            <div className="text-center">
              {isReset ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsReset(false);
                    setError(null);
                    setInfo(null);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Back to sign in
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setIsReset(false);
                    setError(null);
                    setInfo(null);
                    setEmail('');
                    setPassword('');
                    setName('');
                    setFieldsCanTutor([]);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              )}
            </div>

            {!isReset && !isSignUp && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsReset(true);
                    setIsSignUp(false);
                    setError(null);
                    setInfo(null);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Forgot password?
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>
              </>
            )}

            <div className="text-center">
              <p className="text-xs text-gray-500">
                By signing {isSignUp ? 'up' : 'in'}, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
