'use client'

import { useState, useEffect } from 'react';
import { ExtendedPackage, interviewPackages } from '../../../../data/packages';

export interface ContactDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  field: 'medicine' | 'dentistry' | '';
}

export interface InterviewDate {
  universityId: string;
  date: string;
  timeSlot: string;
}

export function usePaymentForm() {
  // Flattened state for better predictability
  const [serviceType, setServiceType] = useState<'generated' | 'live' | ''>('');
  const [packageId, setPackageId] = useState('');
  const [universities, setUniversities] = useState<string[]>([]);
  const [interviewDates, setInterviewDates] = useState<InterviewDate[]>([]);
  const [contact, setContact] = useState<ContactDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    field: ''
  });
  const [personalStatement, setPersonalStatement] = useState<File | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<ExtendedPackage | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Initialize from URL parameters safely (idempotent)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pkgId = urlParams.get('package');
    const service = urlParams.get('service') as 'generated' | 'live' | null;
    const university = urlParams.get('university');

    if (pkgId && service) {
      const pkg = interviewPackages.find(p => p.id === pkgId);
      if (pkg) {
        // Only set if not already set (prevents overwrites)
        setServiceType(prev => prev || service);
        setPackageId(prev => prev || pkgId);
        setSelectedPackage(pkg);
        
        // If university is provided, pre-select it and go directly to step 4 (contact details)
        if (university) {
          setUniversities(prev => prev.length === 0 ? [university] : prev);
          setCurrentStep(4); // Go directly to contact details
        } else {
          setCurrentStep(3); // Go to university selection
        }
      }
    }
  }, []);

  // Derived state for validation
  const isStep1Complete = !!serviceType;
  const isStep2Complete = !!packageId && !!selectedPackage;
  const isStep3Complete = universities.length > 0;
  const isStep3_5Complete = serviceType === 'generated' ? true : interviewDates.length > 0; // Only require dates for live sessions
  const isStep4Complete = !!(contact.firstName && contact.lastName && contact.email && contact.field);

  const canProceedToUniversities = (): boolean => isStep1Complete && isStep2Complete;
  const canProceedToInterviewDates = (): boolean => canProceedToUniversities() && isStep3Complete;
  const canProceedToDetails = (): boolean => canProceedToInterviewDates() && isStep3_5Complete;
  const canProceedToPayment = (): boolean => canProceedToDetails() && isStep4Complete;

  const calculatePrice = () => {
    if (!selectedPackage || !serviceType) return 0;
    return serviceType === 'generated' 
      ? selectedPackage.generatedPrice 
      : selectedPackage.tutorPrice;
  };

  const handleServiceTypeChange = (newServiceType: 'generated' | 'live') => {
    setServiceType(newServiceType);
    setCurrentStep(2);
  };

  const handlePackageSelection = (newPackageId: string) => {
    const pkg = interviewPackages.find(p => p.id === newPackageId);
    setPackageId(newPackageId);
    setSelectedPackage(pkg || null);
    console.log('Selected package:', pkg);
    console.log('Package ID set to:', newPackageId);
    setCurrentStep(3);
  };

  const handleUniversityToggle = (universityId: string) => {
    if (!selectedPackage) return;
    
    setUniversities(prev => {
      const isSelected = prev.includes(universityId);
      
      if (isSelected) {
        // Remove university and its associated interview dates
        setInterviewDates(prevDates => prevDates.filter(date => date.universityId !== universityId));
        return prev.filter(id => id !== universityId);
      } else {
        const maxUniversities = selectedPackage.interviews;
        if (prev.length < maxUniversities) {
          return [...prev, universityId];
        } else {
          // Replace the first one if at limit and remove its dates
          const removedUniversityId = prev[0];
          setInterviewDates(prevDates => prevDates.filter(date => date.universityId !== removedUniversityId));
          return [...prev.slice(1), universityId];
        }
      }
    });
  };

  const handleInterviewDateAdd = (universityId: string, date: string, timeSlot: string) => {
    if (!selectedPackage) return false;
    
    const maxDates = selectedPackage.interviews;
    const currentDateCount = interviewDates.length;
    
    if (currentDateCount >= maxDates) {
      return false; // Cannot add more dates
    }
    
    const newDate: InterviewDate = {
      universityId,
      date,
      timeSlot
    };
    
    setInterviewDates(prev => [...prev, newDate]);
    return true;
  };

  const handleInterviewDateRemove = (universityId: string, date: string, timeSlot: string) => {
    setInterviewDates(prev => 
      prev.filter(d => !(d.universityId === universityId && d.date === date && d.timeSlot === timeSlot))
    );
  };

  const getUniversityDateCount = (universityId: string): number => {
    return interviewDates.filter(date => date.universityId === universityId).length;
  };

  const getTotalDateCount = (): number => {
    return interviewDates.length;
  };

  const canAddDateForUniversity = (universityId: string): boolean => {
    if (!selectedPackage) return false;
    return getTotalDateCount() < selectedPackage.interviews;
  };

  const handleContactChange = (field: keyof ContactDetails, value: string) => {
    setContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProceedToNext = () => {
    if (currentStep === 3 && canProceedToInterviewDates()) {
      // For generated questions, skip interview dates and go straight to contact
      if (serviceType === 'generated') {
        setCurrentStep(4);
      } else {
        setCurrentStep(3.5); // Go to interview dates step for live sessions
      }
    } else if (currentStep === 3.5 && canProceedToDetails()) {
      setCurrentStep(4);
    }
  };

  const handleProceedToInterviewDates = () => {
    if (canProceedToInterviewDates()) {
      setCurrentStep(3.5);
    }
  };

  const handleProceedToPayment = async () => {
    if (!selectedPackage || !canProceedToPayment() || !personalStatement) {
      alert('Please upload your personal statement before proceeding to payment.');
      return;
    }

    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add personal statement file
      formData.append('personalStatement', personalStatement);
      
      // Add contact details
      formData.append('email', contact.email);
      formData.append('firstName', contact.firstName);
      formData.append('lastName', contact.lastName);
      formData.append('field', contact.field);
      formData.append('phone', contact.phone);
      
      // Add booking details
      formData.append('packageType', packageId);
      formData.append('serviceType', serviceType);
      formData.append('universities', JSON.stringify(universities));
      formData.append('amount', calculatePrice().toString());
      
      // Add interview dates for live sessions
      if (serviceType === 'live' && interviewDates.length > 0) {
        formData.append('interviewDates', JSON.stringify(interviewDates));
      }
      
      // Add optional fields
      if (additionalNotes) {
        formData.append('notes', additionalNotes);
      }
      
      // Submit to backend API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/v1/interview-bookings`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.data.checkout_url) {
        // Save booking data to session storage for reference
        const bookingData = {
          serviceType,
          packageId,
          universities,
          contactDetails: contact,
          price: calculatePrice().toString(),
          notes: additionalNotes,
          timestamp: new Date().toISOString(),
          session_id: data.data.session_id
        };
        sessionStorage.setItem('interview_booking', JSON.stringify(bookingData));
        
        // Redirect to Stripe checkout
        window.location.href = data.data.checkout_url;
      } else {
        throw new Error(data.error || 'Failed to create booking');
      }
    } catch (error: any) {
      console.error('Error creating interview booking:', error);
      alert(`Failed to create booking: ${error.message}. Please try again or contact support.`);
    }
  };

  const goBack = () => {
    if (currentStep === 4) {
      // From contact details, go back to interview dates (if live) or universities (if generated)
      if (serviceType === 'live') {
        setCurrentStep(3.5);
      } else {
        setCurrentStep(3);
      }
    } else if (currentStep === 3.5) {
      // From interview dates, go back to universities
      setCurrentStep(3);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    // State
    serviceType,
    packageId,
    universities,
    interviewDates,
    contact,
    personalStatement,
    additionalNotes,
    selectedPackage,
    currentStep,
    
    // Derived state
    isStep1Complete,
    isStep2Complete,
    isStep3Complete,
    isStep3_5Complete,
    isStep4Complete,
    
    // Validation functions
    canProceedToUniversities,
    canProceedToInterviewDates,
    canProceedToDetails,
    canProceedToPayment,
    
    // Interview dates handlers
    handleInterviewDateAdd,
    handleInterviewDateRemove,
    getUniversityDateCount,
    getTotalDateCount,
    canAddDateForUniversity,
    
    // Handlers
    handleServiceTypeChange,
    handlePackageSelection,
    handleUniversityToggle,
    handleContactChange,
    handleProceedToNext,
    handleProceedToInterviewDates,
    handleProceedToPayment,
    goBack,
    setPersonalStatement,
    setAdditionalNotes,
    
    // Utilities
    calculatePrice
  };
}