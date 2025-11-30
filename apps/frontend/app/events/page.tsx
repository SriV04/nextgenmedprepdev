import React from 'react';
import Link from 'next/link';
import EventsClientWrapper from '../../components/events/EventsClientWrapper';
import { upcomingEvent, previousEvents, conferenceTypes } from '../../data/events';
import '@/styles/globals.css';
import { ArrowRight, Calendar, CheckCircle, CheckCircle2, Clock, Gift, Sparkles, Star, Target, Users, Zap } from 'lucide-react';

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
      <section className="relative py-20 px-4 overflow-hidden bg-slate-900">
        {/* Flashy Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-fuchsia-800"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 right-0 w-80 h-80 bg-pink-500 rounded-full blur-3xl mix-blend-overlay"></div>
            <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-purple-900 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold mb-6 tracking-wide uppercase shadow-lg">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Upcoming Live Masterclass
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-md">
              {upcomingEvent.title}
            </h2>
            <div className="flex flex-wrap justify-center gap-4 text-white/90 font-medium text-lg">
                <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
                    <Calendar className="w-5 h-5 text-yellow-300"/> {upcomingEvent.date}
                </span>
                <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
                    <Clock className="w-5 h-5 text-yellow-300"/> {upcomingEvent.time}
                </span>
            </div>
            <p className="mt-8 text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-light">
              {upcomingEvent.description}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
            {/* Left Column: Content (Span 7) */}
            <div className="lg:col-span-7 space-y-8">
                
                {/* Description Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Star className="w-6 h-6 text-purple-600 fill-purple-600" />
                        What You'll Learn
                    </h3>
                    <p className="text-slate-700 mb-8 text-lg leading-relaxed">
                        {upcomingEvent.details}
                    </p>
                    
                    <h4 className="font-bold text-slate-900 mb-4 text-lg">Key Topics Covered:</h4>
                    <ul className="space-y-4">
                        {upcomingEvent.benefits.map((benefit, index) => (
                        <li key={index} className="flex gap-4">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-1">
                                <CheckCircle className="w-4 h-4 text-purple-700" />
                            </div>
                            <span className="text-slate-800 font-medium">{benefit}</span>
                        </li>
                        ))}
                    </ul>
                </div>

                {/* Expectations Card */}
                <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-slate-700">
                    {/* Abstract bg decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/30 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    
                    <h4 className="font-bold text-xl mb-6 relative z-10 flex items-center gap-2">
                        What to Expect
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4 relative z-10">
                        {upcomingEvent.whatToExpect.map((item, index) => (
                            <div key={index} className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                                <div className="text-purple-400 font-bold text-lg mb-2 group-hover:text-purple-300 transition-colors">0{index + 1}</div>
                                <p className="text-slate-300 text-sm font-medium leading-snug group-hover:text-white transition-colors">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Right Column: Booking (Span 5) */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-8">
                  <div className="bg-white rounded-3xl p-1 shadow-2xl shadow-indigo-900/30">
                    <div className="bg-white rounded-[20px] p-6 sm:p-8 relative overflow-hidden">
                        
                        {/* Offer Banner */}
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5 mb-8 flex items-center gap-4 relative z-10">
                            <div className="h-12 w-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-md transform -rotate-3">
                                <Gift className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-slate-900 font-bold text-lg">Bonus Included</p>
                                <p className="text-slate-600 text-sm font-medium">Get a £10 Voucher for mock interviews</p>
                            </div>
                        </div>

                        {/* Price Tag */}
                        <div className="flex items-end gap-2 mb-2 relative z-10">
                            <span className="text-5xl font-extrabold text-slate-900 tracking-tight">£{upcomingEvent.price}</span>
                            <span className="text-slate-500 font-medium mb-2">/ ticket</span>
                        </div>
                        <p className="text-emerald-600 font-semibold text-sm mb-8 flex items-center gap-1 relative z-10">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Selling fast! Only {upcomingEvent.spots} spots total.
                        </p>

                        {/* Quick Stats */}
                        <div className="space-y-4 mb-8 bg-slate-50 p-5 rounded-xl border border-slate-100 relative z-10">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Date</span>
                                <span className="font-bold text-slate-900">{upcomingEvent.date}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Time</span>
                                <span className="font-bold text-slate-900">{upcomingEvent.time}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Format</span>
                                <span className="font-bold text-slate-900 text-purple-600">Interactive Zoom</span>
                            </div>
                        </div>

                        <a 
                            href={`/event-pay?eventId=${upcomingEvent.id}&event=${encodeURIComponent(upcomingEvent.title)}&date=${upcomingEvent.date}&price=${upcomingEvent.price}`}
                            className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl shadow-slate-900/20 hover:shadow-indigo-600/40 flex items-center justify-center gap-2 group relative z-10 transform hover:-translate-y-1"
                        >
                            Book Your Spot
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <p className="text-center text-slate-400 text-xs mt-4 relative z-10">
                            100% Secure payment via Stripe
                        </p>
                    </div>
                  </div>
              </div>
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
