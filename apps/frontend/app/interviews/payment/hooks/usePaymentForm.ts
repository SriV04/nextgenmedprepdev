'use client'

import { useState, useEffect } from 'react';
import { ExtendedPackage, interviewPackages } from '../../../../data/packages';
import { trackInitiateCheckout } from '@/components/MetaPixel';

export interface ContactDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  field: 'medicine' | 'dentistry' | '';
}

export interface AvailabilitySlot {
  date: string;
  timeSlot: string;
}

// Condense availability to under 500 characters
// Format: date1|startHour-endHour;date2|startHour-endHour;...
function condenseAvailability(availability: AvailabilitySlot[]): string {
  if (!availability || availability.length === 0) return '';
  
  return availability.map(slot => {
    // Parse timeSlot format "HH:mm - HH:mm" to extract hours
    const [startTime, endTime] = slot.timeSlot.split(' - ');
    const hourStart = startTime.split(':')[0].padStart(2, '0');
    const hourEnd = endTime.split(':')[0].padStart(2, '0');
    
    // Format: YYYY-MM-DD|HH-HH
    return `${slot.date}|${hourStart}-${hourEnd}`;
  }).join(';').substring(0, 500); // Ensure max 500 chars
}

export function usePaymentForm() {
  // Flattened state for better predictability
  const [serviceType, setServiceType] = useState<'generated' | 'live' | ''>('');
  const [packageId, setPackageId] = useState('');
  const [universities, setUniversities] = useState<string[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
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
  const isStep4Complete = !!(contact.firstName && contact.lastName && contact.email && contact.field);

  const canProceedToUniversities = (): boolean => isStep1Complete && isStep2Complete;
  const canProceedToDetails = (): boolean => canProceedToUniversities() && isStep3Complete;
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
      const maxUniversities = selectedPackage.interviews;
      
      // Check if we can add more
      if (prev.length < maxUniversities) {
        // Always add - allow duplicates
        return [...prev, universityId];
      } else {
        // At capacity, don't add more (user would need to remove one first)
        return prev;
      }
    });
  };

  const handleRemoveUniversity = (universityId: string) => {
    // Remove the first occurrence of this university
    setUniversities(prev => {
      const index = prev.indexOf(universityId);
      if (index !== -1) {
        return prev.filter((_, i) => i !== index);
      }
      return prev;
    });
  };

  const handleAvailabilityChange = (newAvailability: AvailabilitySlot[]) => {
    console.log('=== Availability Changed ===');
    console.log('New availability:', newAvailability);
    console.log('Number of slots:', newAvailability.length);
    setAvailability(newAvailability);
  };

  const handleContactChange = (field: keyof ContactDetails, value: string) => {
    setContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProceedToNext = () => {
    if (currentStep === 3 && canProceedToDetails()) {
      // Go directly to contact details (step 4)
      setCurrentStep(4);
    }
  };

  const handleProceedToPayment = async () => {
    if (!selectedPackage || !canProceedToPayment()) {
      alert('Please complete all required fields before proceeding to payment.');
      return;
    }

    try {
      const price = calculatePrice();
      
      // Track InitiateCheckout event for interview booking
      trackInitiateCheckout(
        price,
        'GBP',
        `${selectedPackage.name} - ${serviceType === 'live' ? 'Live' : 'Generated'} Interview`
      );
      
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add personal statement file if provided
      if (personalStatement) {
        formData.append('personalStatement', personalStatement);
      }
      
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
      
      // Add availability for live sessions (condensed format)
      console.log('=== Availability Debug ===');
      console.log('Service Type:', serviceType);
      console.log('Availability:', availability);
      console.log('Availability Length:', availability.length);
      
      if (serviceType === 'live' && availability.length > 0) {
        const condensedAvailability = condenseAvailability(availability);
        console.log('Condensed Availability:', condensedAvailability);
        formData.append('availability', condensedAvailability);
      } else {
        console.log('Availability NOT being sent - serviceType:', serviceType, 'length:', availability.length);
      }
      
      // Add optional fields
      if (additionalNotes) {
        formData.append('notes', additionalNotes);
      }
      
      // Submit to backend API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
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
          availability,
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
    availability,
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
    
    // Availability handler
    handleAvailabilityChange,
    
    // Handlers
    handleServiceTypeChange,
    handlePackageSelection,
    handleUniversityToggle,
    handleRemoveUniversity,
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