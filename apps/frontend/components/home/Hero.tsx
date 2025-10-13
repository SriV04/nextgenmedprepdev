'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Hero: React.FC = () => {
  const [school, setSchool] = useState<'Med School' | 'Dental School'>('Med School');

  // Rotate text every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSchool(prev => (prev === 'Med School' ? 'Dental School' : 'Med School'));
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen relative min-h-screen flex flex-col items-center justify-between text-white overflow-hidden -mx-4 py-6">
      {/* Animated gradient background */}
       <div className="absolute inset-0 bg-gradient-to-b from-[#050814] via-[#0a0e27] to-[#050814]"></div>

      {/* Mesh grid overlay */}
      <div className="absolute inset-0 bg-[url('/mesh-grid.png')] opacity-10 bg-cover bg-center"></div>

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-6 w-full max-w-7xl mx-auto">
        {/* Trust indicator */}
        <div className="mb-10 flex items-center gap-2 bg-white/95 rounded-full px-5 py-2.5 shadow-2xl border border-yellow-200/50 backdrop-blur-sm z-20">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-sm">⭐</span>
            ))}
          </div>
          <a
            href="https://uk.trustpilot.com/review/nextgenmedprep.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors"
          >
            Trusted by 300+ students
          </a>
        </div>

        {/* 🩺 Main headline */}
        <div className="mb-10 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="block text-white">Your Journey to</span>
            <span
              key={school}
              className="block bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent transition-all duration-700 ease-in-out transform animate-rotate-text"
              style={{
                textShadow: '0 0 40px rgba(96, 165, 250, 0.5)',
                filter: 'drop-shadow(0 0 20px rgba(96, 165, 250, 0.4))'
              }}
            >
              {school}
            </span>
            <span className="block text-white">Starts Here</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 font-normal mt-6 tracking-wide">
            Welcome, Future Doctors.
          </p>
        </div>

        {/* Medical Caduceus Symbol with neon glow */}
        <div className="mb-8 flex justify-center relative">
          {/* Multiple layers of blue glow for neon effect */}
          <div className="absolute inset-0 bg-blue-500/30 rounded-full w-80 h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] blur-3xl animate-pulse"></div>
          <div className="absolute inset-0 bg-cyan-400/20 rounded-full w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 blur-2xl animate-pulse" style={{animationDelay: '0.3s'}}></div>
          <div className="absolute inset-0 bg-blue-400/25 rounded-full w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 blur-xl animate-pulse" style={{animationDelay: '0.6s'}}></div>
          
          {/* Neon caduceus image with glow effects */}
          <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
            <img 
              src="/3d-ngmp-chalice.png" 
              alt="Medical Caduceus Symbol" 
              className="w-full h-full object-contain"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(96, 165, 250, 0.8)) drop-shadow(0 0 40px rgba(96, 165, 250, 0.5)) drop-shadow(0 0 60px rgba(96, 165, 250, 0.3))'
              }}
            />
          </div>
        </div>

        {/* Description */}
        <div className="text-base md:text-lg leading-relaxed max-w-3xl mb-10 text-gray-300 px-4">
          <p className="mb-4">
            Getting into {school.toLowerCase()} can feel impossible — but it doesn't have to be.
          </p>
          <p className="mb-4">
            At <strong className="text-white">NextGen MedPrep</strong>, we guide you through every step of the admissions process.
            From standout personal statements to UCAT and interview mastery, we give you the tools to
            succeed — and the confidence to stand out.
          </p>
        </div>

        {/* 🚀 Call-to-action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Link
            href="/get-started"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            Start Your Journey Today
          </Link>
          <Link
            href="#services-overview"
            className="border-2 border-white/80 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 backdrop-blur-sm"
          >
            Already on your journey?
          </Link>
        </div>

        {/* Final CTA */}
        <p className="text-base font-semibold text-blue-400 tracking-wide">
          Take the first step toward earning your scrubs.
        </p>
      </div>

      {/* ⬇️ Chevron */}
      <div className="relative z-10 pb-8">
        <button
          onClick={() => {
            const timelineSection = document.getElementById('timeline-section');
            if (timelineSection) {
              timelineSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="flex flex-col items-center cursor-pointer hover:opacity-75 transition-opacity duration-300"
          aria-label="Scroll to timeline section"
        >
          <p className="text-sm text-gray-400 mb-2">Scroll to explore</p>
          <svg
            className="w-8 h-8 text-gray-400 animate-bounce"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Hero;
