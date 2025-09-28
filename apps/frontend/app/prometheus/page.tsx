'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import '@/styles/prometheus.css';
import Starfield from '@/components/prometheus/Starfield';
import GlobeIllustration from '@/components/prometheus/GlobeIllustration';
import UKMedicalSchoolsMap from '@/components/prometheus/UKMedicalSchoolsMap';
import dynamic from 'next/dynamic'

const DynamicUkMedicalSchoolsMap = dynamic(
  () => import('../../components/prometheus/UKMedicalSchoolsMap'),
  { ssr: false }
)

export default function PrometheusPage() {
  // Last updated date (rendered as a friendly string)
  const lastUpdated = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="bg-black text-white overflow-hidden">
      {/* Hero Section with Globe Animation */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Animation Grid */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-20">
          {Array.from({length: 64}).map((_, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                repeatType: "mirror", 
                delay: i * 0.05 % 2 
              }}
              className="border border-indigo-500/40"
            />
          ))}
        </div>

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

        {/* Main Hero Content */}
        <motion.div 
          className="relative z-10 text-center max-w-4xl px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.3 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-indigo-400">PROMETHEUS</span> ATLAS
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Navigate the global hub for medical and dental interview mastery, tailored to where you want to study
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              className="px-8 py-4 text-lg font-bold bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              EXPLORE THE ATLAS
            </motion.button>
            <motion.button
              className="px-8 py-4 text-lg font-bold border-2 border-purple-500 text-purple-400 rounded-md hover:bg-purple-500/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              VIEW FEATURES
            </motion.button>
          </div>
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
      </section>

      {/* Statistics Section */}
      <section className="bg-gradient-to-b from-black via-indigo-950 to-purple-950 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Practice Questions */}
            <StatCard icon="❓" label="Practice Questions">
              <CountUp end={3500} duration={1500} />
            </StatCard>

            {/* Universities Covered */}
            <StatCard icon="🏫" label="Universities Covered">
              <CountUp end={32} duration={1200} />
            </StatCard>

            {/* Last Updated (date) */}
            <StatCard icon="📅" label="Last Updated">
              <span className="text-2xl md:text-3xl font-semibold">{lastUpdated}</span>
            </StatCard>
          </div>
        </div>
      </section>

      {/* UK Medical Schools Explorer */}
      <section className="bg-gradient-to-b from-black via-indigo-950 to-purple-950 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Discover UK Medical Schools
            </h2>
            <p className="text-lg md:text-xl text-gray-300">
              Tap on a university to reveal bespoke interview insights powered by Prometheus intelligence.
            </p>
          </motion.div>

          <div className="bg-black/50 border border-indigo-500/30 rounded-2xl p-8 md:p-12 backdrop-blur-xl">
            <DynamicUkMedicalSchoolsMap />
          </div>
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
              Prometheus Vault provides comprehensive interview preparation tools designed
              specifically for medical and dental school applicants.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'MMI Questions',
                description: 'Practice with our extensive bank of Multiple Mini Interview scenarios and questions.',
                icon: '👥'
              },
              {
                title: 'Panel Interviews',
                description: 'Prepare for traditional panel interviews with our comprehensive question database.',
                icon: '👨‍⚖️'
              },
              {
                title: 'Ethical Scenarios',
                description: 'Navigate complex ethical dilemmas commonly presented in medical interviews.',
                icon: '⚖️'
              },
              {
                title: 'Personal Statement',
                description: 'Answer questions related to your personal statement with confidence.',
                icon: '📝'
              },
              {
                title: 'Current Affairs',
                description: 'Stay updated with the latest medical hot topics and healthcare policies.',
                icon: '📰'
              },
              {
                title: 'University-Specific',
                description: 'Targeted preparation for individual university interview styles and formats.',
                icon: '🎓'
              }
            ].map((feature, index) => {
              return (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-black p-8 rounded-lg border border-indigo-500/30 hover:border-indigo-400 transition-all group feature-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="text-5xl mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
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
                school: "Oxford Medical School"
              },
              {
                quote: "I practiced with the MMI scenarios daily and felt so prepared when similar questions came up in my actual interviews.",
                name: "Michael T.",
                school: "King's College London Dental Institute"
              },
              {
                quote: "The ethical scenarios were particularly helpful. I received feedback that my answers showed deep critical thinking.",
                name: "Aisha K.",
                school: "University of Edinburgh Medical School"
              }
            ].map((testimonial, index) => {
              return (
                <motion.div
                  key={index}
                  className="bg-black p-8 rounded-lg border border-indigo-500/30 relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="text-6xl text-indigo-400/20 absolute top-4 left-4">"</div>
                  <div className="relative z-10">
                    <p className="text-lg mb-6 text-gray-300">{testimonial.quote}</p>
                    <div>
                      <div className="font-bold text-indigo-400">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm">{testimonial.school}</div>
                    </div>
                  </div>
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
        {/* Background grid effect */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10">
          {Array.from({length: 144}).map((_, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                repeatType: "mirror", 
                delay: i * 0.01 % 3
              }}
              className="border border-purple-500/40"
            />
          ))}
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
