"use client";

import { motion } from "framer-motion";
import React from "react";

type Props = {
  className?: string;
};

export default function VaultIllustration({ className }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      <svg
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Prometheus Vault"
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#848494ff" />
            <stop offset="60%" stopColor="#0b0b0f" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#6366F1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
          </radialGradient>
          <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c7d2fe" />
            <stop offset="35%" stopColor="#94a3b8" />
            <stop offset="70%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="metalDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f2937" />
            <stop offset="50%" stopColor="#111827" />
            <stop offset="100%" stopColor="#1f2937" />
          </linearGradient>
          <radialGradient id="dialGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#6366F1" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="20" floodColor="#3730a3" floodOpacity="0.35" />
            <feDropShadow dx="0" dy="0" stdDeviation="30" floodColor="#7c3aed" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Background */}
        <rect width="1024" height="1024" fill="url(#bgGrad)" />

        {/* Outer subtle glow */}
        <circle cx="512" cy="512" r="420" fill="url(#ringGlow)" opacity="0.45" />

        {/* Vault body */}
        <circle cx="512" cy="512" r="360" fill="url(#metalDark)" stroke="#0f172a" strokeWidth="6" />
        <circle cx="512" cy="512" r="350" fill="url(#metal)" filter="url(#softShadow)" />

        {/* Bevel ring */}
        <circle cx="512" cy="512" r="320" fill="none" stroke="#111827" strokeWidth="10" />
        <circle cx="512" cy="512" r="318" fill="none" stroke="#6366F1" strokeWidth="2" opacity="0.6" />
        <circle cx="512" cy="512" r="316" fill="none" stroke="#8B5CF6" strokeWidth="2" opacity="0.6" />

        {/* Bolts (simplified positions) */}
        <g fill="#111827" stroke="#9ca3af" strokeWidth="2">
          <circle cx="512" cy="212" r="10" />
          <circle cx="682" cy="256" r="10" />
          <circle cx="768" cy="384" r="10" />
          <circle cx="768" cy="640" r="10" />
          <circle cx="682" cy="768" r="10" />
          <circle cx="512" cy="812" r="10" />
          <circle cx="342" cy="768" r="10" />
          <circle cx="256" cy="640" r="10" />
          <circle cx="256" cy="384" r="10" />
          <circle cx="342" cy="256" r="10" />
        </g>

        {/* Inner ring (animated slight turn to simulate unlock) */}
        <motion.g
          initial={{ rotate: -10, originX: 512, originY: 512 }}
          whileInView={{ rotate: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        >
          <circle cx="512" cy="512" r="220" fill="#0b1220" stroke="#334155" strokeWidth="6" />
          <circle cx="512" cy="512" r="210" fill="#0b0f1a" stroke="#6366F1" strokeWidth="2" opacity="0.6" />
        </motion.g>

        {/* Dial base */}
        <circle cx="512" cy="512" r="150" fill="#0b0f1a" stroke="#111827" strokeWidth="4" />
        <circle cx="512" cy="512" r="145" fill="url(#dialGlow)" opacity="0.85" />

        {/* Dial indicators */}
        <g stroke="#94a3b8" strokeWidth="3">
          <line x1="512" y1="372" x2="512" y2="392" />
          <line x1="652" y1="512" x2="632" y2="512" />
          <line x1="512" y1="652" x2="512" y2="632" />
          <line x1="372" y1="512" x2="392" y2="512" />
        </g>

        {/* Dial pointer (animated rotation) */}
        <motion.g
          style={{ transformOrigin: "512px 512px" }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          whileHover={{ scale: 1.05 }}
          filter="url(#softShadow)"
        >
          <circle cx="512" cy="512" r="18" fill="#a78bfa" stroke="#6366f1" strokeWidth="3" />
          <path d="M512 380 L520 520 L504 520 Z" fill="#67e8f9" opacity="0.95" />
        </motion.g>

        {/* Branding text (subtle) */}
        <text
          x="512"
          y="520"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Inter, ui-sans-serif, system-ui"
          fontWeight={800}
          fontSize={90}
          fill="url(#ringGlow)"
          opacity="0.18"
        >
          P
        </text>

        {/* Highlight arcs */}
        <path
          d="M220 512a292 292 0 0 1 156-256"
          stroke="#67E8F9"
          strokeOpacity="0.4"
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M804 512a292 292 0 0 1-156 256"
          stroke="#A78BFA"
          strokeOpacity="0.35"
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}
