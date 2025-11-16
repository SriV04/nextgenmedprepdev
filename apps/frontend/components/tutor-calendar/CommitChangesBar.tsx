'use client';

import { useTutorCalendar } from '../../contexts/TutorCalendarContext';
import { Save, X, AlertCircle } from 'lucide-react';

export default function CommitChangesBar() {
  const { pendingChanges, hasPendingChanges, commitChanges, discardChanges, loading } = useTutorCalendar();

  if (!hasPendingChanges) {
    return null;
  }

  return (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <AlertCircle className="text-amber-600 w-6 h-6" />
        <div>
          <h3 className="font-semibold text-amber-900">
            {pendingChanges.length} Pending Change{pendingChanges.length !== 1 ? 's' : ''}
          </h3>
          <p className="text-sm text-amber-700">
            Commit changes to send confirmation emails to tutors and students
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={discardChanges}
          disabled={loading}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-4 h-4" />
          Discard
        </button>
        
        <button
          onClick={commitChanges}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Committing...' : `Commit & Send Emails (${pendingChanges.length})`}
        </button>
      </div>
    </div>
  );
}
