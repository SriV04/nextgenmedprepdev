"use client";
import React from 'react';
import Link from 'next/link';
import CalendlyPopup from '../../../components/CalendlyPopup';
import '@/styles/globals.css';

const MMIPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-6xl mb-4 block">🎭</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Master the
              <span className="block text-gradient-primary">Multiple Mini Interview</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Excel in MMI stations with proven strategies, expert guidance, and comprehensive preparation for all medical and dental school applications.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <CalendlyPopup 
              url="https://calendly.com/sri-nextgenmedprep/30min" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              prefill={{
                  name: "Potential Student"
              }}
              utm={{
                utmCampaign: 'mmi-page',
                utmSource: 'website',
                utmMedium: 'hero-button'
              }}
            >
              Book Mock MMI Consultation
            </CalendlyPopup>
            <Link href="#station-types" className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition-all duration-300">
              Learn About Stations
            </Link>
          </div>
        </div>
      </section>

      {/* What is the MMI Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What is the MMI?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Understanding the format that's transforming medical school interviews across the UK.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-gray-700">
              <p className="text-lg leading-relaxed">
                The Multiple Mini Interview (MMI) is the most widely used interview format for medical and dental school applications across the UK. Unlike traditional panel interviews, MMIs assess candidates across a range of attributes and scenarios in a station-based, timed format.
              </p>
              <p className="text-lg leading-relaxed">
                Typically, applicants rotate through <strong>6 to 10 stations</strong>, each lasting <strong>5 to 10 minutes</strong>, with a brief interval between stations. Each station tests a distinct core skill or value — such as communication, ethical reasoning, empathy, teamwork, problem-solving, or motivation for medicine.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-2xl">
                <span className="text-6xl block mb-4">⏱️</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Station-Based Format</h3>
                <p className="text-gray-600">
                  Rotate through multiple stations, each designed to assess specific skills and competencies essential for medical practice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why MMI Prep Matters */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why MMI Preparation Matters</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              MMIs require specific skills and strategies that differ from traditional interviews.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-blue-50 border border-blue-100">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Station-Specific Skills</h3>
              <p className="text-gray-600">Each station type requires different approaches and communication styles</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-green-50 border border-green-100">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Time Management</h3>
              <p className="text-gray-600">Learn to structure responses effectively within tight time constraints</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-purple-50 border border-purple-100">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Structured Thinking</h3>
              <p className="text-gray-600">Master frameworks like SPIKES and the Four Pillars of Medical Ethics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key MMI Station Types Section */}
      <section id="station-types" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key MMI Station Types & Expert Tips</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Master every type of MMI station with proven strategies and frameworks
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Role-Play / Communication Stations */}
            <div className="p-8 rounded-xl border-2 bg-blue-50 border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-4xl">🎭</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Role-Play / Communication Stations</h3>
                  <p className="text-gray-600">Demonstrate empathy, active listening, and clear communication through realistic scenarios.</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  These stations require interaction with an actor or assessor to demonstrate empathy, active listening, and clear communication. Scenarios often include breaking bad news, managing difficult patients, or explaining medical information in lay terms.
                </p>
                <div className="bg-white p-6 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-700 mb-3">Top Tip: Use the SPIKES protocol for sensitive conversations:</h4>
                  <ul className="grid md:grid-cols-2 gap-2 text-gray-600">
                    <li className="flex items-center gap-2"><span className="text-green-500">✓</span>Setting up the interview</li>
                    <li className="flex items-center gap-2"><span className="text-green-500">✓</span>Assessing patient Perception</li>
                    <li className="flex items-center gap-2"><span className="text-green-500">✓</span>Seeking an Invitation to share information</li>
                    <li className="flex items-center gap-2"><span className="text-green-500">✓</span>Delivering Knowledge clearly</li>
                    <li className="flex items-center gap-2"><span className="text-green-500">✓</span>Responding to Emotions empathically</li>
                    <li className="flex items-center gap-2"><span className="text-green-500">✓</span>Summarising and discussing Strategy</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Ethical Scenarios */}
            <div className="p-8 rounded-xl border-2 bg-green-50 border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-4xl">⚖️</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Ethical Scenarios</h3>
                  <p className="text-gray-600">Navigate complex ethical dilemmas using structured frameworks and principled reasoning.</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Candidates discuss or make decisions regarding ethical dilemmas like patient autonomy, confidentiality, or resource allocation.
                </p>
                <div className="bg-white p-6 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-700 mb-3">Top Tip: Structure answers using the Four Pillars of Medical Ethics:</h4>
                  <p className="text-gray-600">Consider <strong>Autonomy</strong>, <strong>Beneficence</strong>, <strong>Non-maleficence</strong>, and <strong>Justice</strong>. Evaluate multiple perspectives before reaching a conclusion.</p>
                </div>
              </div>
            </div>

            {/* Motivation & Insight */}
            <div className="p-8 rounded-xl border-2 bg-purple-50 border-purple-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-4xl">💡</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Motivation & Insight into Medicine</h3>
                  <p className="text-gray-600">Articulate your passion for medicine and understanding of the profession.</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Expect questions like "Why Medicine?" or "What challenges do doctors face today?" These assess your understanding of the career and your commitment.
                </p>
                <div className="bg-white p-6 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-semibold text-purple-700 mb-3">Top Tip:</h4>
                  <p className="text-gray-600">Avoid clichés and focus on specific experiences (e.g., work experience, volunteering). Reflect on what you learned and how it shaped your decision.</p>
                </div>
              </div>
            </div>

            {/* Teamwork & Collaboration */}
            <div className="p-8 rounded-xl border-2 bg-orange-50 border-orange-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-4xl">🤝</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Teamwork & Collaboration</h3>
                  <p className="text-gray-600">Demonstrate leadership, delegation, and effective team communication skills.</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Some MMIs simulate group tasks or ask you to describe times you worked in a team. You might also have to instruct someone to complete a task or reflect on leadership.
                </p>
                <div className="bg-white p-6 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-700 mb-3">Top Tip:</h4>
                  <p className="text-gray-600">Emphasise clarity, patience, and delegation. Use the STAR technique (Situation, Task, Action, Result) to structure personal examples.</p>
                </div>
              </div>
            </div>

            {/* Data Interpretation */}
            <div className="p-8 rounded-xl border-2 bg-indigo-50 border-indigo-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-4xl">📊</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Data Interpretation & Problem Solving</h3>
                  <p className="text-gray-600">Apply analytical thinking to interpret data and solve abstract problems.</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  You may be given a graph, table, or abstract problem and asked to interpret or explain the findings logically.
                </p>
                <div className="bg-white p-6 rounded-lg border-l-4 border-indigo-500">
                  <h4 className="font-semibold text-indigo-700 mb-3">Top Tip:</h4>
                  <p className="text-gray-600">Stay calm and talk through your thinking process. Show structured, analytical reasoning – it's about how you approach the problem, not just getting the right answer.</p>
                </div>
              </div>
            </div>

            {/* Personal Statement Questions */}
            <div className="p-8 rounded-xl border-2 bg-red-50 border-red-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-4xl">📝</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal Statement-Based Questions</h3>
                  <p className="text-gray-600">Elaborate on experiences and reflections from your personal statement.</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  You may be asked to elaborate on something you wrote in your personal statement.
                </p>
                <div className="bg-white p-6 rounded-lg border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-700 mb-3">Top Tip:</h4>
                  <p className="text-gray-600">Know your personal statement inside out and be ready to reflect on key experiences with insight and self-awareness.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get MMI-Ready with Our Mock Interviews & 1-1 Tutoring</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Realistic practice is crucial for MMI success. Our tailored preparation services include:
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included:</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-600">
                    <span className="text-green-500 text-lg">✓</span>
                    Bespoke Mock MMIs with real-time expert feedback
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <span className="text-green-500 text-lg">✓</span>
                    1-to-1 MMI Tutoring personalised to target universities
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <span className="text-green-500 text-lg">✓</span>
                    Station-Specific Coaching (role-play, ethics, data interpretation, and more)
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <span className="text-green-500 text-lg">✓</span>
                    Flexible online or in-person sessions to fit your schedule
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <span className="text-green-500 text-lg">✓</span>
                    Questions generated using our Prometheus question bank
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-xl mb-6">
                  <span className="text-5xl block mb-3">🎯</span>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Success Rate</h4>
                  <p className="text-gray-600 text-sm">Students who practice MMIs are significantly more likely to receive offers</p>
                </div>
                <p className="text-gray-600 mb-6">
                  Whether applying for the first time or reapplying to competitive programmes, expert guidance can boost confidence and performance.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <CalendlyPopup 
              url="https://calendly.com/sri-nextgenmedprep/30min"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-lg"
              prefill={{
                name: "Potential Student"
              }}
              utm={{
                utmCampaign: 'mmi-page-cta',
                utmSource: 'website',
                utmMedium: 'cta-section'
              }}
            >
              👉 Book your mock MMI session today
            </CalendlyPopup>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Master Your MMI?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of successful applicants who prepared with NextGenMedPrep
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300">
              Start Your MMI Preparation
            </Link>
            <Link href="/interviews" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
              View All Interview Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MMIPage;
