"use client";
import React, { useState, useEffect } from 'react';

export default function ChristmasBanner() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set Christmas deadline (Dec 27, 2025)
    const targetDate = new Date('2025-12-27T23:59:59');

    const calculateTime = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setIsVisible(false);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    // z-40 ensures it sits behind the header (z-100) and mega menu
    // top-[61px] aligns it right below the fixed header
    <div className="sticky top-[60px] sm:top-[64px] z-40 bg-gradient-to-r from-green-900 via-red-800 to-green-900 text-white py-3 px-4 shadow-2xl overflow-hidden relative transition-all duration-300">
      {/* Animated gradient border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-green-500 to-red-400 animate-pulse"></div>
      
      {/* Subtle background pattern - snowflakes */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left relative z-10">
        {/* Left side - Offer info */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-red-600 to-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg animate-pulse">
              🎄 Christmas Sale
            </span>
            <div className="hidden sm:block h-6 w-px bg-gray-600"></div>
          </div>
          <p className="text-sm sm:text-base font-medium">
            <span className="text-yellow-300 font-bold text-lg">Save up to 30%</span>
            <span className="text-gray-200 ml-2">on Mock Interview Packages</span>
          </p>
        </div>

        {/* Right side - Countdown timer */}
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm text-gray-300 font-medium">Offer ends in:</span>
          <div className="flex gap-2">
            <TimeUnit value={timeLeft.days} label="d" />
            <TimeUnit value={timeLeft.hours} label="h" />
            <TimeUnit value={timeLeft.minutes} label="m" />
            <TimeUnit value={timeLeft.seconds} label="s" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center bg-red-700/50 backdrop-blur-sm rounded px-2 py-1 min-w-[40px] border border-green-600/50">
      <span className="text-white font-bold text-lg leading-none tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-gray-200 text-[10px] font-medium uppercase">{label}</span>
    </div>
  );
}
