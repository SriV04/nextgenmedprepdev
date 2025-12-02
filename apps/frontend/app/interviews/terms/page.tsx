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
            <p className="text-gray-700 mb-2">
              These Terms and Conditions ("Terms") apply to all mock interview services provided by NextGen Med Prep ("we", "us", "our").
            </p>
            <p className="text-gray-700 mb-4">
              By booking a mock interview, you confirm that you have read and agreed to these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Booking & Payment</h2>
            <p className="text-gray-700 mb-2">2.1. All mock interview sessions must be paid for in full at the time of booking.</p>
            <p className="text-gray-700 mb-2">2.2. Payment confirms your interview slot and acceptance of these Terms.</p>
            <p className="text-gray-700 mb-4">2.3. Pricing may change, but confirmed bookings always remain at the price paid.</p>
          </section>

          <section className="mb-8 bg-red-50 border-l-4 border-red-500 p-6 rounded">
            <h2 className="text-2xl font-bold text-red-900 mb-4">3. Refund Policy</h2>
            <p className="text-red-900 font-semibold mb-2">
              3.1. Mock interview bookings are non-refundable.
            </p>
            <p className="text-red-900 mb-2">This includes circumstances such as:</p>
            <ul className="list-disc pl-6 text-red-900 mb-4 space-y-1">
              <li>change of mind</li>
              <li>timetable changes</li>
              <li>personal emergencies</li>
              <li>technical issues on the student's side</li>
              <li>dissatisfaction with the session</li>
              <li>failure to attend</li>
            </ul>
            <p className="text-red-900 mb-2">
              3.2. If we need to cancel due to tutor illness, emergencies, or technical issues on our side, you may choose either:
            </p>
            <ul className="list-disc pl-6 text-red-900 mb-4 space-y-1">
              <li>a full refund, or</li>
              <li>a free reschedule</li>
            </ul>
            <p className="text-red-900">
              3.3. In exceptional circumstances (e.g., bereavement), we may review cases individually at our discretion.
            </p>
          </section>

          <section className="mb-8 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
            <h2 className="text-2xl font-bold text-yellow-900 mb-4">4. Rescheduling Policy</h2>
            <p className="text-yellow-900 font-semibold mb-4">
              4.1. Rescheduling is permitted only with at least 24 hours' notice (a full 24 hours).
            </p>
            <p className="text-yellow-900 mb-2">
              4.2. All requests must be made via email or direct message to a tutor.
            </p>
            <p className="text-yellow-900 mb-2">
              4.3. Rescheduling is subject to tutor availability.
            </p>
            <p className="text-yellow-900 mb-2">
              4.4. Only one reschedule is allowed per mock.
            </p>
            <p className="text-yellow-900 mb-2">
              4.5. Requests made within 24 hours of the scheduled time cannot be accommodated.
            </p>
            <p className="text-yellow-900">
              4.6. No-shows are not eligible for rescheduling or refunds.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cancellations</h2>
            <p className="text-gray-700 mb-2">
              5.1. Cancellations made with 24+ hours' notice will not be refunded but may use their one reschedule.
            </p>
            <p className="text-gray-700 mb-4 font-semibold">
              5.2. Cancellations with less than 24 hours' notice result in full forfeiture of payment.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Attendance & Punctuality</h2>
            <p className="text-gray-700 mb-2">
              6.1. Students should join the session on time using the correct meeting link.
            </p>
            <p className="text-gray-700 mb-2">
              6.2. Sessions will finish at the scheduled end time, even if the student arrives late.
            </p>
            <p className="text-gray-700 mb-2">
              6.3. Students arriving more than 15 minutes late may have their session cancelled with no refund or reschedule.
            </p>
            <p className="text-gray-700 mb-4">
              6.4. We recommend joining 5–10 minutes early to test your setup.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Technical Requirements</h2>
            <p className="text-gray-700 mb-4">
              7.1. Students are responsible for having a stable internet connection and working camera/microphone.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Conduct During Sessions</h2>
            <p className="text-gray-700 mb-2">
              8.1. Our tutors provide sessions in a respectful and professional manner.
            </p>
            <p className="text-gray-700 mb-2">
              8.2. Students must behave respectfully towards tutors.
            </p>
            <p className="text-gray-700 mb-4">
              8.3. Inappropriate, abusive, or disruptive behaviour may result in immediate termination of the session with no refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Recording & Confidentiality</h2>
            <p className="text-gray-700 mb-2">
              9.1. Some sessions may be recorded for training and quality assurance.
            </p>
            <p className="text-gray-700 mb-2">
              9.2. By booking, you give clear consent for these recordings.
            </p>
            <p className="text-gray-700 mb-2">
              9.3. Students may not record sessions without written permission from NextGen Med Prep.
            </p>
            <p className="text-gray-700 mb-4">
              9.4. All session content is confidential and will not be shared outside NextGen Med Prep except as required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Feedback</h2>
            <p className="text-gray-700 mb-2">
              10.1. Tutors provide verbal or written feedback as guidance for improvement.
            </p>
            <p className="text-gray-700 mb-2">
              10.2. Feedback does not guarantee performance in real interviews.
            </p>
            <p className="text-gray-700 mb-4">
              10.3. Written feedback can be requested within 48 hours of the session and will be provided subject to tutor availability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Limitation of Liability</h2>
            <p className="text-gray-700 mb-2">
              11.1. Our mock interview service is educational and preparatory in nature.
            </p>
            <p className="text-gray-700 mb-2">
              11.2. We do not guarantee admission to any university or a specific interview outcome.
            </p>
            <p className="text-gray-700 mb-4">
              11.3. Our total liability is limited to the amount paid for that specific session.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Force Majeure</h2>
            <p className="text-gray-700 mb-2">
              12.1. We are not responsible for delays or cancellations due to reasons beyond our control (e.g., power outages, severe weather, network failures).
            </p>
            <p className="text-gray-700 mb-4">
              12.2. In such cases, we will offer a reschedule or refund at our discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to These Terms</h2>
            <p className="text-gray-700 mb-2">
              13.1. We may update these Terms from time to time.
            </p>
            <p className="text-gray-700 mb-2">
              13.2. Changes become effective as soon as they are posted on our website.
            </p>
            <p className="text-gray-700 mb-4">
              13.3. Continued use of our service means you accept the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Us</h2>
            <p className="text-gray-700 mb-2">
              For questions or help with your booking:
            </p>
            <p className="text-gray-700">Email: contact@nextgenmedprep.com</p>
            <p className="text-gray-700 mb-4">Website: nextgenmedprep.com</p>
          </section>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded mt-8">
            <p className="text-blue-900 font-semibold">
              By booking a mock interview with NextGen Med Prep, you acknowledge that you have read, understood, 
              and agree to be bound by these Terms and Conditions, including the non-refundable policy and 24-hour rescheduling requirement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
