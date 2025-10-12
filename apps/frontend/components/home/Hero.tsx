'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Hero: React.FC = () => {
  const [school, setSchool] = useState<'Med School' | 'Dental School'>('Med School');

  // Rotate text every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSchool(prev => (prev === 'Med School' ? 'Dental School' : 'Med School'));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen relative h-screen flex flex-col items-center justify-center text-white overflow-hidden -mx-4">
      {/* ✨ Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 animate-gradient-slow"></div>

      {/* 🌌 Optional particle/stars overlay */}
      <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-30 bg-cover bg-center animate-slow-pan"></div>

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-8">
        {/* ⭐ Trust indicator */}
        <div className="mb-6 flex items-center gap-2 bg-white/90 rounded-full px-4 py-2 shadow-lg border border-gray-100 backdrop-blur-sm">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-xs">⭐</span>
            ))}
          </div>
          <a
            href="https://uk.trustpilot.com/review/nextgenmedprep.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-gray-700 underline hover:text-blue-600 transition-colors"
          >
            Trusted by 500+ students
          </a>
        </div>

        {/* 🩺 Main headline */}
        <div className="mb-6 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Your Journey to
            <br />
            <span
              key={school}
              className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent transition-all duration-700 ease-in-out transform animate-rotate-text"
            >
              {school}
            </span>
            <span className="block">Starts Here</span>
          </h1>

          <p className="text-lg md:text-xl text-blue-200 font-medium mb-3">
            Welcome, Future Doctors.
          </p>
        </div>

        {/* 🧠 Description */}
        <div className="text-base md:text-lg leading-relaxed max-w-3xl mb-8 text-blue-100">
          <p className="mb-4">
            Getting into {school.toLowerCase()} can feel impossible — but it doesn’t have to be.
          </p>
          <p className="mb-4">
            At <strong>NextGen MedPrep</strong>, we guide you through every step of the admissions process.
            From standout personal statements to UCAT and interview mastery, we give you the tools to
            succeed — and the confidence to stand out.
          </p>
        </div>

        {/* 🚀 Call-to-action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Link
            href="/get-started"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Start Your Journey Today
          </Link>
          <Link
            href="#services-overview"
            className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300"
          >
            Already on your journey?
          </Link>
        </div>

        {/* Final CTA */}
        <p className="text-base font-semibold text-yellow-300">
          Take the first step toward earning your scrubs.
        </p>
      </div>

      {/* ⬇️ Chevron */}
      <div className="relative z-10 pb-8">
        <a
          href="#timeline-section"
          className="flex flex-col items-center cursor-pointer hover:opacity-75 transition-opacity duration-300"
          aria-label="Scroll to timeline section"
        >
          <p className="text-sm text-white opacity-75 mb-2">Scroll to explore</p>
          <svg
            className="w-8 h-8 text-white animate-bounce"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default Hero;
