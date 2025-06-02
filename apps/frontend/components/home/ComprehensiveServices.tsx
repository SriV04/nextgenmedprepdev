import React from 'react';

// This is a React Server Component
const ComprehensiveServices = () => {

    return (
        <>
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
        </>
    );
};

export default ComprehensiveServices;