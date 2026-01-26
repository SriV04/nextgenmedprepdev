'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import '@/styles/prometheus.css';
import dynamic from 'next/dynamic'

// Lazy load heavy components
const DynamicStarfield = dynamic(() => import('@/components/prometheus/Starfield'), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 to-transparent" />
});

const DynamicGlobeIllustration = dynamic(() => import('@/components/prometheus/GlobeIllustration'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-radial from-indigo-500/10 to-transparent rounded-full animate-pulse" />
});

const DynamicUkMedicalSchoolsMap = dynamic(
  () => import('../../components/prometheus/UKMedicalSchoolsMap'),
  { ssr: false }
)

export default function PrometheusPage() {
  const prefersReducedMotion = useReducedMotion();
  
  // Last updated date (rendered as a friendly string)
  const lastUpdated = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="bg-black text-white overflow-hidden">
      {/* Hero Section with Globe Animation - Optimized */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Simplified background with CSS animation instead of 64 motion divs */}
        <div className="absolute inset-0 cyber-grid opacity-30" />
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent animate-gradient-shift" />

        {/* Starfield overlay - lazy loaded */}
        <DynamicStarfield className="z-[1]" count={80} />

        {/* Globe Illustration - lazy loaded with optimized size */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="relative w-full max-w-3xl aspect-square">
            <DynamicGlobeIllustration className="absolute inset-0" />
          </div>
        </motion.div>

        {/* Main Hero Content */}
        <motion.div 
          className="relative z-10 text-center max-w-5xl px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6 tracking-tight"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <span className="text-gradient-aurora text-neon">PROMETHEUS</span> 
          </motion.h1>
          <motion.p 
            className="text-xl md:text-3xl mb-10 text-gray-200 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Our <span className="font-bold">NextGen</span> Medical & Dental School Interview <span className="font-bold">Question Bank</span>
          </motion.p>
          <motion.div 
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.a
              href="#schools"
              className="px-10 py-5 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-2xl shadow-indigo-500/50 glow-aurora"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-2">
                VIEW UNIVERSITIES
              </span>
            </motion.a>
            <motion.a
              href="#features"
              className="px-10 py-5 text-lg font-bold border-2 border-purple-400 text-purple-300 rounded-xl hover:bg-purple-500/20 transition-all backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-2">
                WHAT IS PROMETHEUS?
              </span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Simplified scrolling indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-indigo-400"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg 
            className="w-10 h-10" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </section>

      {/* UK Medical Schools Explorer */}
      <section id="schools" className="bg-gradient-to-b from-black via-indigo-950/50 to-black py-24 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 matrix-bg opacity-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gradient-aurora">
              Discover UK Medical Schools
            </h2>
            <p className="text-xl md:text-2xl text-gray-300">
              Tap on a university to reveal bespoke interview insights powered by Prometheus intelligence.
            </p>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-black border border-indigo-500/30 rounded-3xl p-6 md:p-12 backdrop-blur-xl holographic"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <DynamicUkMedicalSchoolsMap />
          </motion.div>
        </div>
      </section>

      {/* Statistics Section - Redesigned with particles */}
      <section className="bg-black py-28 relative overflow-hidden">
        {/* Floating orbs background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient-aurora">By The Numbers</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Practice Questions */}
            <StatCard icon="❓" label="Practice Questions" gradient="from-cyan-500 to-blue-500">
              <CountUp end={3500} duration={1500} prefix="+" />
            </StatCard>

            {/* Universities Covered */}
            <StatCard icon="🏫" label="Universities Covered" gradient="from-purple-500 to-pink-500">
              <CountUp end={32} duration={1200} />
            </StatCard>

            {/* Success Rate */}
            <StatCard icon="⭐" label="Success Rate" gradient="from-amber-500 to-orange-500">
              <CountUp end={94} duration={1300} suffix="%" />
            </StatCard>
          </div>
        </div>
      </section>

      {/* Features Section - Redesigned with 3D cards */}
      <section id="features" className="py-28 bg-gradient-to-b from-black via-purple-950/30 to-black relative overflow-hidden">
        {/* Neural network lines background */}
        <div className="absolute inset-0 neural-lines opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.h2 
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="text-gradient-aurora">Forge</span> Your Interview Success
            </motion.h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
              Prometheus is a cutting-edge, maintained question bank designed to elevate your medical and dental school interview preparation. 
              Prometheus empowers you to build confidence and excel in your interviews.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'MMI Questions',
                description: 'Practice with our extensive bank of Multiple Mini Interview scenarios and questions.',
                icon: '👥',
                color: 'from-blue-500 to-cyan-500'
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
                color: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Personal Statement',
                description: 'Answer questions related to your personal statement with confidence.',
                icon: '📝',
                color: 'from-orange-500 to-red-500'
              },
              {
                title: 'Current Affairs',
                description: 'Stay updated with the latest medical hot topics and healthcare policies.',
                icon: '📰',
                color: 'from-indigo-500 to-purple-500'
              },
              {
                title: 'University-Specific',
                description: 'Targeted preparation for individual university interview styles and formats.',
                icon: '🎓',
                color: 'from-pink-500 to-rose-500'
              }
            ].map((feature, index) => {
              return (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ y: -8 }}
                >
                  {/* Glow effect on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl`} />
                  
                  {/* Card */}
                  <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/50 to-gray-900/90 p-8 rounded-2xl border border-indigo-500/20 group-hover:border-indigo-400/50 transition-all duration-300 h-full backdrop-blur-sm">
                    {/* Icon with gradient background */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl mb-6 text-3xl shadow-lg`}>
                      {feature.icon}
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-indigo-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      

      {/* Testimonials Section - Redesigned */}
      <section className="py-28 bg-black relative overflow-hidden">
        <div className="absolute inset-0 grid-background opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Success <span className="text-gradient-aurora">Stories</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Hear from students who secured their dream places at medical and dental schools
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "The Prometheus Vault was instrumental in my preparation. The range of questions helped me feel confident in my interviews.",
                name: "Sarah J.",
                school: "Oxford Medical School",
                rating: 5
              },
              {
                quote: "I practiced with the MMI scenarios daily and felt so prepared when similar questions came up in my actual interviews.",
                name: "Michael T.",
                school: "King's College London Dental Institute",
                rating: 5
              },
              {
                quote: "The ethical scenarios were particularly helpful. I received feedback that my answers showed deep critical thinking.",
                name: "Aisha K.",
                school: "University of Edinburgh Medical School",
                rating: 5
              }
            ].map((testimonial, index) => {
              return (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                >
                  {/* Gradient glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-2xl" />
                  
                  {/* Card */}
                  <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-indigo-500/30 group-hover:border-indigo-400/50 transition-all duration-300 h-full">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">⭐</span>
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <div className="text-4xl text-indigo-400/30 mb-2">"</div>
                    <p className="text-lg mb-6 text-gray-300 leading-relaxed italic">
                      {testimonial.quote}
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {testimonial.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-white">{testimonial.name}</div>
                        <div className="text-gray-400 text-sm">{testimonial.school}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section - Redesigned with accordion style */}
      <section className="py-28 bg-gradient-to-b from-black via-purple-950/30 to-black relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Frequently Asked <span className="text-gradient-aurora">Questions</span>
            </h2>
            <p className="text-xl text-gray-300">Everything you need to know about Prometheus</p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "What is Prometheus?",
                answer: "Prometheus is a comprehensive question bank designed specifically for medical and dental school interview preparation, covering MMIs, panel interviews, ethical scenarios, and more."
              },
              {
                question: "How will it help with my interview preparation?",
                answer: "It provides you with thousands of practice questions, scenario-based exercises, and university-specific preparation materials to build your confidence and improve your interview performance."
              },
              {
                question: "Is it suitable for both medicine and dentistry?",
                answer: "Yes, Prometheus includes specialised content for both medical and dental school applications, with questions tailored to the specific requirements of each field."
              },
              {
                question: "How often is the content updated?",
                answer: "Our content is regularly updated to reflect the latest interview trends, healthcare policies, and ethical considerations relevant to medical and dental education."
              }
            ].map((item, index) => {
              return (
                <FAQItem key={index} item={item} index={index} />
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA - Ultra flashy */}
      <section className="py-32 bg-black relative overflow-hidden">
        {/* Animated orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-morph" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-morph" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-3xl animate-morph" style={{ animationDelay: '4s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-block mb-8"
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="text-8xl">🔥</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              Unlock the <span className="text-gradient-aurora text-neon">Prometheus Vault</span> Today
            </h2>
            <p className="text-xl md:text-3xl mb-12 text-gray-200 font-light max-w-3xl mx-auto">
              Start your journey to interview success with our comprehensive question bank
            </p>
            
            <div className="flex flex-wrap gap-6 justify-center">
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="#schools" className="group relative px-12 py-6 text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/50 inline-flex items-center gap-4">
                  <span className="relative z-10">ACCESS NOW</span>
                  <svg 
                    className="relative z-10 w-8 h-8 group-hover:translate-x-2 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <a href="#features" className="px-12 py-6 text-2xl font-bold border-2 border-purple-400 text-purple-300 rounded-2xl hover:bg-purple-500/20 transition-all backdrop-blur-sm inline-flex items-center gap-4">
                  <span>LEARN MORE</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

// FAQ Item Component with expand/collapse
function FAQItem({ item, index }: { item: { question: string; answer: string }; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-indigo-500/30 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-indigo-500/10 transition-colors"
      >
        <div className="flex items-start gap-4 flex-1">
          <span className="text-indigo-400 font-bold text-xl mt-1">Q:</span>
          <h3 className="text-xl font-bold text-white flex-1">{item.question}</h3>
        </div>
        <motion.svg
          className="w-6 h-6 text-indigo-400 flex-shrink-0 ml-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      
      <motion.div
        initial={false}
        animate={{ 
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="px-8 pb-6 pl-16">
          <p className="text-gray-300 leading-relaxed">
            <span className="text-purple-400 font-bold">A: </span>
            {item.answer}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Enhanced StatCard component with gradient support
function StatCard({ icon, label, children, gradient }: { icon: string; label: string; children: React.ReactNode; gradient?: string }) {
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      {/* Glow effect */}
      {gradient && (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500 rounded-2xl`} />
      )}
      
      {/* Card */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-10 rounded-2xl backdrop-blur-sm border border-indigo-500/30 group-hover:border-indigo-400/50 transition-all text-center h-full">
        <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">{icon}</div>
        <div className="text-6xl font-bold mb-4 leading-none bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">
          {children}
        </div>
        <div className="text-xl text-gray-400 font-medium">{label}</div>
      </div>
    </motion.div>
  );
}

// Enhanced CountUp that starts when visible with prefix/suffix support
function CountUp({ end, duration = 1500, suffix = '', prefix = '' }: { end: number; duration?: number; suffix?: string; prefix?: string }) {
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
    <span ref={ref} className="tabular-nums">{prefix}{formatted}{suffix}</span>
  );
}