'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export default function MetaPixel({ pixelId }: { pixelId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pixelId) return;

    // Track page views on route changes
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [pathname, searchParams, pixelId]);

  return null;
}

// Helper function to track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters);
  }
};

// Helper function to track standard events
export const trackPurchase = (value: number, currency: string = 'GBP', contentName?: string, contentId?: string) => {
  trackEvent('Purchase', {
    value,
    currency,
    content_name: contentName,
    content_type: 'product',
    ...(contentId && { content_ids: [contentId] }),
  });
};

export const trackInitiateCheckout = (value: number, currency: string = 'GBP', contentName?: string) => {
  trackEvent('InitiateCheckout', {
    value,
    currency,
    content_name: contentName,
    content_type: 'product',
  });
};

export const trackViewContent = (contentName: string, value?: number, currency: string = 'GBP') => {
  trackEvent('ViewContent', {
    content_name: contentName,
    content_type: 'product',
    ...(value && { value, currency }),
  });
};

export const trackLead = () => {
  trackEvent('Lead');
};
