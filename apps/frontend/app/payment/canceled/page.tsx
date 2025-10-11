'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentCanceledPage() {
  const router = useRouter();

  useEffect(() => {
    // Optional: Auto-redirect after a delay
    const timer = setTimeout(() => {
      router.push('/payment');
    }, 10000); // Redirect after 10 seconds

    return () => clearTimeout(timer);
  }, [router]);

  const handleReturnToPayment = () => {
    router.push('/payment');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Canceled Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Canceled
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Your payment was canceled and no charges were made to your card.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  What happened?
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You chose to cancel the payment process or closed the checkout window. 
                    Your payment information was not processed and no charges were made.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleReturnToPayment}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Try Payment Again
            </button>

            <button
              onClick={handleGoHome}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Return to Home
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                Need help? Contact our support team
              </p>
              <div className="flex justify-center space-x-4">
                <a
                  href="mailto:contact@nextgenmedprep.com"
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  Email Support
                </a>
                <span className="text-gray-300">|</span>
                <a
                  href="/free-consultation"
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  Book Consultation
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-400 text-center">
            <p>You will be automatically redirected to the payment page in 10 seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
}