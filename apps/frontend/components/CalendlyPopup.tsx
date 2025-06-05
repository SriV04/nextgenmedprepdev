"use client";
import React, { useEffect, useState } from 'react';

interface CalendlyPopupProps {
  url: string;
  children?: React.ReactNode;
  className?: string;
  prefill?: {
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    customAnswers?: Record<string, string>;
  };
  utm?: {
    utmCampaign?: string;
    utmSource?: string;
    utmMedium?: string;
    utmContent?: string;
    utmTerm?: string;
  };
}

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: {
        url: string;
        prefill?: object;
        utm?: object;
      }) => void;
    };
  }
}

const CalendlyPopup: React.FC<CalendlyPopupProps> = ({
  url,
  children,
  className = "",
  prefill = {},
  utm = {}
}) => {
  const handleClick = () => {
    console.log('Simple button clicked!');
    console.log('URL:', url);
    
    // For now, just open in a new tab to test
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      type="button"
    >
      {children}
    </button>
  );
};

export default CalendlyPopup;
