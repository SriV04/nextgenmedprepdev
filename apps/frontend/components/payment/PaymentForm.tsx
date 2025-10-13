'use client'

import { useState } from 'react';
import { ShieldCheckIcon, CreditCardIcon } from '@heroicons/react/24/outline';

interface PaymentResponse {
  success: boolean;
  data?: {
    checkout_url: string;
    payment_id: string;
    order_id: string;
  };
  error?: string;
}

interface PaymentFormProps {
  selectedPackage?: {
    id: string;
    name: string;
    price: number;
    currency: string;
    description: string;
  };
  initialData?: {
    customer_email?: string;
    customer_name?: string;
    metadata?: {
      [key: string]: string;
    };
  };
  onSuccess?: (data: PaymentResponse['data']) => void;
  onError?: (error: string) => void;
}

export default function PaymentForm({ selectedPackage, initialData, onSuccess, onError }: PaymentFormProps) {
  // Only track user-entered data
  const [customerData, setCustomerData] = useState({
    email: initialData?.customer_email || '',
    name: initialData?.customer_name || '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [redirecting, setRedirecting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!customerData.email) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!selectedPackage || selectedPackage.price <= 0) {
      setError('Invalid package selected');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/v1/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // From selectedPackage
          amount: selectedPackage.price,
          currency: selectedPackage.currency,
          description: selectedPackage.description,
          // From user input
          customer_email: customerData.email,
          customer_name: customerData.name,
          // Config
          return_url: `${window.location.origin}/payment/success`,
          metadata: {
            package_id: selectedPackage.id,
            package_name: selectedPackage.name,
            ...initialData?.metadata
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PaymentResponse = await response.json();
      console.log('Payment API response:', data);

      if (data.success && data.data?.checkout_url) {
        console.log('Redirecting to checkout URL:', data.data.checkout_url);
        setRedirecting(true);
        
        if (onSuccess) {
          onSuccess(data.data);
        } else {
          // Small delay to show redirecting state, then redirect to Stripe checkout page
          setTimeout(() => {
            window.location.href = data.data.checkout_url;
          }, 1000);
        }
      } else {
        const errorMessage = data.error || 'Payment creation failed';
        console.error('Payment creation failed:', errorMessage);
        setError(errorMessage);
        if (onError) onError(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = `Network error: ${err.message || 'Please try again.'}`;
      console.error('Payment error:', err);
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 backdrop-blur-sm dark:backdrop-blur-lg transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-full bg-blue-100 dark:bg-indigo-500/20">
          <CreditCardIcon className="w-6 h-6 text-blue-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Details</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg shadow-sm">
          <div className="text-red-800 dark:text-red-200 font-medium">Payment Error</div>
          <div className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</div>
        </div>
      )}

      {selectedPackage && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-indigo-900/20 border border-blue-200 dark:border-indigo-500/30 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">{selectedPackage.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{selectedPackage.description}</div>
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-indigo-400">£{selectedPackage.price}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <input
              type="email"
              id="customer_email"
              name="email"
              value={customerData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200"
              placeholder="your@email.com"
              required
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 ml-1">
            You'll receive payment confirmation and service details at this email
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Amount
              </label>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                £{selectedPackage.price}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {selectedPackage.currency} - British Pound
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Service Description
              </label>
              <div className="text-gray-900 dark:text-gray-300 font-medium">
                {selectedPackage.description}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border border-blue-100 dark:border-blue-800/30 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-blue-200 mb-3">
            <div className="p-1.5 bg-green-100 dark:bg-green-500/20 rounded-full">
              <ShieldCheckIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="font-medium">Secure Payment</span>
          </div>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 ml-1">
            <li className="flex items-center gap-2">
              <span className="text-green-500 dark:text-green-400 text-xs">✓</span>
              <span>Payments processed securely by Stripe</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500 dark:text-green-400 text-xs">✓</span>
              <span>Your payment information is encrypted and protected</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500 dark:text-green-400 text-xs">✓</span>
              <span>You'll receive confirmation via email once payment is complete</span>
            </li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading || !customerData.email || !selectedPackage || selectedPackage.price <= 0}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
            loading || !customerData.email || !selectedPackage || selectedPackage.price <= 0
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-indigo-600 dark:to-purple-600 text-white hover:from-blue-700 hover:to-indigo-700 dark:hover:from-indigo-700 dark:hover:to-purple-700 shadow-lg hover:shadow-xl shadow-blue-500/20 dark:shadow-indigo-500/20 hover:shadow-blue-500/30 dark:hover:shadow-indigo-500/30 transform hover:-translate-y-1'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Payment...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-2">
                <span>Pay £{selectedPackage.price}</span>
                {/* Add a small credit card icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12.5V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16V15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="block text-sm opacity-90 mt-1">Proceed to Secure Checkout</span>
            </div>
          )}
        </button>
      </form>
    </div>

  );
}