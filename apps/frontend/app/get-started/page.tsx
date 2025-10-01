import HeroSection from '@/components/get-started/HeroSection';
import HealthcareCareerExplorer from '@/components/get-started/HealthcareCareerExplorer';

export default function GetStarted() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <HeroSection />
      <HealthcareCareerExplorer />
    </div>
  );
}
