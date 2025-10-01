'use client';

import React, { useState, useRef } from 'react';
import EmailGateForm from './EmailGateForm';
import SuccessModal from './SuccessModal';

interface ResourcePageWrapperProps {
  children: React.ReactNode;
  resourceId: string;
  guideName: string;
  source: string;
}

export default function ResourcePageWrapper({ 
  children, 
  resourceId, 
  guideName, 
  source 
}: ResourcePageWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [isExistingSubscription, setIsExistingSubscription] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSuccess = (downloadUrl: string, isExistingSubscription: boolean) => {
    setDownloadUrl(downloadUrl);
    setIsExistingSubscription(isExistingSubscription);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Pass scrollToForm function to children via context */}
      <ResourcePageContext.Provider value={{ scrollToForm }}>
        {children}
      </ResourcePageContext.Provider>

      {/* Email Gate Form */}
      <div ref={formRef}>
        <EmailGateForm
          onSuccess={handleFormSuccess}
          resourceId={resourceId}
          guideName={guideName}
          source={source}
        />
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        downloadUrl={downloadUrl}
        guideName={guideName}
        isExistingSubscription={isExistingSubscription}
      />
    </div>
  );
}

// Create context for sharing scrollToForm function
export const ResourcePageContext = React.createContext<{
  scrollToForm: () => void;
}>({
  scrollToForm: () => {},
});

export const useResourcePage = () => {
  const context = React.useContext(ResourcePageContext);
  if (!context) {
    throw new Error('useResourcePage must be used within a ResourcePageWrapper');
  }
  return context;
};