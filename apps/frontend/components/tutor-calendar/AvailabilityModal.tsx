'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Plus, Trash2, Check } from 'lucide-react';
import { useTutorCalendar } from '../../contexts/TutorCalendarContext';

interface DateAvailabilitySlot {
  id?: string;
  date: string;
  hour_start: number;
  hour_end: number;
  isExisting: boolean;
}

const AvailabilityModal: React.FC = () => {
  const {
    isAvailabilityModalOpen,
    currentUserId,
    tutors,
    closeAvailabilityModal,
    markSlotsAvailable,
    removeAvailability,
    refreshData
  } = useTutorCalendar();

  // Get current user's tutor profile
  const currentTutor = tutors.find(t => t.tutorId === currentUserId);
  const tutorName = currentTutor?.tutorName || 'Your';

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedHours, setSelectedHours] = useState<Set<number>>(new Set());
  const [existingSlots, setExistingSlots] = useState<DateAvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with today's date
  useEffect(() => {
    if (isAvailabilityModalOpen && !selectedDate) {
      const today = new Date();
      setSelectedDate(today.toISOString().split('T')[0]);
    }
  }, [isAvailabilityModalOpen]);

  // Load existing availability for selected date
  useEffect(() => {
    if (isAvailabilityModalOpen && selectedDate && currentTutor) {
      const slots = currentTutor.schedule[selectedDate] || [];
      const dateSlots: DateAvailabilitySlot[] = slots
        .filter(s => s.type === 'available')
        .map(s => ({
          id: s.id,
          date: selectedDate,
          hour_start: parseInt(s.startTime.split(':')[0], 10),
          hour_end: parseInt(s.endTime.split(':')[0], 10),
          isExisting: true
        }));
      setExistingSlots(dateSlots);
    } else {
      setExistingSlots([]);
    }
  }, [isAvailabilityModalOpen, selectedDate, currentTutor]);

  const hours = Array.from({ length: 13 }, (_, i) => i + 9); // 9 AM to 9 PM

  const formatHour = (hour: number) => {
    if (hour === 12) return '12:00 PM';
    if (hour === 0) return '12:00 AM';
    if (hour > 12) return `${hour - 12}:00 PM`;
    return `${hour}:00 AM`;
  };

  const toggleHour = (hour: number) => {
    const newSelected = new Set(selectedHours);
    if (newSelected.has(hour)) {
      newSelected.delete(hour);
    } else {
      newSelected.add(hour);
    }
    setSelectedHours(newSelected);
  };

  const isHourAvailable = (hour: number): DateAvailabilitySlot | undefined => {
    return existingSlots.find(slot => 
      slot.hour_start === hour && slot.hour_end === hour + 1
    );
  };

  const handleAddAvailability = async () => {
    if (!currentUserId || !selectedDate || selectedHours.size === 0) {
      alert('Please select at least one hour to add availability.');
      return;
    }

    setIsLoading(true);
    try {
      const slotsToAdd = Array.from(selectedHours).map(hour => ({
        tutorId: currentUserId,
        date: selectedDate,
        time: `${String(hour).padStart(2, '0')}:00`
      }));

      await markSlotsAvailable(slotsToAdd);
      
      // Refresh to get updated data
      await refreshData();
      
      // Clear selection
      setSelectedHours(new Set());
    } catch (error) {
      console.error('Error adding availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSlot = async (slot: DateAvailabilitySlot) => {
    if (!slot.id || !currentUserId) return;

    if (!confirm(`Remove availability for ${formatHour(slot.hour_start)}?`)) {
      return;
    }

    setIsLoading(true);
    try {
      await removeAvailability([{ tutorId: currentUserId, slotId: slot.id }]);
      
      // Refresh to get updated data
      await refreshData();
    } catch (error) {
      console.error('Error removing availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSelect = (type: 'morning' | 'afternoon' | 'evening' | 'all' | 'clear') => {
    const newSelected = new Set<number>();
    
    switch (type) {
      case 'morning': // 9 AM - 12 PM
        [9, 10, 11].forEach(h => newSelected.add(h));
        break;
      case 'afternoon': // 12 PM - 5 PM
        [12, 13, 14, 15, 16].forEach(h => newSelected.add(h));
        break;
      case 'evening': // 5 PM - 9 PM
        [17, 18, 19, 20].forEach(h => newSelected.add(h));
        break;
      case 'all':
        hours.forEach(h => newSelected.add(h));
        break;
      case 'clear':
        break;
    }
    
    setSelectedHours(newSelected);
  };

  if (!isAvailabilityModalOpen) return null;

  if (!currentUserId || !currentTutor) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={closeAvailabilityModal}></div>
          <div className="inline-block bg-white rounded-lg p-6 shadow-xl max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600 mb-4">You must be signed in as a tutor to manage availability.</p>
            <button
              onClick={closeAvailabilityModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={closeAvailabilityModal}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-6 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Manage Your Availability</h3>
              <p className="text-sm text-gray-500 mt-1">{tutorName}'s Schedule</p>
            </div>
            <button
              onClick={closeAvailabilityModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Add New Availability */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Add Availability
              </h4>

              <div className="space-y-4">
                {/* Date Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Quick Select Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Select
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleQuickSelect('morning')}
                      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      Morning (9-12)
                    </button>
                    <button
                      onClick={() => handleQuickSelect('afternoon')}
                      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      Afternoon (12-5)
                    </button>
                    <button
                      onClick={() => handleQuickSelect('evening')}
                      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      Evening (5-9)
                    </button>
                    <button
                      onClick={() => handleQuickSelect('all')}
                      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      All Day
                    </button>
                  </div>
                  {selectedHours.size > 0 && (
                    <button
                      onClick={() => handleQuickSelect('clear')}
                      className="mt-2 w-full px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                {/* Hour Selection Grid */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Select Hours (click to toggle)
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto p-1">
                    {hours.map((hour) => {
                      const existing = isHourAvailable(hour);
                      const isSelected = selectedHours.has(hour);
                      
                      return (
                        <button
                          key={hour}
                          onClick={() => !existing && toggleHour(hour)}
                          disabled={!!existing}
                          className={`px-3 py-3 text-sm font-medium rounded-lg transition-all ${
                            existing
                              ? 'bg-green-100 text-green-800 border-2 border-green-300 cursor-not-allowed opacity-60'
                              : isSelected
                              ? 'bg-blue-600 text-white border-2 border-blue-700 shadow-md'
                              : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-blue-50 hover:border-blue-400'
                          }`}
                        >
                          {formatHour(hour)}
                          {existing && <Check className="w-3 h-3 inline ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Add Button */}
                <button
                  onClick={handleAddAvailability}
                  disabled={selectedHours.size === 0 || isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {isLoading ? 'Adding...' : `Add ${selectedHours.size} Hour${selectedHours.size !== 1 ? 's' : ''}`}
                </button>
              </div>
            </div>

            {/* Right: Current Availability */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Current Availability
                {selectedDate && (
                  <span className="text-sm font-normal text-gray-600">
                    ({new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', { 
                      weekday: 'short', 
                      day: 'numeric', 
                      month: 'short' 
                    })})
                  </span>
                )}
              </h4>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {existingSlots.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No availability set for this date</p>
                    <p className="text-sm mt-1">Select hours and click "Add" to get started</p>
                  </div>
                ) : (
                  existingSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {formatHour(slot.hour_start)} - {formatHour(slot.hour_end)}
                          </div>
                          <div className="text-xs text-gray-500">1 hour slot</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveSlot(slot)}
                        disabled={isLoading}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Remove this availability"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">💡 Tip:</span> Green hours are already available. Select and add new hours to expand your schedule.
            </div>
            <button
              onClick={closeAvailabilityModal}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityModal;
