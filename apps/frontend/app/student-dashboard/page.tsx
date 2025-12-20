'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import StudentDashboardContent from './StudentDashboardContent';
import { StudentProvider } from '@/contexts/StudentContext';

export default function StudentDashboard() {
  const searchParams = useSearchParams();
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    // Get student ID from URL parameters or auth context
    // For demo purposes, we'll check URL params first
    const idFromParams = searchParams.get('student_id');
    
    if (idFromParams) {
      setStudentId(idFromParams);
    } else {
      // TODO: In production, get student ID from your auth system
      // For now, we'll show a message to provide student_id
      console.warn('No student_id found. Add ?student_id=YOUR_ID to URL');
    }
  }, [searchParams]);

  return (
    <StudentProvider initialStudentId={studentId}>
      <StudentDashboardContent />
    </StudentProvider>
  );
}
