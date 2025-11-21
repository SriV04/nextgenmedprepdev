/**
 * Utility functions for interview date generation and management
 */

// Generate available interview dates for the next 3 months
export const generateAvailableInterviewDates = (): string[] => {
  const dates: string[] = [];
  const today = new Date();
  const endDate = new Date();
  endDate.setMonth(today.getMonth() + 3); // 3 months from now
  
  // Start from next Monday
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + (8 - today.getDay()) % 7 || 7);
  
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Only include weekdays (Monday to Friday)
    if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
      dates.push(currentDate.toISOString().split('T')[0]);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

// Standard time slots for interview sessions
export const getStandardTimeSlots = (): string[] => {
  return [
    '09:00 - 10:00',
    '9:30 - 10:30',
    '11:00 - 12:00',
    '12:30 - 13:30',
    '14:00 - 15:00',
    '15:30 - 16:30',
    '16:00 - 17:00',
    '17:30 - 18:30',
    '18:00 - 19:00',
  ];
};

// Format date for display
export const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Check if date is in the past
export const isDateInPast = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// Get interview season dates based on university interview periods
export const getUniversityInterviewDates = (universityId: string): string[] => {
  // Most UK medical schools interview between December and March
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  // If it's before September, use current year for interview season
  // If it's September or later, use next year for interview season
  const interviewYear = currentMonth >= 8 ? currentYear + 1 : currentYear;
  
  const dates: string[] = [];
  
  // Interview season: December to March
  const startMonth = 11; // December (0-indexed)
  const endMonth = 2; // March (0-indexed)
  
  for (let month = startMonth; month <= 12; month++) {
    if (month === 12) continue; // Skip month 12 (doesn't exist)
    addMonthDates(dates, interviewYear - 1, month); // December of previous year
  }
  
  for (let month = 0; month <= endMonth; month++) {
    addMonthDates(dates, interviewYear, month); // Jan, Feb, Mar of interview year
  }
  
  return dates.filter(date => !isDateInPast(date));
};

// Helper function to add weekday dates for a given month
const addMonthDates = (dates: string[], year: number, month: number): void => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    
    // Only include weekdays (Monday to Friday)
    if (date.getDay() >= 1 && date.getDay() <= 5) {
      dates.push(date.toISOString().split('T')[0]);
    }
  }
};