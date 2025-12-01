import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function InterviewTermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link 
            href="/interviews" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Interviews
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Mock Interview Terms and Conditions</h1>
          <p className="text-gray-600 mt-2">Effective Date: December 1, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 prose prose-blue max-w-none">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              These Terms and Conditions ("Terms") govern your use of NextGen Med Prep's mock interview services. 
              By booking a mock interview session, you agree to be bound by these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Booking and Payment</h2>
            <p className="text-gray-700 mb-2">2.1. All mock interview bookings must be paid in full at the time of booking.</p>
            <p className="text-gray-700 mb-2">2.2. Payment confirms your acceptance of these Terms and secures your interview slot.</p>
            <p className="text-gray-700 mb-4">2.3. Prices are subject to change, but confirmed bookings will honor the price paid at the time of booking.</p>
          </section>

          <section className="mb-8 bg-red-50 border-l-4 border-red-500 p-6 rounded">
            <h2 className="text-2xl font-bold text-red-900 mb-4">3. No Refund Policy</h2>
            <p className="text-red-900 font-semibold mb-4">
              3.1. All sales are final. No refunds will be issued under any circumstances, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-red-900 mb-4 space-y-1">
              <li>Change of mind</li>
              <li>Schedule conflicts</li>
              <li>Personal emergencies</li>
              <li>Technical difficulties on the student's end</li>
              <li>Dissatisfaction with the service</li>
              <li>Failure to attend the scheduled interview</li>
            </ul>
            <p className="text-red-900">
              3.2. In the event that NextGen Med Prep cancels a session due to tutor unavailability or technical issues on our end, 
              a full refund or reschedule will be offered at the student's discretion.
            </p>
          </section>

          <section className="mb-8 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
            <h2 className="text-2xl font-bold text-yellow-900 mb-4">4. Rescheduling Policy</h2>
            <p className="text-yellow-900 font-semibold mb-4">
              4.1. No rescheduling is permitted within 24 hours of the scheduled interview time.
            </p>
            <p className="text-yellow-900 mb-2">
              4.2. Requests to reschedule must be submitted at least 24 hours (full 24 hours) before your scheduled interview time.
            </p>
            <p className="text-yellow-900 mb-2">
              4.3. Rescheduling requests made with appropriate notice (24+ hours in advance) will be accommodated subject to tutor availability.
            </p>
            <p className="text-yellow-900 mb-2">
              4.4. Only one reschedule per booking is permitted. Subsequent reschedule requests may be denied.
            </p>
            <p className="text-yellow-900 mb-2">
              4.5. Rescheduling requests must be submitted via email or direct communication with a tutor.
            </p>
            <p className="text-yellow-900">
              4.6. Late arrivals or no-shows will not be eligible for rescheduling or refunds.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cancellation Policy</h2>
            <p className="text-gray-700 mb-2">5.1. If you need to cancel your mock interview, you must provide notice at least 24 hours in advance.</p>
            <p className="text-gray-700 mb-2 font-semibold">
              5.2. Cancellations made within 24 hours of the scheduled time will result in forfeiture of the full payment with no refund.
            </p>
            <p className="text-gray-700 mb-4">
              5.3. Cancellations made with appropriate notice (24+ hours) will not receive a refund but may be eligible for one reschedule attempt.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Attendance and Punctuality</h2>
            <p className="text-gray-700 mb-2">6.1. Students are expected to arrive on time for their scheduled mock interview.</p>
            <p className="text-gray-700 mb-2">6.2. Late arrivals will not receive additional time, and the session will end at the originally scheduled time.</p>
            <p className="text-gray-700 mb-2">
              6.3. If a student is more than 15 minutes late, the session may be cancelled with no refund or reschedule option.
            </p>
            <p className="text-gray-700 mb-4">
              6.4. Students are responsible for ensuring they have the correct meeting link and technical setup prior to the session.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Technical Requirements</h2>
            <p className="text-gray-700 mb-2">
              7.1. Students are responsible for having a stable internet connection, functioning camera, and microphone.
            </p>
            <p className="text-gray-700 mb-2">
              7.2. Technical issues on the student's end (internet connectivity, hardware problems, etc.) do not qualify for refunds or rescheduling.
            </p>
            <p className="text-gray-700 mb-4">
              7.3. It is recommended that students test their equipment at least 30 minutes before the scheduled interview time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Session Conduct</h2>
            <p className="text-gray-700 mb-2">
              8.1. Mock interviews are conducted professionally and students are expected to treat tutors with respect.
            </p>
            <p className="text-gray-700 mb-2">
              8.2. NextGen Med Prep reserves the right to terminate a session if a student engages in inappropriate, abusive, or disrespectful behavior.
            </p>
            <p className="text-gray-700 mb-4">
              8.3. Terminated sessions due to student misconduct will not be eligible for refunds or rescheduling.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Confidentiality and Recording</h2>
            <p className="text-gray-700 mb-2">
              9.1. All mock interview sessions may be recorded for quality assurance and training purposes.
            </p>
            <p className="text-gray-700 mb-2">
              9.2. Students may not record sessions without prior written consent from NextGen Med Prep.
            </p>
            <p className="text-gray-700 mb-4">
              9.3. All information shared during sessions is confidential and will not be shared with third parties except as required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Feedback and Evaluation</h2>
            <p className="text-gray-700 mb-2">
              10.1. Tutors will provide constructive feedback during and/or after the mock interview session.
            </p>
            <p className="text-gray-700 mb-2">
              10.2. Feedback is provided as guidance only and does not guarantee specific outcomes in actual interviews.
            </p>
            <p className="text-gray-700 mb-4">
              10.3. Students may request written feedback within 48 hours of their session, subject to tutor availability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Limitation of Liability</h2>
            <p className="text-gray-700 mb-2">
              11.1. NextGen Med Prep provides mock interview services for educational and preparatory purposes only.
            </p>
            <p className="text-gray-700 mb-2">
              11.2. We do not guarantee admission to any institution or success in actual interviews.
            </p>
            <p className="text-gray-700 mb-4">
              11.3. Our liability is limited to the amount paid for the specific mock interview service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Force Majeure</h2>
            <p className="text-gray-700 mb-2">
              12.1. NextGen Med Prep is not liable for failure to perform services due to circumstances beyond our reasonable control, 
              including but not limited to natural disasters, power outages, or internet service disruptions.
            </p>
            <p className="text-gray-700 mb-4">
              12.2. In such cases, we will make reasonable efforts to reschedule the session or provide a refund at our discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Modifications to Terms</h2>
            <p className="text-gray-700 mb-2">
              13.1. NextGen Med Prep reserves the right to modify these Terms at any time.
            </p>
            <p className="text-gray-700 mb-2">
              13.2. Changes will be effective immediately upon posting to our website.
            </p>
            <p className="text-gray-700 mb-4">
              13.3. Continued use of our services after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
            <p className="text-gray-700 mb-2">
              For questions regarding these Terms and Conditions, please contact:
            </p>
            <p className="text-gray-700 font-semibold">NextGen Med Prep</p>
            <p className="text-gray-700">Email: contact@nextgenmedprep.com</p>
            <p className="text-gray-700 mb-4">Website: https://www.nextgenmedprep.com</p>
          </section>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded mt-8">
            <p className="text-blue-900 font-semibold">
              By booking a mock interview with NextGen Med Prep, you acknowledge that you have read, understood, 
              and agree to be bound by these Terms and Conditions, including the no refund policy and 24-hour rescheduling restriction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
