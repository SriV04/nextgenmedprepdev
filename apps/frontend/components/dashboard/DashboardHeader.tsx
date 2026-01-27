import React from 'react';

interface DashboardHeaderProps {
  userName: string;
  userEmail: string;
  onSignOut: () => void;
  nextSession?: { date: string; time: string; tutor: string } | null;
  primaryCTA: { label: string; onClick: () => void };
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName, userEmail, onSignOut, nextSession, primaryCTA }) => (
  <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Welcome back, {userName}!</p>
        {nextSession && (
          <p className="text-sm text-blue-700 mt-1">Next session: {nextSession.date} {nextSession.time} with {nextSession.tutor}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm text-gray-500">Signed in as</p>
          <p className="text-sm font-medium text-gray-900">{userEmail}</p>
        </div>
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Sign Out
        </button>
        <button
          onClick={primaryCTA.onClick}
          className="ml-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {primaryCTA.label}
        </button>
      </div>
    </div>
  </header>
);

export default DashboardHeader;
