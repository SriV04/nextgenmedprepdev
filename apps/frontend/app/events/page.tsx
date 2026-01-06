import React from 'react';
import Link from 'next/link';
import EventsClientWrapper from '../../components/events/EventsClientWrapper';
import UpcomingEvent from '../../components/events/UpcomingEvent';
import { upcomingEvent, previousEvents, conferenceTypes } from '../../data/events';
import '@/styles/globals.css';
import { Calendar, Clock, Star, CheckCircle, Gift, ArrowRight, Zap, Shield, RefreshCw, Target, Sparkles, Video, Award, ShieldCheck, Lock,  } from 'lucide-react'

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
      <UpcomingEvent event={upcomingEvent} />

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
          <h2 className="text-3xl font-bold mb-4">Ready to Ace Medical Ethics?</h2>
          <p className="text-xl mb-8 opacity-90">
            Don't miss out on All The Ethics You Need for the Med Interview - master ethics and impress your interviewers!
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
