'use client';

import Hero from '@/components/home/Hero';
import ComprehensiveServices from '@/components/home/ComprehensiveServices'; // Assuming this is the correct import
import SuccessStories from '@/components/home/SuccessStories';
import TimelineSection from '@/components/home/TimelineSection';
import { motion } from 'framer-motion';
import React from 'react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--color-background-primary)] text-[var(--color-text-primary)] font-karla p-4 sm:p-8 scroll-smooth snap-y snap-mandatory">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-3xl mx-auto text-center py-16 md:py-24 snap-start" // Added snap-start & responsive padding
      >
        <Hero />
      </motion.section>

      {/* Timeline Section - Its children (the steps) will be snap points */}
      {/* The TimelineSection component itself doesn't need snap-start, its rendered steps will have it. */}
      <div className="py-12 md:py-16"> {/* Added wrapper div for consistent padding around timeline section if needed */}
        <TimelineSection />
      </div>
      

      {/* Services Overview Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className="py-16 md:py-24 snap-start" // Added snap-start & padding
      >
        <ComprehensiveServices />
      </motion.section>

      {/* Success Stories */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className="py-16 md:py-24 snap-start" // Added snap-start & padding
      >
        <SuccessStories stories={[]} />
      </motion.section>
    </main>
  );
}