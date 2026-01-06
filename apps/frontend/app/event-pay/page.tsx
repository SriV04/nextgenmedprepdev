'use client'

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, CalendarIcon, UserGroupIcon, TicketIcon } from '@heroicons/react/24/outline';
import PaymentForm from '../../components/payment/PaymentForm';
import { trackViewContent, trackInitiateCheckout } from '@/components/MetaPixel';

// Separate component for search params logic
function EventPaymentContent() {
  const searchParams = useSearchParams();
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [eventDetails, setEventDetails] = useState({
    id: '',
    name: 'Medical Event Ticket',
    date: '',
    price: 20
  });

  useEffect(() => {
    // Get event details from URL parameters
    const eventId = searchParams.get('eventId') || '';
    const eventName = searchParams.get('event') || 'Medical Event Ticket';
    const eventDate = searchParams.get('date') || '';
    const eventPrice = parseInt(searchParams.get('price') || '15');
    
    setEventDetails({
      id: eventId,
      name: eventName,
      date: eventDate,
      price: eventPrice
    });
    
    // Track ViewContent event for event page view
    trackViewContent(eventName, eventPrice, 'GBP');
  }, [searchParams]);

  const eventPackage = {
    id: 'event_booking',
    name: eventDetails.name,
    price: eventDetails.price * numberOfTickets,
    currency: 'GBP',
    description: `Entry ticket${numberOfTickets > 1 ? 's' : ''} for ${eventDetails.name}. Access to all sessions and materials.`
  };

  const handlePaymentSuccess = (data: any) => {
    // Handle successful payment
    console.log('Payment successful:', data);
    if (data?.checkout_url) {
      // Redirect to Stripe checkout
      window.location.href = data.checkout_url;
    } else {
      // Fallback to success page
      window.location.href = '/payment/success';
    }
  };

  const handlePaymentError = (error: string) => {
    // Handle payment error
    console.error('Payment error:', error);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/events" className="text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{eventDetails.name}</h1>
                <p className="text-gray-600">
                  {eventDetails.date ? formatDate(eventDetails.date) : 'Secure your place at our upcoming event'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Event Overview */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {eventDetails.name}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join us for an informative event designed to help medical students succeed in their education and career journey.
            </p>
          </div>

          {/* Features Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <UserGroupIcon className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Networking</h3>
              <p className="text-gray-600 text-sm">
                Connect with fellow students and medical professionals
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <TicketIcon className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Full Access</h3>
              <p className="text-gray-600 text-sm">
                Entry to conference with 2 admissions experts
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <CalendarIcon className="w-12 h-12 mx-auto text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Speakers</h3>
              <p className="text-gray-600 text-sm">
                Learn from experienced medical students
              </p>
            </div>
          </div>

          {/* Event Details Card */}
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 mb-10">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-900">Event Ticket</h3>
              <div className="text-3xl font-bold text-blue-600">£{eventDetails.price}</div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Secure your place at {eventDetails.name} featuring expert speakers, 
              interactive workshops, and valuable networking opportunities.
            </p>
            
            <div className="border-t border-gray-100 pt-6">
              <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-700">Full event access</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-700">All workshops and sessions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-700">Event materials and resources</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-700">Networking opportunities</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Secure Your Ticket</h3>
            
            {/* Number of tickets selector */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Tickets
              </label>
              <div className="flex items-center gap-4">
                <button 
                  type="button"
                  onClick={() => setNumberOfTickets(Math.max(1, numberOfTickets - 1))}
                  className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-8 text-center">{numberOfTickets}</span>
                <button 
                  type="button"
                  onClick={() => setNumberOfTickets(numberOfTickets + 1)}
                  className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100"
                >
                  +
                </button>
                <span className="text-gray-600 ml-2">
                  (Total: £{eventDetails.price * numberOfTickets})
                </span>
              </div>
            </div>
            
            <PaymentForm
              selectedPackage={eventPackage}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              initialData={{
                metadata: {
                  type: 'event_booking',
                  event_id: eventDetails.id,
                  event_name: eventDetails.name,
                  event_date: eventDetails.date,
                  number_of_tickets: numberOfTickets.toString(),
                  price_per_ticket: eventDetails.price.toString()
                }
              }}
            />
          </div>

          {/* Process Information */}
          <div className="mt-16 bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">1</div>
                <h4 className="font-semibold text-gray-900 mb-2">Purchase Ticket</h4>
                <p className="text-gray-600 text-sm">Complete your payment to secure your place</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">2</div>
                <h4 className="font-semibold text-gray-900 mb-2">Receive Confirmation</h4>
                <p className="text-gray-600 text-sm">Receive confirmation email with you purchase details</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">3</div>
                <h4 className="font-semibold text-gray-900 mb-2">Event Reminders</h4>
                <p className="text-gray-600 text-sm">Receive zoom link to attend the event</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">4</div>
                <h4 className="font-semibold text-gray-900 mb-2">Attend Event</h4>
                <p className="text-gray-600 text-sm">Join us and enjoy all event activities</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function EventPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    }>
      <EventPaymentContent />
    </Suspense>
  );
}
