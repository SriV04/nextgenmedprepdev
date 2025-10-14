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
      {/* Outer glow - Neptune atmosphere */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/40 via-cyan-500/30 to-blue-600/40 blur-3xl"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={haloTransition}
      />

      {/* Halo ring - Neptune's atmosphere edge */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.8, 0.5, 0.8],
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
          {/* Neptune's deep blue gradient */}
          <radialGradient id="globeGradient" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#1e40af" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#1e3a8a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0c1844" stopOpacity="0.95" />
          </radialGradient>
          {/* Atmospheric band colors */}
          <linearGradient id="meridianGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.7" />
          </linearGradient>
          {/* Dark spot gradient for Neptune's Great Dark Spot */}
          <radialGradient id="darkSpotGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0c1844" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.4" />
          </radialGradient>
          <mask id="sphereMask">
            <circle cx="256" cy="256" r="230" fill="white" />
          </mask>
        </defs>

        {/* Globe sphere */}
        <circle cx="256" cy="256" r="230" fill="url(#globeGradient)" />

        {/* Subtle latitude lines - reduced */}
        {[ -30, 30 ].map((latitude) => (
          <motion.path
            key={latitude}
            d={describeLatitude(256, 256, 230, latitude)}
            stroke="rgba(56,189,248,0.15)"
            strokeWidth={1.5}
            fill="none"
            mask="url(#sphereMask)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: (latitude + 60) / 60 }}
          />
        ))}

        {/* Neptune's Great Dark Spot */}
        <motion.ellipse
          cx="320"
          cy="200"
          rx="60"
          ry="45"
          fill="url(#darkSpotGradient)"
          mask="url(#sphereMask)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.6, 0.8, 0.6] }}
          transition={haloTransition}
        />

        {/* Smaller atmospheric divot 1 */}
        <motion.ellipse
          cx="180"
          cy="280"
          rx="35"
          ry="25"
          fill="url(#darkSpotGradient)"
          mask="url(#sphereMask)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ ...haloTransition, delay: 0.5 }}
        />

        {/* Smaller atmospheric divot 2 */}
        <motion.ellipse
          cx="350"
          cy="340"
          rx="28"
          ry="20"
          fill="url(#darkSpotGradient)"
          mask="url(#sphereMask)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ ...haloTransition, delay: 1 }}
        />

        {/* Smaller atmospheric divot 3 */}
        <motion.ellipse
          cx="240"
          cy="160"
          rx="30"
          ry="22"
          fill="url(#darkSpotGradient)"
          mask="url(#sphereMask)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.35, 0.55, 0.35] }}
          transition={{ ...haloTransition, delay: 1.5 }}
        />

        {/* Light atmospheric cloud patch 1 */}
        <motion.ellipse
          cx="200"
          cy="220"
          rx="40"
          ry="30"
          fill="rgba(96,165,250,0.2)"
          mask="url(#sphereMask)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ ...haloTransition, delay: 0.8 }}
        />

        {/* Light atmospheric cloud patch 2 */}
        <motion.ellipse
          cx="300"
          cy="300"
          rx="35"
          ry="25"
          fill="rgba(56,189,248,0.25)"
          mask="url(#sphereMask)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.25, 0.45, 0.25] }}
          transition={{ ...haloTransition, delay: 1.2 }}
        />

        {/* Atmospheric clouds/streaks */}
        <motion.path
          d="M140 240c50-15 100-10 145 0 40 8 80 20 120 10"
          stroke="rgba(96,165,250,0.3)"
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
          mask="url(#sphereMask)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 2, delay: 0.8 }}
        />

        {/* Additional atmospheric wisps */}
        <motion.path
          d="M160 340c60-20 120-15 180 5"
          stroke="rgba(56,189,248,0.25)"
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          mask="url(#sphereMask)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.35 }}
          transition={{ duration: 2, delay: 1 }}
        />

        {/* Wispy cloud band */}
        <motion.path
          d="M120 180c80 10 160 5 240 15"
          stroke="rgba(96,165,250,0.2)"
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          mask="url(#sphereMask)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 2, delay: 1.3 }}
        />

        {/* Bright atmospheric highlight */}
        <motion.path
          d="M120 320c40 80 132 140 220 120"
          stroke="rgba(56,189,248,0.5)"
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
