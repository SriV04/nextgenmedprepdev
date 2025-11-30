import React from 'react';
import Link from 'next/link';
import EventsClientWrapper from '../../components/events/EventsClientWrapper';
import { upcomingEvent, previousEvents, conferenceTypes } from '../../data/events';
import '@/styles/globals.css';
import { ArrowRight, Calendar, CheckCircle2, Clock, Gift, Sparkles, Target, Users, Zap } from 'lucide-react';

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
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto z-10">
          
          {/* Header Section */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium text-sm mb-6 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Upcoming Live Event
            </div>
            
            <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-blue-200 mb-6 tracking-tight leading-tight">
              {upcomingEvent.title}
            </h2>
            
            <p className="text-xl text-slate-400 leading-relaxed">
              {upcomingEvent.description}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Content Column */}
            <div className="lg:col-span-7 space-y-8">
              {/* What You'll Learn Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 hover:border-purple-500/30 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <Sparkles className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Master Class Overview</h3>
                </div>
                
                <p className="text-slate-300 mb-8 text-lg leading-relaxed">
                  {upcomingEvent.details}
                </p>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Key Takeaways</h4>
                  <div className="grid gap-4">
                    {upcomingEvent.benefits.map((benefit, index) => (
                      <div key={index} className="flex gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700/50 hover:bg-slate-750 transition-colors">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                        <span className="text-slate-200 font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* What to Expect - Organized Card Layout */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 hover:border-purple-500/30 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-500/10 rounded-xl">
                    <Target className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">What to Expect</h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {upcomingEvent.whatToExpect.map((item, index) => (
                  <div key={index} className="group bg-slate-900/40 border border-slate-700/50 p-5 rounded-2xl hover:bg-slate-800 transition-all duration-300 flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      {index + 1}
                    </span>
                    <span className="text-slate-300 font-medium pt-1 group-hover:text-white transition-colors leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-5 sticky top-8">
            <div className="bg-white rounded-3xl p-1 shadow-2xl shadow-purple-900/20 overflow-hidden relative group">
              {/* Animated Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-600 opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
              
              <div className="bg-white rounded-[20px] p-8 relative z-10 h-full flex flex-col">
                
                {/* Value Badge */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-xl mb-8 shadow-lg transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg leading-none">Free £10 Voucher</p>
                      <p className="text-amber-100 text-sm font-medium mt-1">Included with your ticket</p>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="space-y-6 mb-8 flex-grow">
                  <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                    <div>
                      <p className="text-gray-500 text-sm font-medium mb-1">Ticket Price</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-extrabold text-slate-900">£{upcomingEvent.price}</span>
                        <span className="text-gray-500 font-medium">GBP</span>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-current" />
                      Selling Fast
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-slate-700">
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Saturday, {upcomingEvent.date}</p>
                        <p className="text-sm text-slate-500">Live Interactive Session</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-slate-700">
                       <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{upcomingEvent.time}</p>
                        <p className="text-sm text-slate-500">BST (British Summer Time)</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-slate-700">
                       <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{upcomingEvent.spots} Spots Only</p>
                        <p className="text-sm text-slate-500">Intimate workshop format</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <a 
                  href={`/event-pay?eventId=${upcomingEvent.id}&event=${encodeURIComponent(upcomingEvent.title)}&date=${upcomingEvent.date}&price=${upcomingEvent.price}`}
                  className="group relative w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-xl shadow-slate-900/10 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Book Your Spot
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <p className="text-center text-gray-400 text-xs mt-4 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Secure payment powered by Stripe
                </p>
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
