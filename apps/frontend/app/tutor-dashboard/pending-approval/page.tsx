'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';
import { Clock, Mail, LogOut, RefreshCw } from 'lucide-react';

export default function PendingApprovalPage() {
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login?redirectTo=/tutor-dashboard&role=tutor');
        return;
      }

      setUserEmail(user.email || '');

      // Check if approval status has changed
      const { data: tutorData } = await supabase
        .from('tutors')
        .select('approval_status')
        .eq('id', user.id)
        .single();

      if (tutorData?.approval_status === 'approved') {
        // Redirect to dashboard if approved
        router.push('/tutor-dashboard');
        return;
      }

      if (tutorData?.approval_status === 'rejected') {
        // Sign out and redirect if rejected
        await supabase.auth.signOut();
        router.push('/auth/login?error=rejected&message=Your application has been rejected');
        return;
      }

      setLoading(false);
    };

    checkStatus();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleRefresh = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/auth/login?redirectTo=/tutor-dashboard&role=tutor');
      return;
    }

    const { data: tutorData } = await supabase
      .from('tutors')
      .select('approval_status')
      .eq('id', user.id)
      .single();

    if (tutorData?.approval_status === 'approved') {
      router.push('/tutor-dashboard');
    } else if (tutorData?.approval_status === 'rejected') {
      await supabase.auth.signOut();
      router.push('/auth/login?error=rejected&message=Your application has been rejected');
    } else {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
          Application Pending
        </h1>

        {/* Message */}
        <p className="text-lg text-gray-600 text-center mb-8">
          Thank you for signing up as a tutor! Your account is currently under review.
        </p>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Our admin team will review your application</li>
                <li>• You'll receive an email at <span className="font-semibold">{userEmail}</span> once approved</li>
                <li>• This usually takes 1-2 business days</li>
                <li>• You can check back anytime using the refresh button below</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleRefresh}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            Check Status
          </button>
          <button
            onClick={handleSignOut}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>

        {/* Support Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Questions? Contact us at{' '}
            <a href="mailto:support@nextgenmedprep.com" className="text-purple-600 hover:text-purple-700 font-medium">
              support@nextgenmedprep.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
