'use client'

import { useState, useEffect } from 'react';
import { packages } from '../data/packages';

export interface ContactDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  interviews: number;
  generatedPrice: number;
  tutorPrice: number;
  originalPrice?: number;
  popular?: boolean;
  features: string[];
}

export function usePaymentForm() {
  // Flattened state for better predictability
  const [serviceType, setServiceType] = useState<'generated' | 'actual' | ''>('');
  const [packageId, setPackageId] = useState('');
  const [universities, setUniversities] = useState<string[]>([]);
  const [contact, setContact] = useState<ContactDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [personalStatement, setPersonalStatement] = useState<File | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Initialize from URL parameters safely (idempotent)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pkgId = urlParams.get('package');
    const service = urlParams.get('service') as 'generated' | 'actual' | null;

    if (pkgId && service) {
      const pkg = packages.find(p => p.id === pkgId);
      if (pkg) {
        // Only set if not already set (prevents overwrites)
        setServiceType(prev => prev || service);
        setPackageId(prev => prev || pkgId);
        setSelectedPackage(pkg);
        setCurrentStep(3);
      }
    }
  }, []);

  // Derived state for validation
  const isStep1Complete = !!serviceType;
  const isStep2Complete = !!packageId && !!selectedPackage;
  const isStep3Complete = universities.length > 0;
  const isStep4Complete = !!(contact.firstName && contact.lastName && contact.email);

  const canProceedToUniversities = (): boolean => isStep1Complete && isStep2Complete;
  const canProceedToDetails = (): boolean => canProceedToUniversities() && isStep3Complete;
  const canProceedToPayment = (): boolean => canProceedToDetails() && isStep4Complete;

  const calculatePrice = () => {
    if (!selectedPackage || !serviceType) return 0;
    return serviceType === 'generated' 
      ? selectedPackage.generatedPrice 
      : selectedPackage.tutorPrice;
  };

  const handleServiceTypeChange = (newServiceType: 'generated' | 'actual') => {
    setServiceType(newServiceType);
    setCurrentStep(2);
  };

  const handlePackageSelection = (newPackageId: string) => {
    const pkg = packages.find(p => p.id === newPackageId);
    setPackageId(newPackageId);
    setSelectedPackage(pkg || null);
    setCurrentStep(3);
  };

  const handleUniversityToggle = (universityId: string) => {
    if (!selectedPackage) return;
    
    setUniversities(prev => {
      const isSelected = prev.includes(universityId);
      
      if (isSelected) {
        return prev.filter(id => id !== universityId);
      } else {
        const maxUniversities = selectedPackage.interviews;
        if (prev.length < maxUniversities) {
          return [...prev, universityId];
        } else {
          // Replace the first one if at limit
          return [...prev.slice(1), universityId];
        }
      }
    });
  };

  const handleContactChange = (field: keyof ContactDetails, value: string) => {
    setContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProceedToNext = () => {
    if (currentStep === 3 && canProceedToDetails()) {
      setCurrentStep(4);
    }
  };

  const handleProceedToPayment = () => {
    if (!selectedPackage || !canProceedToPayment()) return;

    const bookingData = {
      serviceType,
      packageId,
      universities,
      contactDetails: contact,
      price: calculatePrice().toString(),
      personalStatement,
      notes: additionalNotes,
      timestamp: new Date().toISOString()
    };
    
    sessionStorage.setItem('interview_booking', JSON.stringify(bookingData));
    
    const params = new URLSearchParams({
      serviceType,
      packageId,
      universities: universities.join(','),
      price: calculatePrice().toString(),
      notes: additionalNotes,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone
    });

    window.location.href = `/interviews/payment/complete?${params.toString()}`;
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    // State
    serviceType,
    packageId,
    universities,
    contact,
    personalStatement,
    additionalNotes,
    selectedPackage,
    currentStep,
    
    // Derived state
    isStep1Complete,
    isStep2Complete,
    isStep3Complete,
    isStep4Complete,
    
    // Validation functions
    canProceedToUniversities,
    canProceedToDetails,
    canProceedToPayment,
    
    // Handlers
    handleServiceTypeChange,
    handlePackageSelection,
    handleUniversityToggle,
    handleContactChange,
    handleProceedToNext,
    handleProceedToPayment,
    goBack,
    setPersonalStatement,
    setAdditionalNotes,
    
    // Utilities
    calculatePrice
  };
}