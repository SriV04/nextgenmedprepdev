'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import '@/styles/prometheus.css';
import Starfield from '@/components/prometheus/Starfield';
import GlobeIllustration from '@/components/prometheus/GlobeIllustration';
import dynamic from 'next/dynamic'

const DynamicUkMedicalSchoolsMap = dynamic(
  () => import('../../components/prometheus/UKMedicalSchoolsMap'),
  { ssr: false }
)

export default function PrometheusPage() {
  const [mounted, setMounted] = useState(false);
  
  // Last updated date (rendered as a friendly string)
  const lastUpdated = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Scroll-based animations
  const { scrollY, scrollYProgress } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax transforms
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.8]);
  
  // Smooth spring animations
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Deterministic positions for floating shapes to avoid hydration mismatch
  const floatingShapes = [
    { left: 15, top: 20, size: 4, color: 'indigo', shape: 'circle', duration: 15 },
    { left: 85, top: 80, size: 6, color: 'purple', shape: 'square', duration: 18 },
    { left: 25, top: 70, size: 5, color: 'cyan', shape: 'circle', duration: 20 },
    { left: 70, top: 30, size: 4, color: 'indigo', shape: 'square', duration: 12 },
    { left: 45, top: 85, size: 7, color: 'purple', shape: 'circle', duration: 16 },
    { left: 10, top: 55, size: 5, color: 'cyan', shape: 'square', duration: 14 },
    { left: 90, top: 15, size: 6, color: 'indigo', shape: 'circle', duration: 22 },
    { left: 60, top: 65, size: 4, color: 'purple', shape: 'square', duration: 19 }
  ];

  // Deterministic background elements
  const backgroundElements = [
    { left: 30, top: 25, width: 300, height: 320, color: 'indigo', duration: 25 },
    { left: 75, top: 70, width: 250, height: 280, color: 'purple', duration: 20 },
    { left: 20, top: 60, width: 200, height: 240, color: 'indigo', duration: 30 },
    { left: 80, top: 20, width: 280, height: 300, color: 'purple', duration: 18 },
    { left: 50, top: 40, width: 220, height: 260, color: 'indigo', duration: 22 },
    { left: 10, top: 80, width: 180, height: 200, color: 'purple', duration: 28 }
  ];

  // Deterministic particles
  const particles = Array.from({length: 20}, (_, i) => ({
    left: (i * 5.26) % 100,
    top: (i * 7.83 + 15) % 100,
    delay: i * 0.25,
    duration: 8 + (i % 5)
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main ref={containerRef} className="bg-black text-white overflow-hidden">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 z-50 origin-left"
        style={{ scaleX: smoothProgress }}
      />

      {/* Floating Geometric Shapes - Client Side Only */}
      <AnimatePresence>
        {mounted && (
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {floatingShapes.map((shape, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${shape.left}%`,
                  top: `${shape.top}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: [0, 50, -30, 0],
                  y: [0, -40, 20, 0],
                  rotate: [0, 360],
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: shape.duration,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                <div 
                  className={`w-${shape.size} h-${shape.size} bg-${shape.color}-500/20 
                             ${shape.shape === 'circle' ? 'rounded-full' : 'rotate-45'} blur-sm`} 
                />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section with Globe Animation */}
      <motion.section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{ 
          opacity: heroOpacity,
          scale: heroScale,
        }}
      >
        {/* Enhanced Background Animation Grid */}
        <motion.div 
          className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-20"
          style={{ y: backgroundY }}
        >
          {Array.from({length: 144}).map((_, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
                borderColor: [
                  'rgba(99, 102, 241, 0.4)',
                  'rgba(168, 85, 247, 0.6)',
                  'rgba(6, 182, 212, 0.4)',
                  'rgba(99, 102, 241, 0.4)'
                ]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                repeatType: "mirror", 
                delay: (i * 0.02) % 3,
                ease: "easeInOut"
              }}
              className="border relative overflow-hidden"
              whileHover={{ 
                scale: 1.2, 
                opacity: 0.8,
                transition: { duration: 0.2 }
              }}
            >
              {/* Inner glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-radial from-indigo-500/20 via-transparent to-transparent"
                animate={{
                  opacity: [0, 0.3, 0],
                  scale: [0.5, 1.2, 0.5],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: (i * 0.01) % 2,
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Starfield overlay */}
        <Starfield className="z-[1]" />

        {/* Globe Illustration */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="relative w-[90vw] max-w-4xl aspect-square">
            <GlobeIllustration className="absolute inset-0" />
          </div>
        </motion.div>

        {/* Enhanced Main Hero Content */}
        <motion.div 
          className="relative z-10 text-center max-w-4xl px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.3 }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 2.5,
              type: "spring",
              stiffness: 100
            }}
          >
            <motion.span 
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% 200%'
              }}
            >
              PROMETHEUS
            </motion.span> 
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.8 }}
          >
            Navigate the global hub for medical and dental interview mastery, tailored to where you want to study
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3.1 }}
          >
            <motion.button
              className="relative px-8 py-4 text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md overflow-hidden group"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(99, 102, 241, 0.5)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">EXPLORE THE ATLAS</span>
              <motion.div
                className="absolute inset-0 opacity-0"
                animate={{
                  opacity: [0, 0.1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                  transform: 'translateX(-100%)',
                }}
              />
            </motion.button>
            
            <motion.button
              className="relative px-8 py-4 text-lg font-bold border-2 border-purple-500 text-purple-400 rounded-md hover:bg-purple-500/10 transition-all overflow-hidden group"
              whileHover={{ 
                scale: 1.05,
                borderColor: 'rgba(168, 85, 247, 0.8)',
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-purple-500/5"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">VIEW FEATURES</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scrolling indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg 
            className="w-8 h-8 text-indigo-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.section>

      {/* Enhanced UK Medical Schools Explorer */}
      <section className="relative bg-gradient-to-b from-black via-indigo-950 to-purple-950 py-24 overflow-hidden">
        {/* Animated background elements - Client Side Only */}
        <AnimatePresence>
          {mounted && (
            <div className="absolute inset-0 opacity-10">
              {backgroundElements.map((element, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${element.left}%`,
                    top: `${element.top}%`,
                    width: `${element.width}px`,
                    height: `${element.height}px`,
                    background: `radial-gradient(circle, rgba(${
                      element.color === 'indigo' ? '99, 102, 241' : '168, 85, 247'
                    }, 0.1) 0%, transparent 70%)`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    x: [0, 25, -15, 0],
                    y: [0, -20, 10, 0],
                    scale: [1, 0.9, 1.1, 1],
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    duration: element.duration,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, staggerChildren: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
            >
              <motion.span
                className="inline-block"
                whileHover={{ 
                  scale: 1.05,
                  textShadow: "0 0 20px rgba(99, 102, 241, 0.5)"
                }}
              >
                Discover UK Medical Schools
              </motion.span>
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Tap on a university to reveal bespoke interview insights powered by Prometheus intelligence.
            </motion.p>
          </motion.div>

          <motion.div 
            className="relative bg-black/50 border border-indigo-500/30 rounded-2xl p-8 md:p-12 backdrop-blur-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring", stiffness: 50 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ 
              borderColor: 'rgba(99, 102, 241, 0.6)',
              boxShadow: "0 0 40px rgba(99, 102, 241, 0.2)"
            }}
          >
            {/* Animated border effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'linear-gradient(45deg, transparent, rgba(99, 102, 241, 0.1), transparent)',
              }}
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            <div className="relative z-10">
              <DynamicUkMedicalSchoolsMap />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Statistics Section */}
      <section className="relative bg-gradient-to-b from-purple-950 via-indigo-950 to-black py-20 overflow-hidden">
        {/* Particle effect background - Client Side Only */}
        <AnimatePresence>
          {mounted && (
            <div className="absolute inset-0">
              {particles.map((particle, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-indigo-400/30 rounded-full"
                  style={{
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    x: [0, 80, -40, 0],
                    y: [0, -60, 30, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    delay: particle.delay,
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, staggerChildren: 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Practice Questions */}
            <EnhancedStatCard 
              icon="❓" 
              label="Practice Questions"
              gradient="from-indigo-500 to-purple-500"
              delay={0}
            >
              <CountUp end={3500} duration={1500} />
            </EnhancedStatCard>

            {/* Universities Covered */}
            <EnhancedStatCard 
              icon="🏫" 
              label="Universities Covered"
              gradient="from-purple-500 to-cyan-500"
              delay={0.2}
            >
              <CountUp end={32} duration={1200} />
            </EnhancedStatCard>

            {/* Last Updated (date) */}
            <EnhancedStatCard 
              icon="📅" 
              label="Last Updated"
              gradient="from-cyan-500 to-indigo-500"
              delay={0.4}
            >
              <span className="text-2xl md:text-3xl font-semibold">{lastUpdated}</span>
            </EnhancedStatCard>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black grid-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-aurora">Forge</span> Your Interview Success
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Prometheus Atlas provides comprehensive interview preparation tools designed
              specifically for medical and dental school applicants.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'MMI Questions',
                description: 'Practice with our extensive bank of Multiple Mini Interview scenarios and questions.',
                icon: '👥',
                color: 'from-indigo-500 to-purple-500'
              },
              {
                title: 'Panel Interviews',
                description: 'Prepare for traditional panel interviews with our comprehensive question database.',
                icon: '👨‍⚖️',
                color: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Ethical Scenarios',
                description: 'Navigate complex ethical dilemmas commonly presented in medical interviews.',
                icon: '⚖️',
                color: 'from-pink-500 to-red-500'
              },
              {
                title: 'Personal Statement',
                description: 'Answer questions related to your personal statement with confidence.',
                icon: '📝',
                color: 'from-red-500 to-orange-500'
              },
              {
                title: 'Current Affairs',
                description: 'Stay updated with the latest medical hot topics and healthcare policies.',
                icon: '📰',
                color: 'from-orange-500 to-yellow-500'
              },
              {
                title: 'University-Specific',
                description: 'Targeted preparation for individual university interview styles and formats.',
                icon: '🎓',
                color: 'from-yellow-500 to-green-500'
              }
            ].map((feature, index) => {
              return (
                <motion.div
                  key={index}
                  className="relative group"
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <motion.div
                    className="relative bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-black p-8 rounded-xl border border-indigo-500/30 backdrop-blur-xl overflow-hidden"
                    whileHover={{ 
                      y: -10,
                      rotateX: 5,
                      rotateY: 5,
                      scale: 1.02
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {/* Animated background overlay */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0`}
                      whileHover={{ opacity: 0.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Glowing border effect */}
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      animate={{
                        boxShadow: [
                          `0 0 0 rgba(99, 102, 241, 0)`,
                          `0 0 20px rgba(99, 102, 241, 0.3)`,
                          `0 0 0 rgba(99, 102, 241, 0)`
                        ]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.5
                      }}
                    />
                    
                    <div className="relative z-10">
                      <motion.div 
                        className="text-6xl mb-6 text-indigo-400"
                        whileHover={{ 
                          scale: 1.2, 
                          rotate: [0, -10, 10, 0],
                          filter: "drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))"
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {feature.icon}
                      </motion.div>
                      
                      <motion.h3 
                        className="text-2xl font-bold mb-4 text-white"
                        whileHover={{ 
                          scale: 1.05,
                          textShadow: "0 0 10px rgba(255, 255, 255, 0.5)"
                        }}
                      >
                        {feature.title}
                      </motion.h3>
                      
                      <motion.p 
                        className="text-gray-400 leading-relaxed"
                        initial={{ opacity: 0.7 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {feature.description}
                      </motion.p>
                    </div>

                    {/* Floating particles */}
                    {[
                      { left: 20, top: 15, delay: 0 },
                      { left: 45, top: 35, delay: 0.3 },
                      { left: 70, top: 55, delay: 0.6 },
                      { left: 95, top: 75, delay: 0.9 }
                    ].map((particle, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-indigo-400/40 rounded-full"
                        style={{
                          left: `${particle.left}%`,
                          top: `${particle.top}%`,
                        }}
                        animate={{
                          y: [0, -15, 0],
                          opacity: [0.2, 0.8, 0.2],
                          scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2 + i * 0.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: particle.delay,
                        }}
                      />
                    ))}

                    {/* Hover reveal effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div 
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)`,
                          transform: 'translateX(-100%)',
                        }}
                      />
                    </motion.div>
                  </motion.div>

                  {/* Subtle hover glow around card */}
                  <motion.div
                    className="absolute inset-0 rounded-xl -z-10"
                    initial={{ opacity: 0 }}
                    whileHover={{ 
                      opacity: 1,
                      scale: 1.05,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      background: `radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)`,
                      filter: 'blur(10px)',
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-t from-black via-indigo-950 to-purple-950">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="text-indigo-400">Unlock</span> Your Potential?
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Join thousands of successful medical and dental students who prepared with Prometheus Vault
            </p>
            <motion.div
              className="inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/get-started" className="px-10 py-5 text-xl font-bold bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/30">
                GET STARTED NOW
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Success <span className="text-indigo-400">Stories</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Hear from students who secured their dream places at medical and dental schools
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "The Prometheus Vault was instrumental in my preparation. The range of questions helped me feel confident in my interviews.",
                name: "Sarah J.",
                school: "Oxford Medical School",
                avatar: "👩‍⚕️",
                gradient: "from-indigo-500 to-purple-500"
              },
              {
                quote: "I practiced with the MMI scenarios daily and felt so prepared when similar questions came up in my actual interviews.",
                name: "Michael T.",
                school: "King's College London Dental Institute",
                avatar: "👨‍⚕️",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                quote: "The ethical scenarios were particularly helpful. I received feedback that my answers showed deep critical thinking.",
                name: "Aisha K.",
                school: "University of Edinburgh Medical School",
                avatar: "👩‍🔬",
                gradient: "from-pink-500 to-cyan-500"
              }
            ].map((testimonial, index) => {
              return (
                <motion.div
                  key={index}
                  className="relative group"
                  initial={{ opacity: 0, y: 50, rotateX: -20 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <motion.div
                    className="relative bg-black/80 backdrop-blur-xl p-8 rounded-2xl border border-indigo-500/30 overflow-hidden"
                    whileHover={{ 
                      y: -10,
                      rotateY: 5,
                      scale: 1.02,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {/* Animated background gradient */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0`}
                      whileHover={{ opacity: 0.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Floating quote mark */}
                    <motion.div 
                      className="text-7xl text-indigo-400/20 absolute -top-2 -left-2 z-0"
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.5
                      }}
                    >
                      "
                    </motion.div>
                    
                    <div className="relative z-10">
                      {/* Avatar and quote */}
                      <div className="flex items-start gap-4 mb-6">
                        <motion.div 
                          className="text-3xl p-2 rounded-full bg-indigo-500/20 border border-indigo-400/30"
                          whileHover={{ 
                            scale: 1.1, 
                            rotate: 360,
                            borderColor: 'rgba(99, 102, 241, 0.8)'
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          {testimonial.avatar}
                        </motion.div>
                        
                        <motion.p 
                          className="text-lg text-gray-300 leading-relaxed flex-1 italic"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                        >
                          {testimonial.quote}
                        </motion.p>
                      </div>
                      
                      {/* Author info */}
                      <motion.div 
                        className="border-t border-indigo-500/20 pt-4"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
                      >
                        <div className="font-bold text-indigo-400 text-lg">{testimonial.name}</div>
                        <div className="text-gray-400 text-sm mt-1">{testimonial.school}</div>
                      </motion.div>
                    </div>

                    {/* Particle effects */}
                    {[
                      { left: 10, top: 10, delay: 0 },
                      { left: 30, top: 25, delay: 0.4 },
                      { left: 50, top: 40, delay: 0.8 },
                      { left: 70, top: 55, delay: 1.2 },
                      { left: 90, top: 70, delay: 1.6 }
                    ].map((particle, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-indigo-400/30 rounded-full"
                        style={{
                          left: `${particle.left}%`,
                          top: `${particle.top}%`,
                        }}
                        animate={{
                          y: [0, -10, 0],
                          opacity: [0.3, 0.8, 0.3],
                          scale: [0.5, 1.2, 0.5],
                        }}
                        transition={{
                          duration: 3 + i * 0.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: particle.delay,
                        }}
                      />
                    ))}

                    {/* Hover glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      animate={{
                        boxShadow: [
                          '0 0 0 rgba(99, 102, 241, 0)',
                          '0 0 30px rgba(99, 102, 241, 0.2)',
                          '0 0 0 rgba(99, 102, 241, 0)'
                        ]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>

                  {/* External glow */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl -z-10"
                    initial={{ opacity: 0 }}
                    whileHover={{ 
                      opacity: 0.6,
                      scale: 1.05,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      background: `radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)`,
                      filter: 'blur(15px)',
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-black via-indigo-950 to-purple-950">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked <span className="text-indigo-400">Questions</span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "What is Prometheus Vault?",
                answer: "Prometheus Vault is a comprehensive question bank designed specifically for medical and dental school interview preparation, covering MMIs, panel interviews, ethical scenarios, and more."
              },
              {
                question: "How will it help with my interview preparation?",
                answer: "It provides you with thousands of practice questions, scenario-based exercises, and university-specific preparation materials to build your confidence and improve your interview performance."
              },
              {
                question: "Is it suitable for both medicine and dentistry?",
                answer: "Yes, Prometheus Vault includes specialized content for both medical and dental school applications, with questions tailored to the specific requirements of each field."
              },
              {
                question: "How often is the content updated?",
                answer: "Our content is regularly updated to reflect the latest interview trends, healthcare policies, and ethical considerations relevant to medical and dental education."
              }
            ].map((item, index) => {
              return (
                <motion.div
                  key={index}
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-black/60 p-6 rounded-lg backdrop-blur-sm border border-indigo-500/30">
                    <h3 className="text-xl font-bold mb-3 flex items-center">
                      <span className="text-indigo-400 mr-3">Q:</span>
                      {item.question}
                    </h3>
                    <p className="text-gray-300 pl-7">
                      <span className="text-indigo-400 font-bold">A: </span>
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-black relative overflow-hidden">
        {/* Background grid effect - Static for performance */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-purple animate-pulse" 
               style={{
                 backgroundImage: `
                   linear-gradient(rgba(168, 85, 247, 0.2) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(168, 85, 247, 0.2) 1px, transparent 1px)
                 `,
                 backgroundSize: '60px 60px'
               }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Unlock the <span className="text-indigo-400">Prometheus Vault</span> Today
            </h2>
            <p className="text-xl mb-10 text-gray-300">
              Start your journey to interview success with our comprehensive question bank
            </p>
            <motion.div
              className="inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/get-started" className="px-12 py-6 text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md hover:from-indigo-600 hover:to-purple-600 transition-all shadow-xl shadow-indigo-500/30 inline-flex items-center">
                <span>ACCESS NOW</span>
                <svg 
                  className="w-6 h-6 ml-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

// Small presentational card for stats
function StatCard({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <motion.div
      className="bg-black/40 p-8 rounded-lg backdrop-blur-sm border border-indigo-500/30 text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="text-4xl mb-4 text-indigo-400">{icon}</div>
      <div className="text-5xl font-bold mb-2 leading-none">{children}</div>
      <div className="text-xl text-gray-400">{label}</div>
    </motion.div>
  );
}

// Enhanced stat card with more advanced animations
function EnhancedStatCard({ 
  icon, 
  label, 
  children, 
  gradient,
  delay = 0 
}: { 
  icon: string; 
  label: string; 
  children: React.ReactNode;
  gradient: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="relative group"
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay,
        type: "spring",
        stiffness: 100
      }}
    >
      <motion.div
        className="relative bg-black/60 p-8 rounded-2xl backdrop-blur-xl border border-indigo-500/30 text-center overflow-hidden"
        whileHover={{ 
          scale: 1.05,
          rotateY: 5,
          rotateX: 5,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {/* Animated background gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0`}
          whileHover={{ opacity: 0.1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: [
              '0 0 20px rgba(99, 102, 241, 0)',
              '0 0 40px rgba(99, 102, 241, 0.3)',
              '0 0 20px rgba(99, 102, 241, 0)'
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay * 2
          }}
        />
        
        <div className="relative z-10">
          <motion.div 
            className="text-5xl mb-6 text-indigo-400"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay
            }}
          >
            {icon}
          </motion.div>
          
          <motion.div 
            className="text-5xl md:text-6xl font-bold mb-2 leading-none bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ 
              duration: 0.5, 
              delay: delay + 0.3,
              type: "spring",
              stiffness: 200
            }}
          >
            {children}
          </motion.div>
          
          <motion.div 
            className="text-xl text-gray-400"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: delay + 0.5 }}
          >
            {label}
          </motion.div>
        </div>

        {/* Floating particles inside card */}
        {[
          { left: 20, top: 20, color: 'indigo', delay: 0 },
          { left: 50, top: 40, color: 'purple', delay: 0.5 },
          { left: 80, top: 60, color: 'indigo', delay: 1 }
        ].map((particle, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full bg-${particle.color}-400/50`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

// Animated count-up that starts when visible
function CountUp({ end, duration = 1500, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const startValue = 0;
    const diff = end - startValue;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(startValue + diff * eased));
      if (progress < 1) requestAnimationFrame(step);
    };

    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, duration]);

  const formatted = new Intl.NumberFormat('en-GB').format(value);
  return (
    <span ref={ref} className="tabular-nums">{formatted}{suffix}</span>
  );
}
