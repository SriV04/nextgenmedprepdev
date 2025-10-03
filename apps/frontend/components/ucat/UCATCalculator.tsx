"use client";

import React, { useState, useEffect } from 'react';
import CalendlyPopup from '../CalendlyPopup';

interface UCATCalculatorProps {
  className?: string;
}

const UCATCalculator: React.FC<UCATCalculatorProps> = ({ className = "" }) => {
  const [currentScore, setCurrentScore] = useState<number>(2000);
  const [targetScore, setTargetScore] = useState<number>(2500);
  const [calculatedHours, setCalculatedHours] = useState<number>(0);

  // Reset calculated hours whenever sliders change
  useEffect(() => {
    setCalculatedHours(0);
  }, [currentScore, targetScore]);

  const calculateTutoringHours = () => {
    const scoreDifference = targetScore - currentScore;
    
    // If current score is higher than target, recommend maintenance hours
    if (scoreDifference <= 0) {
      setCalculatedHours(3); // Minimum package hours for score maintenance
      return;
    }
    
    // Strategic calculation to better align with package ranges
    let recommendedHours = 0;
    
    // Score difference ranges designed to hit package sweet spots
    if (scoreDifference <= 100) {
      // Small improvements: 25-100 points → Kickstart (≤4 hours)
      recommendedHours = currentScore >= 2400 ? 3 : 4;
    } else if (scoreDifference <= 200) {
      // Moderate improvements: 100-200 points → Advance (4-8 hours)  
      if (currentScore >= 2400) {
        recommendedHours = 5; // High baseline, moderate gap
      } else if (currentScore >= 2200) {
        recommendedHours = 6; // Medium baseline, moderate gap
      } else {
        recommendedHours = 8; // Lower baseline needs more work
      }
    } else if (scoreDifference <= 350) {
      // Significant improvements: 200-350 points → Mastery (8-12 hours)
      if (currentScore >= 2300) {
        recommendedHours = 9; // Good baseline, big jump
      } else if (currentScore >= 2100) {
        recommendedHours = 11; // Lower baseline, significant work needed
      } else {
        recommendedHours = 12; // Very low baseline, maximum structured hours
      }
    } else {
      // Major improvements: >350 points → Custom consultation (>12 hours)
      recommendedHours = Math.min(18, 13 + Math.floor(scoreDifference / 50));
    }
    
    // Fine-tune based on target score ambition
    if (targetScore >= 2600 && scoreDifference > 150) {
      recommendedHours += 1; // Premium targets need extra refinement
    }
    
    // Ensure we hit package boundaries more often
    if (recommendedHours === 5 || recommendedHours === 6) {
      // Push moderate cases toward either Kickstart or Advance clearly
      recommendedHours = scoreDifference <= 120 ? 4 : 7;
    }
    
    if (recommendedHours === 9 || recommendedHours === 10) {
      // Push toward clear Mastery territory
      recommendedHours = currentScore >= 2300 ? 8 : 11;
    }
    
    setCalculatedHours(Math.max(3, recommendedHours));
  };

  const renderResults = () => {
    if (calculatedHours === 0) return null;

    // Determine recommended package based on calculated hours
    let packageName = "";
    let packageDescription = "";
    let packageHours = 0;
    let packagePrice = "";
    let packageColor = "bg-blue-600";
    let packageHoverColor = "hover:bg-blue-700";
    let showConsultation = false;

    if (calculatedHours <= 4) {
      packageName = "UCAT Kickstart";
      packageDescription = "Perfect for building strong foundations";
      packageHours = 4;
      packagePrice = "£200";
      packageColor = "bg-blue-600";
      packageHoverColor = "hover:bg-blue-700";
    } else if (calculatedHours <= 8) {
      packageName = "UCAT Advance";
      packageDescription = "Ideal for refining and targeting performance";
      packageHours = 8;
      packagePrice = "£375";
      packageColor = "bg-purple-600";
      packageHoverColor = "hover:bg-purple-700";
    } else if (calculatedHours <= 12) {
      packageName = "UCAT Mastery";
      packageDescription = "For achieving top 10% scores";
      packageHours = 12;
      packagePrice = "£550";
      packageColor = "bg-indigo-600";
      packageHoverColor = "hover:bg-indigo-700";
    } else {
      showConsultation = true;
    }

    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200 text-center">
        <div className="mb-4">
          <span className="text-4xl font-bold text-blue-600">{calculatedHours}</span>
          <span className="text-lg text-gray-700 ml-2">hours</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {targetScore <= currentScore ? "Recommended Maintenance Hours" : "Recommended Tutoring Hours"}
        </h3>
        <p className="text-gray-600 mb-4">
          {targetScore <= currentScore 
            ? `Since you're already at or above your target score, we recommend ${calculatedHours} hours of targeted practice to solidify your performance and build full confidence for test day.`
            : `Based on your score gap of ${targetScore - currentScore} points, our algorithm recommends ${calculatedHours} hours of intensive tutoring to achieve your target score.`
          }
        </p>
        
        {showConsultation ? (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200 mb-6">
            <h4 className="font-bold text-orange-800 mb-2">Custom Program Recommended</h4>
            <p className="text-orange-700 text-sm mb-4">
              Based on your requirements, we recommend a personalized consultation to create a custom tutoring plan that fits your specific needs and timeline.
            </p>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
            <h4 className="font-bold text-gray-900 mb-1">Recommended Package</h4>
            <div className="text-xl font-bold text-purple-600">{packageName}</div>
            <p className="text-gray-600 text-sm mb-2">{packageDescription}</p>
            <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
              <span>{packageHours} hours of expert tutoring</span>
              <span>•</span>
              <span className="font-semibold text-gray-900">{packagePrice}</span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          {showConsultation ? (
            <>
              <CalendlyPopup 
                url="https://calendly.com/sri-nextgenmedprep/30min"
                className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-all duration-300"
                utm={{
                  utmCampaign: 'ucat-calculator-custom',
                  utmSource: 'website',
                  utmMedium: 'calculator-result'
                }}
              >
                Book Free Consultation
              </CalendlyPopup>
              <a 
                href="#tutoring-packages"
                className="border-2 border-orange-600 text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 hover:text-white transition-all duration-300"
              >
                View All Packages
              </a>
            </>
          ) : (
            <>
              <a 
                href="#tutoring-packages"
                className={`${packageColor} text-white px-6 py-3 rounded-lg font-semibold ${packageHoverColor} transition-all duration-300`}
              >
                Get {packageName} Package
              </a>
              <CalendlyPopup 
                url="https://calendly.com/sri-nextgenmedprep/30min"
                className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
                utm={{
                  utmCampaign: 'ucat-calculator',
                  utmSource: 'website',
                  utmMedium: 'calculator-result'
                }}
              >
                Discuss Your Needs
              </CalendlyPopup>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className={`py-16 px-4 bg-gradient-to-br from-emerald-50 to-blue-50 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">UCAT Tutoring Hours Calculator</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find out how many tutoring hours you need to reach your target UCAT score
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Current UCAT Score (or Expected Score)
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="1800"
                  max="2700"
                  step="10"
                  value={currentScore}
                  onChange={(e) => setCurrentScore(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1800</span>
                  <span>2700</span>
                </div>
              </div>
              <div className="mt-3 text-center">
                <span className="text-2xl font-bold text-blue-600">{currentScore}</span>
                <p className="text-sm text-gray-500">Current Score</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Target UCAT Score
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="2200"
                  max="2700"
                  step="10"
                  value={targetScore}
                  onChange={(e) => setTargetScore(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>2200</span>
                  <span>2700</span>
                </div>
              </div>
              <div className="mt-3 text-center">
                <span className="text-2xl font-bold text-purple-600">{targetScore}</span>
                <p className="text-sm text-gray-500">Target Score</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <button
              onClick={calculateTutoringHours}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300"
            >
              Calculate Required Hours
            </button>
          </div>
          
          {renderResults()}
          
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This calculator provides an estimate based on typical score improvements. Individual results may vary based on starting ability, study habits, and commitment level.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UCATCalculator;