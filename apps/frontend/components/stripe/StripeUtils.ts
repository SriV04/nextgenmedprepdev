'use client'

/**
 * Stripe Utilities for Client-Side Integration
 * 
 * This file provides utility functions and components for integrating
 * with Stripe on the client side. Currently, the app uses Stripe Checkout
 * (hosted solution), but these utilities can be used if you want to
 * implement custom payment forms using Stripe Elements in the future.
 */

import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
    }
    
    stripePromise = loadStripe(publishableKey);
  }
  
  return stripePromise;
};

/**
 * Redirect to Stripe Checkout
 * This is an alternative way to redirect to checkout programmatically
 */
export const redirectToCheckout = async (sessionId: string) => {
  const stripe = await getStripe();
  
  if (!stripe) {
    throw new Error('Failed to load Stripe');
  }
  
  const { error } = await stripe.redirectToCheckout({
    sessionId: sessionId,
  });
  
  if (error) {
    throw new Error(error.message);
  }
};

/**
 * Format currency amount for display
 */
export const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Validate Stripe publishable key format
 */
export const isValidStripeKey = (key: string) => {
  return key.startsWith('pk_test_') || key.startsWith('pk_live_');
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (currency: string) => {
  const symbols: Record<string, string> = {
    GBP: '£',
    USD: '$',
    EUR: '€',
  };
  
  return symbols[currency.toUpperCase()] || currency.toUpperCase();
};

/**
 * Create a checkout session and redirect
 * This combines the API call and redirect into one function
 */
export const createCheckoutAndRedirect = async (
  paymentData: {
    amount: number;
    currency: string;
    description: string;
    customer_email?: string;
    product_id?: string;
    return_url?: string;
  },
  type: 'payment' | 'subscription' = 'payment',
  recurringData?: {
    every: number;
    period: 'day' | 'week' | 'month' | 'year';
    start_time?: string;
  }
) => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const endpoint = type === 'subscription' ? 'subscription' : 'create';
    
    const requestBody = type === 'subscription' 
      ? { ...paymentData, recurring: recurringData }
      : paymentData;
    
    const response = await fetch(`${apiUrl}/api/v1/payments/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...requestBody,
        return_url: paymentData.return_url || `${window.location.origin}/payment/success`
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data?.checkout_url) {
      // Direct redirect to Stripe Checkout
      window.location.href = data.data.checkout_url;
      return data.data;
    } else {
      throw new Error(data.error || 'Checkout session creation failed');
    }
  } catch (error) {
    console.error('Checkout creation error:', error);
    throw error;
  }
};

export default {
  getStripe,
  redirectToCheckout,
  formatCurrency,
  isValidStripeKey,
  getCurrencySymbol,
  createCheckoutAndRedirect,
};