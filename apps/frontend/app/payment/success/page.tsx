'use client'

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface PaymentStatus {
  order_id: string;
  status: 'approved' | 'declined' | 'processing' | 'expired' | 'reversed';
  amount: string;
  currency: string;
  payment_system?: string;
  masked_card?: string;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    
    if (orderId) {
      fetchPaymentStatus(orderId);
    } else {
      setError('No order ID provided');
      setLoading(false);
    }
  }, [searchParams]);

  const fetchPaymentStatus = async (orderId: string) => {
    try {
      const response = await fetch(`/api/v1/payments/status/${orderId}`);
      const data = await response.json();

      if (data.success) {
        setPaymentStatus(data.data);
      } else {
        setError(data.error || 'Failed to fetch payment status');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Payment status error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/payment" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  if (!paymentStatus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Payment Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find information about this payment.</p>
          <Link 
            href="/payment" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Make New Payment
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'declined':
        return (
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'processing':
        return (
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          title: 'Payment Successful!',
          message: 'Your payment has been processed successfully.',
          color: 'text-green-800'
        };
      case 'declined':
        return {
          title: 'Payment Declined',
          message: 'Your payment was declined. Please try a different payment method.',
          color: 'text-red-800'
        };
      case 'processing':
        return {
          title: 'Payment Processing',
          message: 'Your payment is being processed. You will receive an email confirmation shortly.',
          color: 'text-yellow-800'
        };
      case 'expired':
        return {
          title: 'Payment Expired',
          message: 'The payment session has expired. Please try again.',
          color: 'text-gray-800'
        };
      case 'reversed':
        return {
          title: 'Payment Reversed',
          message: 'This payment has been reversed/refunded.',
          color: 'text-gray-800'
        };
      default:
        return {
          title: 'Payment Status Unknown',
          message: 'We are unable to determine the payment status at this time.',
          color: 'text-gray-800'
        };
    }
  };

  const statusInfo = getStatusMessage(paymentStatus.status);
  const formatAmount = (amount: string, currency: string) => {
    const numAmount = parseInt(amount) / 100; // Convert from cents
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency
    }).format(numAmount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          {getStatusIcon(paymentStatus.status)}
          
          <h1 className={`text-2xl font-bold mb-2 ${statusInfo.color}`}>
            {statusInfo.title}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {statusInfo.message}
          </p>

          <div className="border-t pt-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-medium">{paymentStatus.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium">{formatAmount(paymentStatus.amount, paymentStatus.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className={`font-medium capitalize ${
                  paymentStatus.status === 'approved' ? 'text-green-600' :
                  paymentStatus.status === 'declined' ? 'text-red-600' :
                  paymentStatus.status === 'processing' ? 'text-yellow-600' :
                  'text-gray-600'
                }`}>
                  {paymentStatus.status}
                </span>
              </div>
              {paymentStatus.payment_system && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method:</span>
                  <span className="font-medium">{paymentStatus.payment_system}</span>
                </div>
              )}
              {paymentStatus.masked_card && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Card:</span>
                  <span className="font-medium">{paymentStatus.masked_card}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {paymentStatus.status === 'approved' && (
              <Link 
                href="/" 
                className="block w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
              >
                Continue to Dashboard
              </Link>
            )}
            
            {(paymentStatus.status === 'declined' || paymentStatus.status === 'expired') && (
              <Link 
                href="/payment" 
                className="block w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </Link>
            )}
            
            <Link 
              href="/" 
              className="block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors"
            >
              Return to Home
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t text-xs text-gray-500">
            <p>If you have any questions about your payment, please contact our support team.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment status...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}