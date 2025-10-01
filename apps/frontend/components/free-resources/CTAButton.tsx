'use client';

import React from 'react';
import { useResourcePage } from './ResourcePageWrapper';

interface CTAButtonProps {
  children: React.ReactNode;
  className?: string;
}

export default function CTAButton({ children, className = "" }: CTAButtonProps) {
  const { scrollToForm } = useResourcePage();

  return (
    <button
      onClick={scrollToForm}
      className={className}
    >
      {children}
    </button>
  );
}