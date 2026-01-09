'use client';

import { Suspense } from 'react';
import LoginForm from './LoginForm';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

// Skeleton component to show while loading
function LoginPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to NextGen MedPrep
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Loading your login experience
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-sm font-medium text-gray-400">
              <div className="animate-pulse rounded-full h-5 w-5 bg-gray-300"></div>
              <span>Loading...</span>
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

