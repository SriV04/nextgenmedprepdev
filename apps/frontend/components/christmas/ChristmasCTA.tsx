import React from 'react';
import Link from 'next/link';
import { SparklesIcon } from 'lucide-react';

export default function ChristmasCTA() {
    return (
        <section className="py-16 px-4 bg-gradient-to-r from-green-900 to-red-800 text-white relative overflow-hidden">
         {/* Sparkle decoration */}
        <div className="absolute top-0 right-0 p-10 opacity-10">
           <SparklesIcon className="w-64 h-64 text-yellow-300" />
        </div>
        
        {/* Christmas tree decoration */}
        <div className="absolute bottom-0 left-0 p-10 opacity-10 text-6xl">
          🎄
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">🎁 Don't Miss These Holiday Deals</h2>
          <p className="text-xl mb-8 opacity-90">
            Slots are filling up fast for Christmas. Secure your tutor today and start the new year prepared.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#interview-packages" className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-600/30">
              Get the Deals
            </Link>
            <a href="mailto:contact@nextgenmedprep.com" className="border-2 border-gray-300 text-gray-200 px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-900 transition-all duration-300">
              Ask Questions
            </a>
          </div>
        </div>
      </section>
    );
}
