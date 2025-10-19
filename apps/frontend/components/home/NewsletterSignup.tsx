'use client';

import React, { useState } from 'react';
import { EnvelopeIcon, SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function NewsletterSignup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Create subscription with user information
      const subscriptionResponse = await fetch(`${API_BASE_URL}/api/${API_VERSION}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          subscriptionTier: 'hot-topics',
          source: 'newsletter_signup',
        }),
      });

      // Check if user already exists (409 Conflict) or if subscription was created successfully
      const isExisting = subscriptionResponse.status === 409;

      if (!subscriptionResponse.ok && subscriptionResponse.status !== 409) {
        const errorData = await subscriptionResponse.json();
        throw new Error(errorData.message || 'Failed to subscribe');
      }
      
      setIsSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-20 px-4 sm:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <SparklesIcon className="w-5 h-5 text-white" />
            <span className="text-white font-semibold text-sm">Free Medical Hot Topics</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Stay Ahead with Weekly Medical Insights
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of medical school applicants receiving our curated hot topics, 
            interview tips, and NHS updates directly to your inbox.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl mb-2">📰</div>
            <h3 className="text-white font-semibold mb-1">Weekly Hot Topics</h3>
            <p className="text-white/80 text-sm">Current medical affairs and NHS updates</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl mb-2">💡</div>
            <h3 className="text-white font-semibold mb-1">Interview Tips</h3>
            <p className="text-white/80 text-sm">Expert advice from successful applicants</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="text-white font-semibold mb-1">Exclusive Resources</h3>
            <p className="text-white/80 text-sm">Early access to guides and materials</p>
          </div>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          {isSuccess ? (
            <div className="text-center py-4">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome Aboard! 🎉</h3>
              <p className="text-gray-600">
                Check your email for a confirmation link. Your first hot topics digest is on its way!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    disabled={isSubmitting}
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-200 outline-none transition-all text-gray-900 placeholder-gray-400 ${
                      errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    disabled={isSubmitting}
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-200 outline-none transition-all text-gray-900 placeholder-gray-400 ${
                      errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    disabled={isSubmitting}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-200 outline-none transition-all text-gray-900 placeholder-gray-400 ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 pl-12">{errors.email}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Subscribing...
                    </span>
                  ) : (
                    'Subscribe Free'
                  )}
                </button>
              </div>
            </form>
          )}

          {error && (
            <p className="mt-3 text-red-600 text-sm text-center">{error}</p>
          )}

          {!isSuccess && (
            <p className="mt-4 text-gray-500 text-sm text-center">
              🔒 We respect your privacy. Unsubscribe anytime. No spam, ever.
            </p>
          )}
        </div>

        {/* Social Proof */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-white/90">
            <div className="flex -space-x-2">
              {[1, 5, 18, 8].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span className="text-sm font-medium">
              Join <strong className="text-white">300+</strong> aspiring medical professionals
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
