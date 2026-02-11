'use client';

import { useEffect, useState } from 'react';
import { LogIn } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface SmartLoginLinkProps {
  className?: string;
}

export default function SmartLoginLink({ className }: SmartLoginLinkProps) {
  const [href, setHref] = useState('/auth/login?role=student&redirectTo=/student-dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Check if user is a tutor
          const { data: tutorData } = await supabase
            .from('tutors')
            .select('id, approval_status')
            .eq('id', user.id)
            .single();

          if (tutorData && tutorData.approval_status === 'approved') {
            // User is an approved tutor, redirect to tutor dashboard
            setHref('/tutor-dashboard');
          } else if (tutorData && tutorData.approval_status === 'pending') {
            // User is a tutor pending approval
            setHref('/tutor-dashboard/pending-approval');
          } else {
            // User is a student
            setHref('/student-dashboard');
          }
        } else {
          // Not logged in, show login
          setHref('/auth/login?role=student&redirectTo=/student-dashboard');
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        // Default to student login on error
        setHref('/auth/login?role=student&redirectTo=/student-dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [supabase]);

  return (
    <a
      href={href}
      className={className || `px-1.5 py-1.5 mr-0.5 rounded-full transition-all duration-300 font-medium text-xs whitespace-nowrap flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-md`}
      aria-label="Login or Dashboard"
    >
      <LogIn className="w-3.5 h-3.5 flex-shrink-0" />
      <span className="whitespace-nowrap">
        {isLoading ? 'Loading...' : 'Login'}
      </span>
    </a>
  );
}
