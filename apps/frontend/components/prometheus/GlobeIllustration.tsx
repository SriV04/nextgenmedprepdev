'use client';

import { motion } from 'framer-motion';
import React, { useMemo } from 'react';

interface GlobeIllustrationProps {
  className?: string;
}

const pulseTransition = {
  duration: 4,
  repeat: Infinity,
  repeatType: 'reverse' as const,
  ease: 'easeInOut',
};

// Generate star positions once
const generateStars = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    opacity: Math.random() * 0.4 + 0.3,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));
};

export default function GlobeIllustration({ className }: GlobeIllustrationProps) {
  const containerClassName = ['relative flex items-center justify-center', className]
    .filter(Boolean)
    .join(' ');

  const stars = useMemo(() => generateStars(20), []); // Reduced from 50 to 20

  return (
    <motion.div
      className={containerClassName}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      {/* Starfield background - optimized with CSS */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              opacity: star.opacity,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '85%',
          height: '85%',
          border: '3px solid rgba(6, 182, 212, 0.6)',
          boxShadow: '0 0 40px rgba(6, 182, 212, 0.4), inset 0 0 40px rgba(6, 182, 212, 0.2)',
          willChange: 'transform, opacity',
        }}
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={pulseTransition}
      />

      {/* Inner glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/30 via-purple-600/20 to-blue-700/30 blur-2xl"
        style={{ willChange: 'opacity' }}
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={pulseTransition}
      />

      <motion.svg
        viewBox="0 0 512 512"
        className="relative z-10 w-full h-full"
        role="img"
        aria-label="Animated globe"
        style={{ willChange: 'transform' }}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <defs>
          {/* Main globe gradient - blue to purple */}
          <radialGradient id="globeGradient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#2563eb" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#1e40af" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.95" />
          </radialGradient>
          
          {/* Grid line gradient - cyan glow */}
          <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
          </linearGradient>

          {/* Sphere mask */}
          <mask id="sphereMask">
            <circle cx="256" cy="256" r="200" fill="white" />
          </mask>
        </defs>

        {/* Main globe sphere */}
        <circle cx="256" cy="256" r="200" fill="url(#globeGradient)" />

        {/* Latitude lines - simplified animation */}
        {[-60, -40, -20, 0, 20, 40, 60].map((latitude, index) => (
          <motion.path
            key={`lat-${latitude}`}
            d={describeLatitude(256, 256, 200, latitude)}
            stroke="url(#gridGradient)"
            strokeWidth={1.5}
            fill="none"
            mask="url(#sphereMask)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ 
              pathLength: { duration: 2, delay: index * 0.1 },
              opacity: { duration: 1, delay: index * 0.1 }
            }}
          />
        ))}

        {/* Longitude lines (meridians) - simplified animation */}
        {[0, 30, 60, 90, 120, 150].map((longitude, index) => (
          <motion.path
            key={`lon-${longitude}`}
            d={describeMeridian(256, 256, 200, longitude)}
            stroke="url(#gridGradient)"
            strokeWidth={1.5}
            fill="none"
            mask="url(#sphereMask)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ 
              pathLength: { duration: 2, delay: index * 0.15 },
              opacity: { duration: 1, delay: index * 0.15 }
            }}
          />
        ))}

        {/* Equator highlight - simplified */}
        <motion.path
          d={describeLatitude(256, 256, 200, 0)}
          stroke="rgba(6, 182, 212, 0.9)"
          strokeWidth={2}
          fill="none"
          mask="url(#sphereMask)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ 
            pathLength: { duration: 2, delay: 0.5 },
            opacity: { duration: 1, delay: 0.5 }
          }}
        />

        {/* Prime meridian highlight - simplified */}
        <motion.path
          d={describeMeridian(256, 256, 200, 90)}
          stroke="rgba(6, 182, 212, 0.8)"
          strokeWidth={2}
          fill="none"
          mask="url(#sphereMask)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ 
            pathLength: { duration: 2, delay: 0.7 },
            opacity: { duration: 1, delay: 0.7 }
          }}
        />

        {/* Subtle inner glow spots for depth - static for performance */}
        <circle
          cx="200"
          cy="220"
          r="40"
          fill="rgba(59, 130, 246, 0.3)"
          mask="url(#sphereMask)"
        />
        <circle
          cx="320"
          cy="300"
          r="35"
          fill="rgba(139, 92, 246, 0.3)"
          mask="url(#sphereMask)"
        />

        {/* Outer sphere border */}
        <circle 
          cx="256" 
          cy="256" 
          r="200" 
          fill="none" 
          stroke="rgba(6, 182, 212, 0.4)" 
          strokeWidth={2}
        />
      </motion.svg>
    </motion.div>
  );
}

function describeLatitude(cx: number, cy: number, radius: number, latitude: number): string {
  const rad = (Math.PI / 180) * latitude;
  const y = cy - radius * Math.sin(rad);
  const horizontalRadius = radius * Math.cos(rad);
  const verticalRadius = horizontalRadius * 0.3; // Ellipse height for 3D effect
  
  return `M ${cx - horizontalRadius} ${y} A ${horizontalRadius} ${verticalRadius} 0 0 1 ${cx + horizontalRadius} ${y}`;
}

function describeMeridian(cx: number, cy: number, radius: number, longitude: number): string {
  const rad = (Math.PI / 180) * longitude;
  const x = cx + radius * Math.sin(rad);
  const horizontalRadius = radius * Math.abs(Math.cos(rad)) * 0.3; // Ellipse width for 3D effect
  
  return `M ${x} ${cy - radius} A ${horizontalRadius} ${radius} 0 0 1 ${x} ${cy + radius}`;
}
