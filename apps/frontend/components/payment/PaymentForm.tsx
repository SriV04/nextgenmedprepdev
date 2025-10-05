'use client'

import { useState } from 'react';
import { ShieldCheckIcon, CreditCardIcon } from '@heroicons/react/24/outline';

interface PaymentFormData {
  amount: number;
  currency: string;
  description: string;
  customer_email: string;
  return_url?: string;
}

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
  onSuccess?: (data: PaymentResponse['data']) => void;
  onError?: (error: string) => void;
}

export default function PaymentForm({ selectedPackage, onSuccess, onError }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: selectedPackage?.price || 0,
    currency: selectedPackage?.currency || 'GBP',
    description: selectedPackage?.description || '',
    customer_email: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [redirecting, setRedirecting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.customer_email) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (formData.amount <= 0) {
      setError('Please enter a valid amount');
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
          ...formData,
          return_url: formData.return_url || `${window.location.origin}/payment/success`
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PaymentResponse = await response.json();
      console.log('Payment API response:', data);

      if (data.success && data.data?.checkout_url) {
        console.log('Opening checkout URL:', data.data.checkout_url);
        window.open(data.data.checkout_url, '_blank')
        setRedirecting(true);
        
        if (onSuccess) {
          onSuccess(data.data);
        } else {
          // Small delay to show redirecting state, then redirect to Fondy checkout page
          setTimeout(() => {
            window.open(data.data.checkout_url, '_blank');
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
    <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <CreditCardIcon className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Payment Details
        </h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-800 font-medium">Payment Error</div>
          <div className="text-red-700 text-sm mt-1">{error}</div>
        </div>
      )}

      {selectedPackage && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-gray-900">{selectedPackage.name}</div>
              <div className="text-sm text-gray-600">{selectedPackage.description}</div>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              £{selectedPackage.price}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="customer_email"
            name="customer_email"
            value={formData.customer_email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="your@email.com"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            You'll receive payment confirmation and service details at this email
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">£</span>
              <input
                type="number"
                id="amount"
                name="amount"
                step="0.01"
                min="0"
                value={formData.amount || ''}
                onChange={handleInputChange}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
                readOnly={!!selectedPackage}
              />
            </div>
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
              Currency *
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="GBP">GBP - British Pound</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Service Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Brief description of the service you're purchasing"
            required
            readOnly={!!selectedPackage}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <ShieldCheckIcon className="w-5 h-5 text-green-500" />
            <span className="font-medium">Secure Payment</span>
          </div>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Payments processed securely by Fondy</li>
            <li>• Your payment information is encrypted and protected</li>
            <li>• You'll receive confirmation via email once payment is complete</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.customer_email || formData.amount <= 0}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
            loading || !formData.customer_email || formData.amount <= 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Payment...</span>
            </div>
          ) : (
            <>
              <span>Pay £{formData.amount}</span>
              <span className="block text-sm opacity-90 mt-1">Proceed to Secure Checkout</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}