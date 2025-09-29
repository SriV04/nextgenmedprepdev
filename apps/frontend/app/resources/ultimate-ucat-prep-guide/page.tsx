"use client";
import React, { useState } from 'react';
import FreeResourceHero from '../../../components/free-resources/FreeResourceHero';
import WhyGetThisGuide from '../../../components/free-resources/WhyGetThisGuide';
import EmailGateForm from '../../../components/free-resources/EmailGateForm';
import SuccessModal from '../../../components/free-resources/SuccessModal';

export default function UCATFreeResourcesPage() {
  const [showModal, setShowModal] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isExistingSubscription, setIsExistingSubscription] = useState(false);

  const handleGetResource = () => {
    document.getElementById('email-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSuccess = (url: string, isExisting: boolean) => {
    setDownloadUrl(url);
    setIsExistingSubscription(isExisting);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FreeResourceHero 
        title="Ultimate UCAT Preparation Guide"
        subtitle="Boost your UCAT score with proven strategies and expert tips"
        imagePath="/guides/UCAT-guide.png"
        imageAlt="UCAT Preparation Guide Cover"
        benefits={[
          "Comprehensive breakdown of all four UCAT subtests",
          "Time-saving strategies to maximize your score",
          "Practice questions with detailed solutions",
          "Expert tips from students who scored in the top 10%",
          "Step-by-step preparation timeline for optimal results"
        ]}
        onGetResource={handleGetResource}
      />
      
      <WhyGetThisGuide 
        reasons={[
          {
            icon: <span>📊</span>,
            title: "Complete Coverage",
            description: "Detailed strategies for all four subtests of the UCAT exam"
          },
          {
            icon: <span>⏱️</span>,
            title: "Time Management",
            description: "Learn how to efficiently manage your time during the high-pressure UCAT exam"
          },
          {
            icon: <span>🎯</span>,
            title: "Proven Techniques",
            description: "Methods used by students who achieved scores in the top 10% nationally"
          }
        ]}
      />
      
      <div id="email-form">
        <EmailGateForm 
          resourceId="ucat-guide"
          guideName="UCAT Preparation Guide"
          onSuccess={handleSuccess}
          source="ucat_page"
        />
      </div>

      {showModal && (
        <SuccessModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          downloadUrl={downloadUrl}
          isExistingSubscription={isExistingSubscription}
          guideName="UCAT Guide"
        />
      )}
    </div>
  );
}