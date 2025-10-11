"use client";
import React from 'react';
import Link from 'next/link';
import '@/styles/globals.css';

const PanelInterviewPage = () => {
  const universities = [
    "Oxford",
    "Cambridge", 
    "Glasgow",
    "Barts",
    "Swansea",
    "Southampton"
  ];

  const comparisonData = [
    {
      aspect: "Format",
      panel: "1 long interview (20–40 mins)",
      mmi: "Series of short stations (5–10 mins each)"
    },
    {
      aspect: "Interviewers",
      panel: "Same interviewers throughout",
      mmi: "New interviewer each station"
    },
    {
      aspect: "Depth",
      panel: "Allows for deeper follow-up",
      mmi: "Tests a wide range quickly"
    },
    {
      aspect: "Style",
      panel: "Conversation-style and rapport building",
      mmi: "Task/response focused"
    }
  ];

  const commonQuestions = [
    "Why do you want to study medicine?",
    "What did you learn from your work experience?",
    "Tell us about a time you worked in a team.",
    "What are the current challenges facing the NHS?",
    "How should a doctor respond if a patient refuses treatment?",
    "Should doctors be seen as role models?"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-6xl mb-4 block">👥</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Master
              <span className="block text-gradient-primary">Panel Interviews</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Excel in traditional medical school panel interviews with in-depth preparation for conversational, rapport-building interview formats.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link 
              href="/interviews/payment" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Book Mock Panel Consultation
            </Link>
            <Link href="#comparison" className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition-all duration-300">
              Panel vs MMI
            </Link>
          </div>
        </div>
      </section>

      {/* What are Panel Interviews Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What are Panel Interviews?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Understanding the traditional interview format still used by prestigious medical schools.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-gray-700">
              <p className="text-lg leading-relaxed">
                Some medical schools still use panel interviews rather than MMIs. These are longer, more conversational interviews with a small group of interviewers — typically <strong>2 to 4</strong> — such as doctors, academics, admissions staff, and sometimes students.
              </p>
              <p className="text-lg leading-relaxed">
                Candidates are assessed on their motivation for medicine, ethical reasoning, work experience reflections, and understanding of the healthcare profession. Unlike MMIs, panel interviews allow for follow-up questions and deeper exploration of the applicant's ideas and reasoning.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-100 to-blue-100 p-8 rounded-2xl">
                <span className="text-6xl block mb-4">💬</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Conversational Format</h3>
                <p className="text-gray-600">
                  Build rapport with interviewers through in-depth discussions that explore your motivations and understanding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Panel Prep Matters */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Panel Interviews Differ</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Panel interviews focus on depth rather than breadth, requiring different preparation strategies.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-blue-50 border border-blue-100">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Depth Over Breadth</h3>
              <p className="text-gray-600">Fewer questions with more discussion, critical thinking, and self-reflection</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-green-50 border border-green-100">
              <div className="text-4xl mb-4">🗣️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Follow-up Questions</h3>
              <p className="text-gray-600">Interviewers can probe further and ask for justification of your answers</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-purple-50 border border-purple-100">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rapport Building</h3>
              <p className="text-gray-600">Opportunity to build relationships and demonstrate personality over time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Universities Using Panel Interviews */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Which Medical Schools Use Panel Interviews?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              While formats can change year to year, these universities are known to use panel interviews either fully or partially:
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {universities.map((university, index) => (
              <div key={index} className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-gray-200">
                <div className="text-2xl mb-2">🏛️</div>
                <p className="font-semibold text-gray-900">{university}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-block">
              <strong>Note:</strong> Interview formats can change. Always check directly with your target universities for the most current information.
            </p>
          </div>
        </div>
      </section>

      {/* Panel vs MMI Comparison */}
      <section id="comparison" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Panel Interviews vs MMIs</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Understanding the key differences between interview formats
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Aspect</th>
                    <th className="px-6 py-4 text-left font-semibold">Panel Interviews</th>
                    <th className="px-6 py-4 text-left font-semibold">MMIs</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 font-semibold text-gray-900">{row.aspect}</td>
                      <td className="px-6 py-4 text-gray-700">{row.panel}</td>
                      <td className="px-6 py-4 text-gray-700">{row.mmi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Common Panel Questions */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Common Panel Questions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Panel interviews often include traditional questions designed to explore values, ethics, motivation, and communication
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {commonQuestions.map((question, index) => (
              <div key={index} className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold text-lg">Q:</span>
                  <p className="text-gray-700 font-medium">{question}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-xl font-bold text-green-800 mb-3">💡 Key to Strong Answers:</h3>
            <p className="text-green-700">
              Demonstrate <strong>clarity of thought</strong>, <strong>personal reflection</strong>, and a <strong>good understanding of healthcare values</strong>. Be prepared for follow-up questions that dig deeper into your responses.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Perfect Your Panel Interview</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer panel interview mocks with experienced tutors to simulate the real thing.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Each Session Includes:</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-600">
                    <span className="text-green-500 text-lg">✓</span>
                    A full-length panel-style mock interview tailored to a university of your choice
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <span className="text-green-500 text-lg">✓</span>
                    Questions generated from our Prometheus system based on your target medical school
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <span className="text-green-500 text-lg">✓</span>
                    Live verbal feedback and detailed written notes
                  </li>
                  <li className="flex items-center gap-3 text-gray-600">
                    <span className="text-green-500 text-lg">✓</span>
                    Personalised scoring breakdown and improvement plan
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-green-100 to-blue-100 p-6 rounded-xl mb-6">
                  <span className="text-5xl block mb-3">🎯</span>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Realistic Simulation</h4>
                  <p className="text-gray-600 text-sm">Designed to reflect the structure and tone of real panel interviews</p>
                </div>
                <p className="text-gray-600 text-sm">
                  This service provides focused, practical preparation tailored specifically to panel interview formats.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link 
              href="/interviews/payment"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-lg inline-block"
            >
              📅 Book Your Panel Interview Mock
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Excel in Panel Interviews?</h2>
          <p className="text-xl mb-8 opacity-90">
            Build confidence and master the conversational interview format with expert guidance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/interviews/payment" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300">
              Start Your Panel Preparation
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

export default PanelInterviewPage;
