'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import Link from 'next/link';

// UK Universities data with their locations
const ukUniversities = [
  { 
    name: 'Oxford', 
    fullName: 'University of Oxford Medical School',
    x: 48, 
    y: 52, 
    color: '#1e40af',
    questions: 850,
    specialty: 'Traditional Panel Interviews',
    description: 'Historic institution with rigorous clinical scenarios'
  },
  { 
    name: 'Cambridge', 
    fullName: 'University of Cambridge School of Medicine',
    x: 50, 
    y: 48, 
    color: '#7c3aed',
    questions: 920,
    specialty: 'Problem-Based Learning',
    description: 'Innovative approach to medical education'
  },
  { 
    name: 'Imperial', 
    fullName: 'Imperial College London',
    x: 46, 
    y: 55, 
    color: '#dc2626',
    questions: 780,
    specialty: 'Technical MMIs',
    description: 'Science-focused medical training'
  },
  { 
    name: 'UCL', 
    fullName: 'University College London',
    x: 46.5, 
    y: 54.5, 
    color: '#059669',
    questions: 650,
    specialty: 'Ethical Scenarios',
    description: 'Progressive medical curriculum'
  },
  { 
    name: 'Edinburgh', 
    fullName: 'University of Edinburgh Medical School',
    x: 45, 
    y: 35, 
    color: '#c2410c',
    questions: 720,
    specialty: 'Research-Based Questions',
    description: 'Strong research-oriented program'
  },
  { 
    name: 'King\'s', 
    fullName: 'King\'s College London',
    x: 46.8, 
    y: 55.2, 
    color: '#be185d',
    questions: 680,
    specialty: 'Community Health Focus',
    description: 'Healthcare leadership and innovation'
  },
  { 
    name: 'Manchester', 
    fullName: 'University of Manchester',
    x: 44, 
    y: 46, 
    color: '#9333ea',
    questions: 590,
    specialty: 'Clinical Skills Assessment',
    description: 'Practical healthcare training'
  },
  { 
    name: 'Bristol', 
    fullName: 'University of Bristol Medical School',
    x: 43, 
    y: 52, 
    color: '#0891b2',
    questions: 540,
    specialty: 'Integrated Learning',
    description: 'Holistic medical education approach'
  }
];

