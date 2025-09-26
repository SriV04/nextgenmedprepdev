'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface GlobeIllustrationProps {
  className?: string;
}

const haloTransition = {
  duration: 6,
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
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/30 via-blue-500/20 to-purple-500/30 blur-3xl"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={haloTransition}
      />

      {/* Halo ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-indigo-400/40"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.7, 0.4, 0.7],
        }}
        transition={haloTransition}
      />

      <motion.svg
        viewBox="0 0 512 512"
        className="relative z-10 w-full h-full"
        role="img"
        aria-label="Animated globe"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <defs>
          <radialGradient id="globeGradient" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#312e81" stopOpacity="0.9" />
          </radialGradient>
          <linearGradient id="meridianGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8" />
          </linearGradient>
          <mask id="sphereMask">
            <circle cx="256" cy="256" r="230" fill="white" />
          </mask>
        </defs>

        {/* Globe sphere */}
        <circle cx="256" cy="256" r="230" fill="url(#globeGradient)" />

        {/* Latitude lines */}
        {[ -60, -30, 0, 30, 60 ].map((latitude) => (
          <motion.path
            key={latitude}
            d={describeLatitude(256, 256, 230, latitude)}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={2}
            fill="none"
            mask="url(#sphereMask)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: (latitude + 60) / 60 }}
          />
        ))}

        {/* Meridian lines */}
        {[ -90, -60, -30, 0, 30, 60, 90 ].map((longitude) => (
          <motion.path
            key={longitude}
            d={describeMeridian(256, 256, 230, longitude)}
            stroke="url(#meridianGradient)"
            strokeWidth={2}
            fill="none"
            mask="url(#sphereMask)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 1.8, delay: (longitude + 90) / 45 }}
          />
        ))}

        {/* Land masses (stylised) */}
        <motion.path
          d="M208 180c-30 18-60 48-72 80-10 28-4 70 24 88 26 16 60 4 92 0 26-4 56-10 80-4 24 6 66 34 94 18 32-20 18-76-2-104s-54-48-86-56c-44-10-92-4-130-22z"
          fill="rgba(15,23,42,0.55)"
          stroke="rgba(148,163,184,0.5)"
          strokeWidth={2}
          mask="url(#sphereMask)"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 0.55, 0.4] }}
          transition={haloTransition}
        />

        {/* Highlight arc */}
        <motion.path
          d="M120 320c40 80 132 140 220 120"
          stroke="rgba(129,140,248,0.6)"
          strokeWidth={8}
          strokeLinecap="round"
          fill="none"
          mask="url(#sphereMask)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, delay: 0.5, ease: 'easeInOut' }}
        />
      </motion.svg>
    </motion.div>
  );
}

function describeLatitude(cx: number, cy: number, radius: number, latitude: number) {
  const rad = (Math.PI / 180) * latitude;
  const y = cy - radius * Math.sin(rad) * 0.8;
  const horizontalRadius = radius * Math.cos(rad);
  return `M ${cx - horizontalRadius} ${y} A ${horizontalRadius} ${horizontalRadius * 0.35} 0 0 1 ${cx + horizontalRadius} ${y}`;
}

function describeMeridian(cx: number, cy: number, radius: number, longitude: number) {
  const rad = (Math.PI / 180) * longitude;
  const x = cx + radius * Math.sin(rad) * 0.9;
  const verticalRadius = radius * Math.cos(rad);
  return `M ${x} ${cy - verticalRadius} A ${radius * 0.35} ${verticalRadius} 0 0 1 ${x} ${cy + verticalRadius}`;
}
