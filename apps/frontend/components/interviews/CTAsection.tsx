import React from 'react';
import Link from 'next/link';
import { SparklesIcon } from '@heroicons/react/24/outline';

export default function CTASection() {
    return (
        <section className="py-16 px-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white relative overflow-hidden">
         {/* Sparkle decoration */}
        <div className="absolute top-0 right-0 p-10 opacity-10">
           <SparklesIcon className="w-64 h-64 text-blue-400" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Interview?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of successful medical students who prepared with our expert tutors and AI-powered mocks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#interview-packages" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-600/30">
              View Packages
            </Link>
            <a href="mailto:contact@nextgenmedprep.com" className="border-2 border-gray-500 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-slate-900 transition-all duration-300">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    );
}
