import React from 'react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--color-background-primary)] text-[var(--color-text-primary)] font-karla p-8">
      {/* Hero Section */}
      <section className="max-w-3xl mx-auto text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">How Do We Help?</h1>
        <p className="text-lg leading-relaxed">
          With expert coaching, insider knowledge, and focused practice, we prepare you to ace your
          med school interviews. Our tailored sessions cover everything from mastering tough
          questions to managing interview nerves, so you’ll walk into every interview with
          confidence. Get ready to stand out and secure your spot in med school!
        </p>
      </section>

      {/* Timeline Section */}
      <section className="relative max-w-5xl mx-auto py-32">
        {/* Dashed horizontal line */}
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t-2 border-dashed border-[var(--color-border-primary)]"></div>
        </div>

        {/* Milestones Container */}
        <div className="relative z-10 flex justify-between items-center">
          {/* Year 12 */}
          <div className="relative flex flex-col items-center text-center px-2">
            <div className="absolute bottom-full mb-3 w-max">
              <span className="font-bold text-red-600">Year 12</span>
            </div>
            <div className="w-4 h-4 bg-red-600 rounded-full" />
          </div>

          {/* Sit UCAT (Summer Y12) */}
          <div className="relative flex flex-col items-center text-center px-2">
            <div className="absolute bottom-full mb-3 w-max">
              <span className="text-md text-[var(--color-text-accent)] font-semibold">
                Summer Y12<br />Sit UCAT
              </span>
            </div>
            <div className="w-3 h-3 bg-[var(--color-accent-secondary)] rounded-full" />
          </div>

          {/* Year 13 */}
          <div className="relative flex flex-col items-center text-center px-2">
            <div className="absolute bottom-full mb-3 w-max">
              <span className="font-bold text-red-600">Year 13</span>
            </div>
            <div className="w-4 h-4 bg-red-600 rounded-full" />
          </div>

          {/* Sit Interviews (Nov–Mar Y13) - NGMP Helps Here! */}
          <div className="relative flex flex-col items-center text-center px-2">
            <div className="absolute bottom-full mb-3 w-auto min-w-[200px] max-w-xs">
              <div className="p-3 bg-[var(--color-background-secondary)] rounded-lg shadow-xl border border-[var(--color-border-secondary)]">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                  November–March Y13<br />Sit Interviews
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  This is a crucial stage where <strong className="text-[var(--color-accent-primary)]">NGMP's expert coaching</strong> makes all the difference. We prepare you to ace your interviews!
                </p>
              </div>
            </div>
            <div className="w-5 h-5 bg-[var(--color-accent-primary)] rounded-full border-2 border-[var(--color-background-primary)] ring-2 ring-[var(--color-accent-primary)]" />
          </div>

          {/* Sit A-Levels (May–June Y13) */}
          <div className="relative flex flex-col items-center text-center px-2">
            <div className="absolute bottom-full mb-3 w-max">
              <span className="text-md font-semibold text-[var(--color-text-secondary)]">
                May-June Y13<br />Sit A-Levels
              </span>
            </div>
            <div className="w-3 h-3 bg-[var(--color-accent-secondary)] rounded-full" />
          </div>

          {/* Begin Med School */}
          <div className="relative flex flex-col items-center text-center px-2">
            <div className="absolute bottom-full mb-3 w-max">
              <span className="font-bold text-red-600">Begin Med School</span>
            </div>
            <div className="w-4 h-4 bg-red-600 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Mosaic Section */}
      <section className="max-w-6xl mx-auto py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Comprehensive Services</h2>
        <p className="text-lg text-center mb-12 max-w-3xl mx-auto">
          We provide a variety of specialist services to ensure you're fully prepared at every stage
          of your medical school application journey.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mock Interviews Feature */}
          <div className="group bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-6 h-full flex flex-col">
              <div className="mb-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Mock Interviews</h3>
              <p className="text-white/80 mb-4 flex-grow">
                Realistic simulations of medical school interviews with personalized feedback from experienced interviewers.
              </p>
              <div className="mt-auto">
                <span className="inline-flex items-center text-white text-sm font-medium group-hover:underline">
                  Learn more
                  <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* UCAT Conferences */}
          <div className="group bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-6 h-full flex flex-col">
              <div className="mb-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">UCAT Conferences</h3>
              <p className="text-white/80 mb-4 flex-grow">
                Comprehensive workshops covering all UCAT sections with proven strategies and practice questions.
              </p>
              <div className="mt-auto">
                <span className="inline-flex items-center text-white text-sm font-medium group-hover:underline">
                  Learn more
                  <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* One-on-One Prep */}
          <div className="group bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-6 h-full flex flex-col">
              <div className="mb-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">One-on-One Prep</h3>
              <p className="text-white/80 mb-4 flex-grow">
                Personalized coaching sessions tailored to your specific needs, strengths, and areas for improvement.
              </p>
              <div className="mt-auto">
                <span className="inline-flex items-center text-white text-sm font-medium group-hover:underline">
                  Learn more
                  <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Ultimate Medical Application Guides */}
          <div className="group bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-6 h-full flex flex-col">
              <div className="mb-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ultimate Medical Application Guides</h3>
              <p className="text-white/80 mb-4 flex-grow">
                Comprehensive resources covering all aspects of the medical application process, from personal statements to interview preparation.
              </p>
              <div className="mt-auto">
                <span className="inline-flex items-center text-white text-sm font-medium group-hover:underline">
                  Learn more
                  <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Interview MMI Stations */}
          <div className="group bg-gradient-to-br from-red-500 to-rose-600 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-6 h-full flex flex-col">
              <div className="mb-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">MMI Practice Stations</h3>
              <p className="text-white/80 mb-4 flex-grow">
                Focused practice for Multiple Mini Interviews with realistic scenarios and expert guidance on navigating each station.
              </p>
              <div className="mt-auto">
                <span className="inline-flex items-center text-white text-sm font-medium group-hover:underline">
                  Learn more
                  <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Ethics & Medical Scenarios */}
          <div className="group bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-6 h-full flex flex-col">
              <div className="mb-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ethics & Medical Scenarios</h3>
              <p className="text-white/80 mb-4 flex-grow">
                Training in ethical reasoning and handling complex medical scenarios that often appear in interviews and MMIs.
              </p>
              <div className="mt-auto">
                <span className="inline-flex items-center text-white text-sm font-medium group-hover:underline">
                  Learn more
                  <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="max-w-6xl mx-auto py-20 px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
          <p className="text-lg max-w-3xl mx-auto">
            From interview preparation to medical school acceptance, our students excel at every step.
            Here are some of their inspiring journeys.
          </p>
        </div>

        {/* Success Stories Display */}
        <div className="relative">
          {/* Large Quote Mark (Decorative) */}
          <div className="absolute -top-16 left-0 text-[120px] leading-none text-[var(--color-accent-primary)] opacity-10 font-serif">
            "
          </div>
          
          {/* Stories Carousel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Featured Success Story */}
            <div className="bg-[var(--color-background-secondary)] p-8 rounded-2xl shadow-xl border border-[var(--color-border-primary)] relative">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
                <div className="w-16 h-16 rounded-full bg-[var(--color-accent-primary)] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="mb-6 pb-6 border-b border-[var(--color-border-primary)]">
                <blockquote className="text-xl italic font-medium mb-4">
                  "NGMP's mock interviews were almost identical to my actual interviews. The feedback was invaluable and I felt confident walking into each one."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                    A
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-lg">Sriharsha V.</p>
                    <p className="text-[var(--color-text-secondary)]">Accepted to Imperial College London</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="text-[var(--color-accent-primary)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="ml-3">4 Medical School Offers</p>
                </div>
                <div className="flex items-center">
                  <div className="text-[var(--color-accent-primary)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="ml-3">NGMP Mock Interview Score: 9.2/10</p>
                </div>
              </div>
            </div>
            
            {/* Success Stories List */}
            <div className="grid grid-cols-1 gap-6">
              {/* Story 1 */}
              <div className="bg-[var(--color-background-secondary)] p-6 rounded-xl shadow-lg border border-[var(--color-border-primary)] hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">Sarah M.</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">University of Edinburgh</p>
                  </div>
                  <div className="ml-auto">
                    <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      Medicine
                    </div>
                  </div>
                </div>
                <p className="text-sm italic">
                  "The one-on-one prep sessions helped me tackle my interview anxiety. I was calm, confident, and got my first choice!"
                </p>
              </div>

              {/* Story 2 */}
              <div className="bg-[var(--color-background-secondary)] p-6 rounded-xl shadow-lg border border-[var(--color-border-primary)] hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center text-white font-bold">
                    J
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">James T.</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">University of Manchester</p>
                  </div>
                  <div className="ml-auto">
                    <div className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                      Dentistry
                    </div>
                  </div>
                </div>
                <p className="text-sm italic">
                  "NGMP's ultimate guides were a game-changer. They provided me with the tools I needed to excel in my interviews and secure my place at uni."
                </p>
              </div>

              {/* Story 3 */}
              <div className="bg-[var(--color-background-secondary)] p-6 rounded-xl shadow-lg border border-[var(--color-border-primary)] hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold">Mia L.</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">King's College London</p>
                  </div>
                  <div className="ml-auto">
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      Medicine
                    </div>
                  </div>
                </div>
                <p className="text-sm italic">
                  "After struggling with MMI stations, NGMP's targeted practice helped me master the format. Now I'm at my dream university!"
                </p>
              </div>
            </div>
          </div>
          
          {/* Success Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-[var(--color-background-accent)] rounded-xl">
              <div className="text-3xl font-bold text-[var(--color-accent-primary]">94%</div>
              <p className="text-sm mt-2">of our students receive at least one offer</p>
            </div>
            <div className="p-6 bg-[var(--color-background-accent)] rounded-xl">
              <div className="text-3xl font-bold text-[var(--color-accent-primary]">78%</div>
              <p className="text-sm mt-2">get into their first-choice university</p>
            </div>
            <div className="p-6 bg-[var(--color-background-accent)] rounded-xl">
              <div className="text-3xl font-bold text-[var(--color-accent-primary]">350+</div>
              <p className="text-sm mt-2">students coached since 2018</p>
            </div>
            <div className="p-6 bg-[var(--color-background-accent)] rounded-xl">
              <div className="text-3xl font-bold text-[var(--color-accent-primary]">27</div>
              <p className="text-sm mt-2">UK medical schools with our alumni</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}