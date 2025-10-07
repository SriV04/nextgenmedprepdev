'use client';

import React from "react";
import Link from 'next/link';
import { motion } from 'framer-motion';

const ComprehensiveServices = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <h2 className="text-3xl font-bold text-center mb-6">
        Our Comprehensive Services
      </h2>
      <p className="text-lg text-center mb-10 max-w-2xl mx-auto text-gray-600">
        We provide a focused set of services to support you through every stage
        of your medical school application.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mock Interviews */}
        <Link href="/interviews" className="group">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:scale-105">
            <div className="mb-4 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Mock Interviews
            </h3>
            <p className="text-white/90">
              Realistic interview simulations with detailed feedback to help you
              perform at your best.
            </p>
          </div>
        </Link>

        {/* UCAT Services */}
        <Link href="/ucat" className="group">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:scale-105">
            <div className="mb-4 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">UCAT Services</h3>
            <p className="text-white/90">
              Targeted strategies and practice resources to boost your UCAT
              performance.
            </p>
          </div>
        </Link>

        {/* Personal Statement */}
        <Link href="/personal-statements" className="group">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:scale-105">
            <div className="mb-4 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 20h9M12 4h9m-9 8h9M4 6h.01M4 12h.01M4 18h.01"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Personal Statement
            </h3>
            <p className="text-white/90">
              Expert guidance to craft a compelling personal statement that
              stands out.
            </p>
          </div>
        </Link>

        {/* Conferences & Webinars */}
        <Link href="/events" className="group">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:scale-105">
            <div className="mb-4 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2m4-4l-4-4m0 0l-4 4m4-4v12"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Conferences & Webinars
            </h3>
            <p className="text-white/90">
              Interactive events and webinars with experts to keep you informed
              and prepared.
            </p>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default ComprehensiveServices;
