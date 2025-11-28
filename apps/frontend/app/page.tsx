import Hero from '@/components/home/Hero';
import ComprehensiveServices from '@/components/home/ComprehensiveServices'; // Assuming this is the correct import
import NewsletterSignup from '@/components/home/NewsletterSignup';
import SuccessStories from '@/components/home/SuccessStories';
import TimelineSection from '@/components/home/TimelineSection';
import React from 'react';
import BlackFridayBanner from '@/components/black-friday/BlackFridayBanner';

export default function HomePage() {
  return (
    <main className="bg-[var(--color-background-primary)] text-[var(--color-text-primary)] font-karla scroll-smooth w-full overflow-x-hidden">
      {/* Hero Section */}

      <div className='snap-start flex justify-center items-center'> {/* No negative margins needed */}
        <Hero />
      </div>

      {/* Timeline Section - Its children (the steps) will be snap points */}
      {/* The TimelineSection component itself doesn't need snap-start, its rendered steps will have it. */}
      <div id="timeline-section" className="px-4 sm:px-8 md:py-16"> 
        <TimelineSection />
      </div>
      

      {/* Services Overview Section */}
      <section id="services-overview" className="snap-start flex justify-center items-center pb-16 md:pb-24 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto w-full">
          <ComprehensiveServices />
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="snap-start flex justify-center items-center">
        <div className="w-full">
          <NewsletterSignup />
        </div>
      </section>

      {/* Success Stories */}
      <section className="px-4 sm:px-8 py-16 md:py-24 snap-start flex justify-center items-center">
        <div className="max-w-6xl mx-auto w-full">
          <SuccessStories stories={[]} />
        </div>
      </section>
    </main>
  );
}