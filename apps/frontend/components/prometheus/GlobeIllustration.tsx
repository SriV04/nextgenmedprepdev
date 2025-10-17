'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface GlobeIllustrationProps {
  className?: string;
}

const pulseTransition = {
  duration: 4,
  repeat: Infinity,
  repeatType: 'reverse' as const,
  ease: 'easeInOut',
};

export default function GlobeIllustration({ className }: GlobeIllustrationProps) {
  const containerClassName = ['relative flex items-center justify-center', className]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      className={containerClassName}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{
              opacity: [Math.random() * 0.3 + 0.2, Math.random() * 0.7 + 0.3, Math.random() * 0.3 + 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
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
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={pulseTransition}
      />

      <motion.svg
        viewBox="0 0 512 512"
        className="relative z-10 w-full h-full"
        role="img"
        aria-label="Animated globe"
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

          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Main globe sphere */}
        <circle cx="256" cy="256" r="200" fill="url(#globeGradient)" />

        {/* Latitude lines */}
        {[-60, -40, -20, 0, 20, 40, 60].map((latitude, index) => (
          <motion.path
            key={`lat-${latitude}`}
            d={describeLatitude(256, 256, 200, latitude)}
            stroke="url(#gridGradient)"
            strokeWidth={1.5}
            fill="none"
            mask="url(#sphereMask)"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0.4, 0.7, 0.4] }}
            transition={{ 
              pathLength: { duration: 2, delay: index * 0.1 },
              opacity: { duration: 3, repeat: Infinity, delay: index * 0.2 }
            }}
          />
        ))}

        {/* Longitude lines (meridians) */}
        {[0, 30, 60, 90, 120, 150].map((longitude, index) => (
          <motion.path
            key={`lon-${longitude}`}
            d={describeMeridian(256, 256, 200, longitude)}
            stroke="url(#gridGradient)"
            strokeWidth={1.5}
            fill="none"
            mask="url(#sphereMask)"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0.4, 0.7, 0.4] }}
            transition={{ 
              pathLength: { duration: 2, delay: index * 0.15 },
              opacity: { duration: 3, repeat: Infinity, delay: index * 0.25 }
            }}
          />
        ))}

        {/* Equator highlight */}
        <motion.path
          d={describeLatitude(256, 256, 200, 0)}
          stroke="rgba(6, 182, 212, 0.9)"
          strokeWidth={2}
          fill="none"
          mask="url(#sphereMask)"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, opacity: [0.6, 0.9, 0.6] }}
          transition={{ 
            pathLength: { duration: 2, delay: 0.5 },
            opacity: { duration: 3, repeat: Infinity }
          }}
        />

        {/* Prime meridian highlight */}
        <motion.path
          d={describeMeridian(256, 256, 200, 90)}
          stroke="rgba(6, 182, 212, 0.8)"
          strokeWidth={2}
          fill="none"
          mask="url(#sphereMask)"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, opacity: [0.5, 0.8, 0.5] }}
          transition={{ 
            pathLength: { duration: 2, delay: 0.7 },
            opacity: { duration: 3, repeat: Infinity, delay: 0.5 }
          }}
        />

        {/* Subtle inner glow spots for depth */}
        <motion.circle
          cx="200"
          cy="220"
          r="40"
          fill="rgba(59, 130, 246, 0.3)"
          mask="url(#sphereMask)"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        />
        <motion.circle
          cx="320"
          cy="300"
          r="35"
          fill="rgba(139, 92, 246, 0.3)"
          mask="url(#sphereMask)"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />

        {/* Outer sphere border */}
        <circle 
          cx="256" 
          cy="256" 
          r="200" 
          fill="none" 
          stroke="rgba(6, 182, 212, 0.4)" 
          strokeWidth={2}
          filter="url(#glow)"
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