export default function PrometheusPage() {
  const [selectedUniversity, setSelectedUniversity] = useState<typeof ukUniversities[0] | null>(null);
  const [isGlobeLoaded, setIsGlobeLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Globe transformations throughout scroll
  const globeScale = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8], [1, 0.6, 0.4, 0.2]);
  const globeX = useTransform(scrollYProgress, [0, 0.3, 0.7], [0, -200, -400]);
  const globeY = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8], [0, -100, -200, -300]);
  const globeRotate = useTransform(scrollYProgress, [0, 1], [0, 1080]); // More rotation for better effect
  const globeOpacity = useTransform(scrollYProgress, [0, 0.6, 0.9], [1, 0.7, 0]);
  
  // Title transformations
  const titleY = useTransform(scrollYProgress, [0, 0.3], [0, -150]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  // Section reveals
  const universitiesY = useTransform(scrollYProgress, [0.15, 0.4], [100, 0]);
  const featuresY = useTransform(scrollYProgress, [0.4, 0.6], [100, 0]);
  
  // Smooth springs for better animation
  const smoothGlobeScale = useSpring(globeScale, { stiffness: 200, damping: 25 });
  const smoothGlobeX = useSpring(globeX, { stiffness: 200, damping: 25 });
  const smoothGlobeY = useSpring(globeY, { stiffness: 200, damping: 25 });
  const smoothGlobeRotate = useSpring(globeRotate, { stiffness: 100, damping: 20 });

  useEffect(() => {
    setTimeout(() => setIsGlobeLoaded(true), 1000);
  }, []);

  return (
    <div ref={containerRef} className="bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 transform-gpu z-50"
        style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
      />

      {/* Floating Globe - follows scroll */}
      <motion.div 
        ref={globeRef}
        style={{ 
          scale: smoothGlobeScale, 
          x: smoothGlobeX,
          y: smoothGlobeY,
          rotate: smoothGlobeRotate,
          opacity: globeOpacity 
        }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
      >
        <InteractiveGlobe 
          universities={ukUniversities}
          onUniversitySelect={setSelectedUniversity}
          selectedUniversity={selectedUniversity}
          isLoaded={isGlobeLoaded}
        />
      </motion.div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Particles */}
        <div className="absolute inset-0">
          <ParticleField />
        </div>

        {/* Dynamic Background Grid */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{ 
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.3) 1px, transparent 0)',
            backgroundSize: '50px 50px',
            rotate: scrollYProgress
          }}
        />

        {/* Hero Title */}
        <motion.div 
          style={{ y: titleY, opacity: titleOpacity }}
          className="relative z-20 text-center max-w-6xl px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
              <motion.span 
                className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                animate={{ 
                  backgroundImage: [
                    'linear-gradient(45deg, #06b6d4, #8b5cf6, #ec4899)',
                    'linear-gradient(45deg, #8b5cf6, #ec4899, #06b6d4)',
                    'linear-gradient(45deg, #ec4899, #06b6d4, #8b5cf6)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              >
                PROMETHEUS
              </motion.span>
            </h1>
          </motion.div>

          <motion.p 
            className="text-xl md:text-3xl mb-12 text-gray-300 font-light leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            State-of-the-art medical interview question bank
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Powered by AI • Tailored by University
            </span>
          </motion.p>

          <motion.div 
            className="flex flex-wrap gap-6 justify-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <GlowButton href="#explore" primary>
              EXPLORE UNIVERSITIES
            </GlowButton>
            <GlowButton href="#features">
              VIEW FEATURES
            </GlowButton>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* University Details Panel */}
      {selectedUniversity && (
        <UniversityDetailPanel 
          university={selectedUniversity}
          onClose={() => setSelectedUniversity(null)}
        />
      )}

      {/* Universities Grid Section */}
      <section id="explore" className="relative py-24 bg-gradient-to-b from-slate-900 to-purple-900 min-h-screen">
        {/* Parallax Background Elements */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{ 
            y: useTransform(scrollYProgress, [0.2, 0.6], [100, -100]),
            backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
          }}
        />
        
        <motion.div 
          style={{ y: universitiesY }}
          className="container mx-auto px-4 relative z-10"
        >
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              UK Medical Schools
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Question Bank
              </span>
            </h2>
            <motion.div 
              className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ukUniversities.map((university, index) => (
              <UniversityCard 
                key={university.name}
                university={university}
                index={index}
                onClick={() => setSelectedUniversity(university)}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-purple-900 to-slate-900 min-h-screen">
        <motion.div 
          style={{ y: featuresY }}
          className="container mx-auto px-4"
        >
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Advanced Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Cutting-edge technology meets comprehensive medical interview preparation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="🤖"
              title="AI-Powered Questions"
              description="Machine learning algorithms generate realistic interview scenarios based on current medical trends and university preferences."
              delay={0}
            />
            <FeatureCard
              icon="🎯"
              title="University-Specific Prep"
              description="Tailored content for each medical school's unique interview style, format, and evaluation criteria."
              delay={0.2}
            />
            <FeatureCard
              icon="📊"
              title="Performance Analytics"
              description="Detailed insights into your preparation progress with personalized recommendations for improvement."
              delay={0.4}
            />
          </div>
        </motion.div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-purple-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatCounter number={5000} label="Questions" suffix="+" />
            <StatCounter number={32} label="Universities" />
            <StatCounter number={95} label="Success Rate" suffix="%" />
            <StatCounter number={10000} label="Students Helped" suffix="+" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Transform</span> Your Interview Prep?
            </h2>
            <p className="text-xl mb-12 text-gray-300 max-w-2xl mx-auto">
              Join thousands of successful medical students who secured their dream university places with Prometheus.
            </p>
            <GlowButton href="/get-started" primary large>
              START YOUR JOURNEY
            </GlowButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Components
function ParticleField() {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 80 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            background: `radial-gradient(circle, ${
              ['#06b6d4', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 3)]
            }80, transparent)`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            y: [0, -50, 0],
            x: [0, Math.random() * 20 - 10, 0],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

function InteractiveGlobe({ 
  universities, 
  onUniversitySelect, 
  selectedUniversity,
  isLoaded 
}: {
  universities: typeof ukUniversities;
  onUniversitySelect: (uni: typeof ukUniversities[0]) => void;
  selectedUniversity: typeof ukUniversities[0] | null;
  isLoaded: boolean;
}) {
  return (
    <div className="relative w-[80vw] max-w-4xl aspect-square pointer-events-auto">
      {/* Globe Base */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-900/40 via-purple-900/60 to-slate-900/40 backdrop-blur-sm border border-purple-500/30"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: isLoaded ? 1 : 0, rotate: isLoaded ? 0 : -180 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {/* Grid Lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          {/* Latitude lines */}
          {[20, 40, 60, 80].map(y => (
            <motion.ellipse
              key={y}
              cx="50"
              cy="50"
              rx={40 * Math.cos((y - 50) * Math.PI / 100)}
              ry="2"
              fill="none"
              stroke="rgba(139, 92, 246, 0.3)"
              strokeWidth="0.5"
              transform={`translate(0, ${y - 50})`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isLoaded ? 1 : 0 }}
              transition={{ duration: 2, delay: y * 0.1 }}
            />
          ))}
          
          {/* Longitude lines */}
          {[20, 30, 40, 50, 60, 70, 80].map(angle => (
            <motion.ellipse
              key={angle}
              cx="50"
              cy="50"
              rx="40"
              ry="40"
              fill="none"
              stroke="rgba(139, 92, 246, 0.2)"
              strokeWidth="0.5"
              transform={`rotate(${angle * 1.8} 50 50) scale(${Math.sin(angle * Math.PI / 100)}, 1)`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isLoaded ? 1 : 0 }}
              transition={{ duration: 2, delay: angle * 0.05 }}
            />
          ))}
        </svg>

        {/* University Markers */}
        {universities.map((university, index) => (
          <motion.button
            key={university.name}
            className={`absolute w-4 h-4 rounded-full border-2 transition-all duration-300 hover:scale-150 ${
              selectedUniversity?.name === university.name 
                ? 'scale-150 border-white shadow-lg' 
                : 'border-white/60 hover:border-white'
            }`}
            style={{
              left: `${university.x}%`,
              top: `${university.y}%`,
              backgroundColor: university.color,
              boxShadow: `0 0 20px ${university.color}80`,
            }}
            onClick={() => onUniversitySelect(university)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: isLoaded ? index * 0.2 + 1 : 0 }}
            whileHover={{ scale: 1.8 }}
            whileTap={{ scale: 1.2 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: university.color }}
              animate={{ 
                boxShadow: [
                  `0 0 10px ${university.color}60`,
                  `0 0 30px ${university.color}80`,
                  `0 0 10px ${university.color}60`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        ))}
      </motion.div>

      {/* Rotating outer ring */}
      <motion.div
        className="absolute inset-[-20px] rounded-full border border-purple-400/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

function UniversityDetailPanel({ 
  university, 
  onClose 
}: {
  university: typeof ukUniversities[0];
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-slate-800 to-purple-900 p-8 rounded-2xl border border-purple-500/30 max-w-2xl w-full relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <div 
            className="w-4 h-4 rounded-full mb-4"
            style={{ backgroundColor: university.color }}
          />
          <h3 className="text-3xl font-bold mb-2">{university.fullName}</h3>
          <p className="text-gray-300">{university.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-black/30 p-4 rounded-lg">
            <div className="text-2xl font-bold text-cyan-400">{university.questions}</div>
            <div className="text-sm text-gray-300">Practice Questions</div>
          </div>
          <div className="bg-black/30 p-4 rounded-lg">
            <div className="text-sm font-semibold text-purple-400 mb-1">Specialty</div>
            <div className="text-sm text-gray-300">{university.specialty}</div>
          </div>
        </div>

        <GlowButton href="/get-started" primary>
          START PRACTICING
        </GlowButton>
      </motion.div>
    </motion.div>
  );
}

function UniversityCard({ 
  university, 
  index, 
  onClick 
}: {
  university: typeof ukUniversities[0];
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      className="bg-gradient-to-br from-slate-800/50 to-purple-900/50 p-6 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 cursor-pointer backdrop-blur-sm group relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={onClick}
    >
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${university.color}20, transparent 70%)`
        }}
      />
      
      <div className="relative z-10">
        <motion.div 
          className="w-3 h-3 rounded-full mb-4"
          style={{ backgroundColor: university.color }}
          animate={{
            boxShadow: [
              `0 0 10px ${university.color}60`,
              `0 0 20px ${university.color}80`,
              `0 0 10px ${university.color}60`
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">
          {university.name}
        </h3>
        <p className="text-gray-300 text-sm mb-4 group-hover:text-gray-100 transition-colors">
          {university.specialty}
        </p>
        <div className="flex justify-between items-center">
          <motion.span 
            className="text-2xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors"
            whileHover={{ scale: 1.1 }}
          >
            {university.questions}
          </motion.span>
          <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
            Questions
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  delay 
}: {
  icon: string;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      className="bg-gradient-to-br from-slate-800/50 to-purple-900/50 p-8 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 backdrop-blur-sm"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
    >
      <div className="text-5xl mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function StatCounter({ 
  number, 
  label, 
  suffix = '' 
}: {
  number: number;
  label: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const timer = setInterval(() => {
        setCount(prev => {
          const increment = Math.ceil(number / 100);
          return prev + increment >= number ? number : prev + increment;
        });
      }, 30);

      setTimeout(() => clearInterval(timer), 3000);
      return () => clearInterval(timer);
    }
  }, [inView, number]);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-gray-300 text-lg">{label}</div>
    </motion.div>
  );
}

function GlowButton({ 
  children, 
  href, 
  primary = false, 
  large = false 
}: {
  children: React.ReactNode;
  href: string;
  primary?: boolean;
  large?: boolean;
}) {
  const baseClasses = `relative inline-flex items-center justify-center font-bold transition-all duration-300 rounded-lg ${
    large ? 'px-12 py-4 text-xl' : 'px-8 py-3 text-lg'
  }`;
  
  const primaryClasses = primary 
    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-500 hover:to-cyan-500 shadow-lg hover:shadow-purple-500/25' 
    : 'border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 backdrop-blur-sm';

  return (
    <Link href={href}>
      <motion.button
        className={`${baseClasses} ${primaryClasses}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        {primary && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0"
            whileHover={{ opacity: 0.1 }}
            transition={{ duration: 0.3 }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </motion.button>
    </Link>
  );
}