'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import { useTutorCalendar } from '../../contexts/TutorCalendarContext';

interface AvailabilitySlot {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
}

const AvailabilityModal: React.FC = () => {
  const {
    isAvailabilityModalOpen,
    selectedTutor,
    tutors,
    closeAvailabilityModal,
    saveAvailability
  } = useTutorCalendar();

  const tutor = tutors.find(t => t.tutorId === selectedTutor?.tutorId);
  const currentAvailability = tutor?.availability || [];
  const tutorName = tutor?.tutorName || '';

  const [availability, setAvailability] = useState<AvailabilitySlot[]>(currentAvailability);

  // Update availability when modal opens/tutor changes
  useEffect(() => {
    if (isAvailabilityModalOpen && tutor) {
      setAvailability(tutor.availability);
    }
  }, [isAvailabilityModalOpen, tutor]);
  const [selectedDay, setSelectedDay] = useState<number>(1); // Monday default
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const daysOfWeek = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 0, label: 'Sunday' }
  ];

  const timeSlots = [];
  for (let hour = 7; hour <= 21; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  const handleAddSlot = () => {
    const newSlot: AvailabilitySlot = {
      id: `slot-${Date.now()}`,
      dayOfWeek: selectedDay,
      startTime,
      endTime
    };
    setAvailability([...availability, newSlot]);
  };

  const handleRemoveSlot = (id: string) => {
    setAvailability(availability.filter(slot => slot.id !== id));
  };

  const handleSave = () => {
    if (selectedTutor) {
      saveAvailability(selectedTutor.tutorId, availability);
      closeAvailabilityModal();
    }
  };

  const getDayLabel = (day: number) => {
    return daysOfWeek.find(d => d.value === day)?.label || '';
  };

  const groupedAvailability = availability.reduce((acc, slot) => {
    if (!acc[slot.dayOfWeek]) {
      acc[slot.dayOfWeek] = [];
    }
    acc[slot.dayOfWeek].push(slot);
    return acc;
  }, {} as Record<number, AvailabilitySlot[]>);

  if (!isAvailabilityModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={closeAvailabilityModal}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-6 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Set Availability</h3>
              <p className="text-sm text-gray-500 mt-1">Managing schedule for {tutorName}</p>
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
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Add Availability
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Day of Week
                  </label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {daysOfWeek.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleAddSlot}
                  disabled={startTime >= endTime}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Time Slot
                </button>
              </div>
            </div>

            {/* Right: Current Availability */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Current Availability
              </h4>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {daysOfWeek.map((day) => {
                  const daySlots = groupedAvailability[day.value] || [];
                  if (daySlots.length === 0) return null;

                  return (
                    <div key={day.value} className="bg-white rounded-lg border border-gray-200 p-3">
                      <h5 className="font-medium text-gray-900 mb-2">{day.label}</h5>
                      <div className="space-y-2">
                        {daySlots.map((slot) => (
                          <div
                            key={slot.id}
                            className="flex items-center justify-between bg-green-50 rounded-lg p-2 border border-green-200"
                          >
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-gray-900">
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </div>
                            <button
                              onClick={() => handleRemoveSlot(slot.id)}
                              className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded p-1 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {availability.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No availability set. Add time slots to get started.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={closeAvailabilityModal}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Save Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityModal;
