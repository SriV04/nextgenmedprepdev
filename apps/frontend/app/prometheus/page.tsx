'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import '@/styles/prometheus.css';
import VaultIllustration from '@/components/VaultIllustration';

export default function PrometheusPage() {
  const [count, setCount] = useState<{ questions: number; universities: number; success: number }>({
    questions: 0,
    universities: 0,
    success: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev: { questions: number; universities: number; success: number }) => ({
        questions: prev.questions < 3500 ? prev.questions + 35 : 3500,
        universities: prev.universities < 32 ? prev.universities + 1 : 32,
        success: prev.success < 95 ? prev.success + 1 : 95
      }));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-black text-white overflow-hidden">
      {/* Hero Section with Vault Animation */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Animation Grid */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-20">
          {Array(64).fill(0).map((_, i) => (
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

        {/* Vault Illustration */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="relative w-[90vw] max-w-4xl aspect-square">
            <VaultIllustration className="absolute inset-0" />
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
            <span className="text-indigo-400">PROMETHEUS</span> VAULT
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Unlock the ultimate question bank for medical and dental interview preparation
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              className="px-8 py-4 text-lg font-bold bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              ACCESS THE VAULT
            </motion.button>
            <motion.button
              className="px-8 py-4 text-lg font-bold border-2 border-purple-500 text-purple-400 rounded-md hover:bg-purple-500/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              LEARN MORE
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
            {[
              { value: count.questions, label: 'Practice Questions', icon: '❓' },
              { value: count.universities, label: 'Universities Covered', icon: '🏫' },
              { value: count.success, label: 'Success Rate', suffix: '%', icon: '🎯' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-black/40 p-8 rounded-lg backdrop-blur-sm border border-indigo-500/30"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4 text-indigo-400">{stat.icon}</div>
                <div className="text-5xl font-bold mb-2">
                  {stat.value}{stat.suffix || ''}
                </div>
                <div className="text-xl text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
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
            ].map((feature, index) => (
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
            ))}
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
            ].map((testimonial, index) => (
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
            ))}
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
            ].map((item, index) => (
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
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-black relative overflow-hidden">
        {/* Background grid effect */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10">
          {Array(144).fill(0).map((_, i) => (
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
