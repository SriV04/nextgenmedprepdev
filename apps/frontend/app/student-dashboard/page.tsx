'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, BookOpen, CheckCircle, XCircle, LogOut, User, Mail, Phone } from 'lucide-react';
import { createClient } from '../../utils/supabase/client';
import { useRouter } from 'next/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

interface Interview {
  id: string;
  date: string;
  time: string;
  tutor: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'MMI' | 'Panel' | 'Traditional';
  notes?: string;
}

interface StudentProfile {
  name: string;
  email: string;
  phone?: string;
  university_target: string;
  interviews_completed: number;
  interviews_upcoming: number;
  joined_date: string;
}

// Mock data for demonstration
const mockProfile: StudentProfile = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  phone: '+44 7700 900000',
  university_target: 'Imperial College London',
  interviews_completed: 3,
  interviews_upcoming: 2,
  joined_date: '2024-09-15',
};

const mockInterviews: Interview[] = [
  {
    id: '1',
    date: '2025-01-05',
    time: '14:00',
    tutor: 'Dr. James Smith',
    status: 'upcoming',
    type: 'MMI',
    notes: 'Focus on ethical scenarios',
  },
  {
    id: '2',
    date: '2025-01-12',
    time: '16:30',
    tutor: 'Dr. Emily Chen',
    status: 'upcoming',
    type: 'Panel',
    notes: 'Mock panel interview for Imperial',
  },
  {
    id: '3',
    date: '2024-12-10',
    time: '10:00',
    tutor: 'Dr. James Smith',
    status: 'completed',
    type: 'Traditional',
    notes: 'Great improvement in communication',
  },
  {
    id: '4',
    date: '2024-11-28',
    time: '15:00',
    tutor: 'Dr. Sarah Williams',
    status: 'completed',
    type: 'MMI',
    notes: 'Strong responses, work on time management',
  },
  {
    id: '5',
    date: '2024-11-15',
    time: '11:00',
    tutor: 'Dr. Emily Chen',
    status: 'completed',
    type: 'Traditional',
    notes: 'First session - establish baseline',
  },
];

function StudentDashboardContent() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<StudentProfile>(mockProfile);
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [activeTab, setActiveTab] = useState<'overview' | 'interviews' | 'profile'>('overview');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login?redirectTo=/student-dashboard&role=student');
      } else {
        setUser(user);
        // Update mock profile with real user data
        setProfile(prev => ({
          ...prev,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
          email: user.email || prev.email,
        }));
      }
    };
    checkAuth();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login?role=student');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const upcomingInterviews = interviews.filter(i => i.status === 'upcoming');
  const completedInterviews = interviews.filter(i => i.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Welcome back, {profile.name}!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-500">Signed in as</p>
                <p className="text-sm font-medium text-gray-900">{profile.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="mt-6 flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('interviews')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'interviews'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Interviews
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Upcoming Interviews</p>
                    <p className="text-3xl font-bold text-gray-900">{profile.interviews_upcoming}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed Interviews</p>
                    <p className="text-3xl font-bold text-gray-900">{profile.interviews_completed}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Target University</p>
                    <p className="text-lg font-semibold text-gray-900">{profile.university_target}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Interviews */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Interviews</h2>
              </div>
              <div className="p-6">
                {upcomingInterviews.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No upcoming interviews scheduled</p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Book an Interview
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingInterviews.map((interview) => (
                      <div
                        key={interview.id}
                        className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                      >
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{interview.type} Interview</h3>
                              <p className="text-sm text-gray-600 mt-1">with {interview.tutor}</p>
                            </div>
                            <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                              Upcoming
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(interview.date).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {interview.time}
                            </div>
                          </div>
                          {interview.notes && (
                            <p className="mt-2 text-sm text-gray-600 italic">{interview.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Book New Interview</p>
                    <p className="text-sm text-gray-600">Schedule your next practice session</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all text-left">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">View Resources</p>
                    <p className="text-sm text-gray-600">Access preparation materials</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Interviews Tab */}
        {activeTab === 'interviews' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">All Interviews</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tutor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {interviews.map((interview) => (
                      <tr key={interview.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(interview.date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                          <div className="text-sm text-gray-500">{interview.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{interview.type}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{interview.tutor}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              interview.status === 'upcoming'
                                ? 'bg-green-100 text-green-800'
                                : interview.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {interview.notes || '-'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-blue-100 rounded-full">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                  <p className="text-sm text-gray-600">
                    Member since {new Date(profile.joined_date).toLocaleDateString('en-GB', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{profile.email}</p>
                  </div>
                </div>

                {profile.phone && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{profile.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Target University</p>
                    <p className="font-medium text-gray-900">{profile.university_target}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Account Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Interviews</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {profile.interviews_completed + profile.interviews_upcoming}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {profile.interviews_completed > 0
                      ? Math.round((profile.interviews_completed / (profile.interviews_completed + profile.interviews_upcoming)) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mock Data Notice */}
      <div className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg max-w-sm">
        <p className="text-sm font-medium text-yellow-800 mb-1">📊 Mock Data</p>
        <p className="text-xs text-yellow-700">
          This dashboard is currently displaying mock data. Real data integration coming soon.
        </p>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  return <StudentDashboardContent />;
}
