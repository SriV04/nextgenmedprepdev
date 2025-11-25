"use client";
import React from 'react';
import Link from 'next/link';
import { FireIcon } from '@heroicons/react/24/outline';

export default function BlackFridayHeroSection() {
  return (
    <section className="relative pt-12 pb-20 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-400/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />

      <div className="relative max-w-5xl mx-auto text-center z-10">
        
        {/* Updated Badge for Black Friday */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 border border-slate-200 shadow-sm backdrop-blur-md mb-8">
           <FireIcon className="w-4 h-4 text-red-500" />
           <span className="text-sm font-semibold text-slate-700 tracking-wide">Black Friday Sale Now Live</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
          Master Your Medical <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600">
            School Interviews
          </span>
        </h1>

        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop guessing what the panels want. Build confidence with mock interviews, 
          real-time feedback, and strategies used by top medical students.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link 
            href="#interview-packages" 
            className="relative group px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-1"
          >
            View Deals
            <div className="absolute top-[-10px] right-[-10px] bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">
              SALE
            </div>
          </Link>
          
          <Link 
            href="/interviews/free-resources" 
            className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-300 shadow-sm"
          >
            Free Resources
          </Link>
        </div>

        {/* Stats / Social Proof */}
        <div className="inline-flex flex-col md:flex-row items-center gap-8 md:gap-12 px-8 py-6 bg-white/40 backdrop-blur-lg border border-white/60 rounded-2xl shadow-xl shadow-blue-900/5">
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-900">90%</p>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Offer Rate</p>
          </div>
          <div className="hidden md:block w-px h-10 bg-slate-200/60"></div>
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-900">300+</p>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Students</p>
          </div>
          <div className="hidden md:block w-px h-10 bg-slate-200/60"></div>
          <div className="flex items-center gap-[-10px]">
            <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-700">JD</div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">AS</div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">MK</div>
            </div>
            <span className="ml-4 text-sm font-medium text-slate-600">Joined this week</span>
          </div>
        </div>
      </div>
    </section>
  );
}