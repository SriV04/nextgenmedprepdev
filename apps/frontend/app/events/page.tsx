import React from 'react';
import Link from 'next/link';
import EventsClientWrapper from '../../components/events/EventsClientWrapper';
import { upcomingEvent, previousEvents, conferenceTypes } from '../../data/events';
import '@/styles/globals.css';

const ConferencesPage = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-6xl mb-4 block">🎓</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Medical School
              <span className="block text-gradient-primary">Conferences</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Interactive workshops designed to accelerate your medical school journey with expert guidance and practical strategies.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Event - Featured Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🎉 Upcoming Event
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {upcomingEvent.title}
            </h2>
            <p className="text-xl text-white/90 mb-2">
              📅 {new Date(upcomingEvent.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} | ⏰ {upcomingEvent.time}
            </p>
            <p className="text-lg text-white/80">
              {upcomingEvent.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Event Details */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">What's Covered</h3>
              <p className="text-gray-600 mb-6 whitespace-pre-line">{upcomingEvent.details}</p>
              
              <h4 className="font-semibold text-gray-900 mb-3">Topics:</h4>
              <ul className="space-y-3 mb-6">
                {upcomingEvent.benefits?.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold text-xl">✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              {upcomingEvent.whatToExpect && upcomingEvent.whatToExpect.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">You'll Gain:</h4>
                  <ul className="space-y-2">
                    {upcomingEvent.whatToExpect.map((item, index) => (
                      <li key={index} className="text-purple-800 text-sm flex items-start gap-2">
                        <span>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Booking Card */}
            <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col">
              <div className="flex-grow">
                {/* £10 Voucher Banner */}
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg p-4 mb-6 text-center shadow-lg transform hover:scale-105 transition-transform">
                  <p className="text-white font-bold text-lg mb-1">
                    🎁 BONUS OFFER 🎁
                  </p>
                  <p className="text-white text-2xl font-extrabold mb-1">
                    £10 Voucher Included!
                  </p>
                  <p className="text-white text-sm font-medium">
                    Towards any mock interview
                  </p>
                </div>

                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-purple-600 mb-2">£{upcomingEvent.price}</div>
                  <p className="text-gray-600">per ticket</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 font-semibold text-center">
                    ⚡︎ Limited Spots Available 🔥
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="font-semibold">Date</p>
                      <p className="text-sm text-gray-600">{new Date(upcomingEvent.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-2xl">⏰</span>
                    <div>
                      <p className="font-semibold">Time</p>
                      <p className="text-sm text-gray-600">{upcomingEvent.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-2xl">👥</span>
                    <div>
                      <p className="font-semibold">Format</p>
                      <p className="text-sm text-gray-600">Interactive Workshop</p>
                    </div>
                  </div>
                </div>
              </div>

              <Link 
                href={`/event-pay?eventId=${upcomingEvent.id}&event=${encodeURIComponent(upcomingEvent.title)}&date=${upcomingEvent.date}&price=${upcomingEvent.price}`}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-1 text-center"
              >
                Book Your Spot Now →
              </Link>

              <p className="text-center text-gray-500 text-sm mt-4">
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Previous Events Section */}
      <section id="previous-events" className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Previous Events
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our past conferences and workshops that have helped hundreds of students succeed in their medical school journey.
            </p>
          </div>

          <EventsClientWrapper 
            events={previousEvents} 
            conferences={conferenceTypes} 
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Master Your Dentistry Interview?</h2>
          <p className="text-xl mb-8 opacity-90">
            Don't miss out on {upcomingEvent.title} - gain the foundational knowledge and confidence you need!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={`/event-pay?eventId=${upcomingEvent.id}&event=${encodeURIComponent(upcomingEvent.title)}&date=${upcomingEvent.date}&price=${upcomingEvent.price}`}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300"
            >
              Book Your Spot Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConferencesPage;
