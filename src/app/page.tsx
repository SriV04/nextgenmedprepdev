'use client';

import Hero from '@/components/home/Hero';
import ComprehensiveServices from '@/components/home/ComprehensiveServices'; // Assuming this is the correct import
import SuccessStories from '@/components/home/SuccessStories';
import TimelineSection from '@/components/home/TimelineSection';
import { motion } from 'framer-motion';
import React from 'react';

export default function HomePage() {
  return (
    <main className="bg-[var(--color-background-primary)] text-[var(--color-text-primary)] font-karla scroll-smooth snap-y snap-mandatory">
      {/* Hero Section */}
      <div> {/* No negative margins needed */}
        <Hero />
      </div>

      {/* Timeline Section - Its children (the steps) will be snap points */}
      {/* The TimelineSection component itself doesn't need snap-start, its rendered steps will have it. */}
      <div className="px-4 sm:px-8 md:py-16"> {/* Move padding here instead */}
        <TimelineSection />
      </div>
      

      {/* Services Overview Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className="px-4 sm:px-8 py-16 md:py-24 snap-start flex justify-center items-center"
      >
        <div className="max-w-6xl mx-auto w-full">
          <ComprehensiveServices />
        </div>
      </motion.section>

      {/* Success Stories */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className="px-4 sm:px-8 py-16 md:py-24 snap-start flex justify-center items-center"
      >
        <div className="max-w-6xl mx-auto w-full">
          <SuccessStories stories={[]} />
        </div>
      </motion.section>
    </main>
  );
}