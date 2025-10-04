'use client'

import { useState } from 'react';

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

export default function PaymentPage() {
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: 0,
    currency: 'GBP',
    description: '',
    customer_email: '',
    return_url: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  // Predefined packages
  const packages = [
    {
      id: 'premium_basic',
      name: 'Premium Basic',
      price: 29.99,
      currency: 'GBP',
      description: 'Access to premium resources and study materials',
      features: [
        'Premium study guides',
        'Practice questions',
        'Email support',
        'Monthly webinars'
      ]
    },
    {
      id: 'premium_plus',
      name: 'Premium Plus',
      price: 49.99,
      currency: 'GBP',
      description: 'Full access to all premium features and 1-on-1 tutoring',
      features: [
        'All Premium Basic features',
        '1-on-1 tutoring sessions',
        'Personal statement review',
        'Interview preparation',
        'Priority support'
      ]
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const selectPackage = (packageItem: typeof packages[0]) => {
    setFormData(prev => ({
      ...prev,
      amount: packageItem.price,
      currency: packageItem.currency,
      description: packageItem.description
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/v1/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          return_url: formData.return_url || `${window.location.origin}/payment/success`
        }),
      });

      const data: PaymentResponse = await response.json();

      if (data.success && data.data?.checkout_url) {
        // Redirect to Fondy checkout page
        window.location.href = data.data.checkout_url;
      } else {
        setError(data.error || 'Payment creation failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600">
            Get access to premium medical preparation resources
          </p>
        </div>

        {/* Package Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                formData.amount === pkg.price && formData.description === pkg.description
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => selectPackage(pkg)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{pkg.name}</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    £{pkg.price}
                  </div>
                  <div className="text-sm text-gray-500">per month</div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{pkg.description}</p>
              <ul className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Payment Details
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="text-red-800">{error}</div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="text-green-800">Payment created successfully!</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    step="0.01"
                    min="0"
                    value={formData.amount || ''}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="GBP">GBP - British Pound</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="customer_email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="return_url" className="block text-sm font-medium text-gray-700 mb-2">
                Return URL (Optional)
              </label>
              <input
                type="url"
                id="return_url"
                name="return_url"
                value={formData.return_url}
                onChange={handleInputChange}
                placeholder="/payment/success"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Secure payments powered by Fondy</p>
            <p className="mt-1">Your payment information is encrypted and secure</p>
          </div>
        </div>
      </div>
    </div>
  );
}