'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type MedicalField = 'medicine' | 'dentistry';

interface FieldCalendarContextType {
  selectedField: MedicalField;
  setSelectedField: (field: MedicalField) => void;
  showBothFields: boolean;
  setShowBothFields: (show: boolean) => void;
}

const FieldCalendarContext = createContext<FieldCalendarContextType | undefined>(undefined);

export const FieldCalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedField, setSelectedField] = useState<MedicalField>('medicine');
  const [showBothFields, setShowBothFields] = useState(false);

  return (
    <FieldCalendarContext.Provider value={{ selectedField, setSelectedField, showBothFields, setShowBothFields }}>
      {children}
    </FieldCalendarContext.Provider>
  );
};

export const useFieldCalendar = () => {
  const context = useContext(FieldCalendarContext);
  if (!context) {
    throw new Error('useFieldCalendar must be used within FieldCalendarProvider');
  }
  return context;
};
