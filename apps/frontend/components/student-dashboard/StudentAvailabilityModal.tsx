'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, Plus, Trash2, Check, CheckCircle } from 'lucide-react';
import type { DashboardAvailabilitySlot } from '@/app/student-dashboard/hooks/useStudentDashboardData';

interface StudentAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (slots: Array<{ date: string; hour_start: number; hour_end: number }>) => Promise<void>;
  existingAvailability: DashboardAvailabilitySlot[];
  loading?: boolean;
}

export default function StudentAvailabilityModal({
  isOpen,
  onClose,
  onSave,
  existingAvailability,
  loading = false,
}: StudentAvailabilityModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedHours, setSelectedHours] = useState<Set<number>>(new Set());
  const [existingSlots, setExistingSlots] = useState<DashboardAvailabilitySlot[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const hours: number[] = Array.from({ length: 13 }, (_, i) => i + 9); // 9 AM to 9 PM

  // Load existing availability for selected date
  useEffect(() => {
    if (isOpen) {
      const dateString = selectedDate.toISOString().split('T')[0];
      const slotsForDate = existingAvailability.filter(
        (slot) => slot.date === dateString
      );
      setExistingSlots(slotsForDate);

      // Populate selected hours from existing slots
      const hours = new Set<number>();
      slotsForDate.forEach((slot) => {
        hours.add(slot.hour_start);
      });
      setSelectedHours(hours);
    }
  }, [isOpen, selectedDate, existingAvailability]);

  // Handle click outside date picker to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  const formatHour = (hour: number): string => {
    if (hour === 12) return '12:00 PM';
    if (hour === 0) return '12:00 AM';
    if (hour > 12) return `${hour - 12}:00 PM`;
    return `${hour}:00 AM`;
  };

  const toggleHour = (hour: number): void => {
    const newSelected = new Set(selectedHours);
    if (newSelected.has(hour)) {
      newSelected.delete(hour);
    } else {
      newSelected.add(hour);
    }
    setSelectedHours(newSelected);
  };

  const isHourExisting = (hour: number): boolean => {
    return existingSlots.some((slot) => slot.hour_start === hour);
  };

  const handleRemoveSlot = async (slot: DashboardAvailabilitySlot) => {
    if (!slot.id) return;
    setIsSaving(true);
    setError(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
      const response = await fetch(
        `${backendUrl}/api/v1/student-availability/${slot.id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Failed to remove availability slot');
      }

      setExistingSlots((prev) => prev.filter((s) => s.id !== slot.id));
      const newSelected = new Set(selectedHours);
      newSelected.delete(slot.hour_start);
      setSelectedHours(newSelected);
    } catch (err: any) {
      setError(err.message || 'Failed to remove slot');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSlots = async () => {
    if (selectedHours.size === 0) {
      setError('Please select at least one time slot');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const newSlots = Array.from(selectedHours).map((hour) => ({
        date: dateString,
        hour_start: hour,
        hour_end: hour + 1,
      }));

      await onSave(newSlots);
      setSuccess(true);
      
      // Auto-close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to save availability');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const dateString = selectedDate.toISOString().split('T')[0];
  const slotsForSelectedDate = existingAvailability.filter(
    (slot) => slot.date === dateString
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-50">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Manage Your Availability
            </h3>
            <p className="text-sm text-gray-600 mt-1">Set times when you're available for interviews</p>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving || loading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {success ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Availability submitted successfully!
              </h3>
              <p className="text-gray-600">This modal will close automatically...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Date Picker */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Select Date
                </label>
                <div className="relative" ref={datePickerRef}>
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    disabled={isSaving || loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left font-medium text-gray-900 hover:border-blue-300 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {selectedDate.toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </button>

                  {showDatePicker && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4 min-w-[300px]">
                      <input
                        type="date"
                        value={dateString}
                        onChange={(e) => {
                          setSelectedDate(new Date(e.target.value + 'T00:00:00'));
                          setShowDatePicker(false);
                        }}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Available Times (9 AM - 9 PM)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {hours.map((hour) => {
                    const isSelected = selectedHours.has(hour);
                    const isExisting = isHourExisting(hour);
                    const isPast =
                      selectedDate.toDateString() === new Date().toDateString() &&
                      hour <= new Date().getHours();

                    return (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => !isExisting && !isPast && toggleHour(hour)}
                        disabled={isExisting || isPast || isSaving || loading}
                        className={`p-3 rounded-lg font-medium text-sm transition-all ${
                          isExisting
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'
                            : isPast
                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
                            : isSelected
                            ? 'bg-blue-600 text-white border border-blue-600 hover:bg-blue-700'
                            : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-400'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span>{formatHour(hour)}</span>
                          {isSelected && <Check className="w-4 h-4" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Existing Slots for Selected Date */}
              {slotsForSelectedDate.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Current Availability for{' '}
                    {selectedDate.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                  </h4>
                  <div className="space-y-2 bg-gray-50 rounded-lg p-4">
                    {slotsForSelectedDate.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                      >
                        <span className="text-sm text-gray-700">
                          {formatHour(slot.hour_start)} - {formatHour(slot.hour_end)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSlot(slot)}
                          disabled={isSaving || loading}
                          className="text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving || loading}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddSlots}
              disabled={selectedHours.size === 0 || isSaving || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {isSaving ? 'Adding...' : 'Add Selected Times'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
