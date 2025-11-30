'use client';

import { useTutorCalendar } from '../../contexts/TutorCalendarContext';
import { Save, X, AlertCircle } from 'lucide-react';

export default function CommitChangesBar() {
  const { pendingChanges, hasPendingChanges, commitChanges, discardChanges, loading } = useTutorCalendar();

  if (!hasPendingChanges) {
    return null;
  }

  return (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 shadow-md">
      <div className="flex items-center gap-2 sm:gap-3">
        <AlertCircle className="text-amber-600 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
        <div className="min-w-0">
          <h3 className="font-semibold text-amber-900 text-sm sm:text-base">
            {pendingChanges.length} Pending Change{pendingChanges.length !== 1 ? 's' : ''}
          </h3>
          <p className="text-xs sm:text-sm text-amber-700">
            Commit changes to send confirmation emails
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={discardChanges}
          disabled={loading}
          className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-3 h-3 sm:w-4 sm:h-4" />
          Discard
        </button>
        
        <button
          onClick={commitChanges}
          disabled={loading}
          className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1 sm:gap-2 font-semibold text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">{loading ? 'Committing...' : `Commit & Send Emails (${pendingChanges.length})`}</span>
          <span className="sm:hidden">{loading ? 'Committing...' : `Commit (${pendingChanges.length})`}</span>
        </button>
      </div>
    </div>
  );
}
