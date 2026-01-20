import React from 'react';
import FreeResourceHero from '@/components/free-resources/FreeResourceHero';
import WhyGetThisGuide from '@/components/free-resources/WhyGetThisGuide';
import ResourcePageWrapper from '@/components/free-resources/ResourcePageWrapper';
import CTAButton from '@/components/free-resources/CTAButton';

export default function UCATFreeResourcesPage() {
  return (
    <ResourcePageWrapper
      resourceId="ultimate-ucat-guide"
      guideName="Ultimate UCAT Guide"
      source="ucat_download"
    >
      <div className="min-h-screen bg-gray-50">
        <FreeResourceHero 
          title="Ultimate UCAT Preparation Guide"
          subtitle="Boost your UCAT score with proven strategies and expert tips"
          imagePath="/guides/UCAT-guide.jpeg"
          imageAlt="UCAT Preparation Guide Cover"
          benefits={[
            "Comprehensive breakdown of all four UCAT subtests",
            "Time-saving strategies to maximize your score",
            "Practice questions with detailed solutions",
            "Expert tips from students who scored in the top 10%",
            "Step-by-step preparation timeline for optimal results"
          ]}
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
      </div>
    </ResourcePageWrapper>
  );
}