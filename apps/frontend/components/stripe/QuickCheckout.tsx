'use client'

import { useState } from 'react';
import { createCheckoutAndRedirect, formatCurrency, getCurrencySymbol } from './StripeUtils';

interface QuickCheckoutProps {
  amount: number;
  currency: string;
  description: string;
  productId?: string;
}

/**
 * QuickCheckout Component
 * 
 * Example component showing how to use the Stripe utilities
 * for creating quick checkout buttons
 */
export default function QuickCheckout({ 
  amount, 
  currency, 
  description, 
  productId 
}: QuickCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      await createCheckoutAndRedirect({
        amount,
        currency,
        description,
        product_id: productId,
      });
    } catch (err: any) {
      setError(err.message || 'Checkout failed');
      setLoading(false);
    }
  };

  const handleSubscriptionCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      await createCheckoutAndRedirect(
        {
          amount,
          currency,
          description,
          product_id: productId,
        },
        'subscription',
        {
          every: 1,
          period: 'month'
        }
      );
    } catch (err: any) {
      setError(err.message || 'Subscription checkout failed');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{description}</h3>
      <div className="text-2xl font-bold text-gray-900 mb-4">
        {getCurrencySymbol(currency)}{amount}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleCheckout}
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading ? 'Processing...' : `Buy Now - ${formatCurrency(amount, currency)}`}
        </button>

        <button
          onClick={handleSubscriptionCheckout}
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {loading ? 'Processing...' : `Subscribe - ${formatCurrency(amount, currency)}/month`}
        </button>
      </div>
    </div>
  );
}

/**
 * Example usage of QuickCheckout component:
 * 
 * <QuickCheckout
 *   amount={29.99}
 *   currency="GBP"
 *   description="UCAT Preparation Course"
 *   productId="ucat-course"
 * />
 */