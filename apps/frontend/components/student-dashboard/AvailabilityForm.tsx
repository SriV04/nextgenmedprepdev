'use client';

import { useState } from 'react';
import { useStudent, SpecificDateAvailability, WeeklyAvailability } from '@/contexts/StudentContext';

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
] as const;

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'America/New_York', label: 'New York (EST)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
];

export default function AvailabilityForm() {
  const { studentId, profile, submitAvailability } = useStudent();
  
  const [timezone, setTimezone] = useState(profile?.timezone || 'Europe/London');
  const [notes, setNotes] = useState(profile?.preferences || '');
  const [specificDates, setSpecificDates] = useState<SpecificDateAvailability[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form state for adding a specific date
  const [newDate, setNewDate] = useState('');
  const [newStartHour, setNewStartHour] = useState(9);
  const [newEndHour, setNewEndHour] = useState(17);

  const handleAddSpecificDate = () => {
    if (!newDate) {
      setErrorMessage('Please select a date');
      return;
    }

    if (newStartHour >= newEndHour) {
      setErrorMessage('End time must be after start time');
      return;
    }

    const newSlot: SpecificDateAvailability = {
      date: newDate,
      hour_start: newStartHour,
      hour_end: newEndHour,
      type: 'interview',
    };

    setSpecificDates([...specificDates, newSlot]);
    setNewDate('');
    setNewStartHour(9);
    setNewEndHour(17);
    setErrorMessage('');
  };

  const handleRemoveSpecificDate = (index: number) => {
    setSpecificDates(specificDates.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentId) {
      setErrorMessage('Student ID not found. Please log in again.');
      return;
    }

    setSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await submitAvailability({
        student_id: studentId,
        timezone,
        specific_dates: specificDates.length > 0 ? specificDates : undefined,
        notes: notes || undefined,
      });

      setSuccessMessage('Availability submitted successfully!');
      setSpecificDates([]);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to submit availability');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Timezone Selection */}
        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
            Your Timezone
          </label>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        {/* Specific Dates Availability */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Specific Dates & Times
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Add specific dates and time ranges when you're available for interview preparation sessions
          </p>

          {/* Add Date Form */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="startHour" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Hour
                </label>
                <select
                  id="startHour"
                  value={newStartHour}
                  onChange={(e) => setNewStartHour(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, '0')}:00
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="endHour" className="block text-sm font-medium text-gray-700 mb-1">
                  End Hour
                </label>
                <select
                  id="endHour"
                  value={newEndHour}
                  onChange={(e) => setNewEndHour(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => (
                    <option key={hour} value={hour}>
                      {hour.toString().padStart(2, '0')}:00
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddSpecificDate}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Add Date
                </button>
              </div>
            </div>
          </div>

          {/* Display Added Dates */}
          {specificDates.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Added Availability:</p>
              {specificDates.map((slot, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3"
                >
                  <div>
                    <span className="font-medium text-blue-900">
                      {new Date(slot.date).toLocaleDateString('en-GB', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="text-blue-700 ml-3">
                      {slot.hour_start.toString().padStart(2, '0')}:00 -{' '}
                      {slot.hour_end.toString().padStart(2, '0')}:00
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecificDate(index)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes/Preferences */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes or Preferences
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Any specific preferences for your interview preparation sessions? e.g., preferred interview style, areas to focus on, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{errorMessage}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
              submitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {submitting ? 'Submitting...' : 'Submit Availability'}
          </button>
        </div>
      </form>
    </div>
  );
}
