"use client";

import React, { useState } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface UCATCalculatorProps {
  className?: string;
}

const UCATCalculator: React.FC<UCATCalculatorProps> = ({ className = "" }) => {
  const [currentScore, setCurrentScore] = useState<number>(2000);
  const [targetScore, setTargetScore] = useState<number>(2400);
  const [result, setResult] = useState<{
    hours: number;
    package: {
      id: string;
      name: string;
      hours: number;
      price: number;
      description: string;
    } | null;
    isCustom: boolean;
  } | null>(null);

  const packages = [
    { id: 'ucat_kickstart', name: 'Kickstart', hours: 4, price: 200, description: 'Build a solid foundation' },
    { id: 'ucat_advance', name: 'Advance', hours: 8, price: 375, description: 'Targeted improvement' },
    { id: 'ucat_mastery', name: 'Mastery', hours: 12, price: 575, description: 'Top 10% scores' },
    { id: 'ucat_elite', name: 'Elite', hours: 20, price: 800, description: 'Exceptional results' },
  ];

  const calculateHours = () => {
    const gap = targetScore - currentScore;
    
    let recommendedHours: number;
    
    if (gap <= 0) {
      // Already at or above target - maintenance
      recommendedHours = 4;
    } else if (gap <= 100) {
      // Small gap: 4 hours
      recommendedHours = 4;
    } else if (gap <= 200) {
      // Moderate gap: 4-8 hours depending on baseline
      recommendedHours = currentScore >= 2200 ? 4 : 8;
    } else if (gap <= 350) {
      // Significant gap: 8-12 hours
      recommendedHours = currentScore >= 2100 ? 8 : 12;
    } else if (gap <= 500) {
      // Large gap: 12-20 hours
      recommendedHours = currentScore >= 2000 ? 12 : 20;
    } else {
      // Very large gap: 20+ hours
      recommendedHours = 20;
    }

    // Adjust for high targets
    if (targetScore >= 2600 && recommendedHours < 12) {
      recommendedHours = 12;
    }
    if (targetScore >= 2700 && recommendedHours < 20) {
      recommendedHours = 20;
    }

    // Find matching package
    let matchedPackage = packages.find(p => p.hours >= recommendedHours) || packages[packages.length - 1];
    
    // Check if needs custom (beyond Elite)
    const isCustom = gap > 600 && currentScore < 1800;

    setResult({
      hours: recommendedHours,
      package: isCustom ? null : matchedPackage,
      isCustom
    });
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 2600) return 'Top 5%';
    if (score >= 2400) return 'Top 20%';
    if (score >= 2200) return 'Above avg';
    if (score >= 2000) return 'Average';
    return 'Below avg';
  };

  return (
    <section id="calculator" className={`py-20 px-6 bg-stone-100 ${className}`}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-amber-700 font-medium tracking-wide uppercase text-sm mb-3">
            Calculator
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
            How many hours do you need?
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Get a personalised estimate based on your current level and target score.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-10 mb-10">
              {/* Current Score */}
              <div>
                <div className="flex items-baseline justify-between mb-4">
                  <label className="text-sm font-medium text-slate-600">
                    Current / Expected Score
                  </label>
                  <span className="text-xs text-slate-400">{getScoreLabel(currentScore)}</span>
                </div>
                
                <div className="mb-4">
                  <span className="text-4xl font-semibold text-slate-900">{currentScore}</span>
                </div>
                
                <input
                  type="range"
                  min="1500"
                  max="2700"
                  step="10"
                  value={currentScore}
                  onChange={(e) => {
                    setCurrentScore(Number(e.target.value));
                    setResult(null);
                  }}
                  className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-slate-900
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:transition-transform
                    [&::-webkit-slider-thumb]:hover:scale-110
                    [&::-moz-range-thumb]:w-5
                    [&::-moz-range-thumb]:h-5
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-slate-900
                    [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>1500</span>
                  <span>2700</span>
                </div>
              </div>
              
              {/* Target Score */}
              <div>
                <div className="flex items-baseline justify-between mb-4">
                  <label className="text-sm font-medium text-slate-600">
                    Target Score
                  </label>
                  <span className="text-xs text-amber-600 font-medium">{getScoreLabel(targetScore)}</span>
                </div>
                
                <div className="mb-4">
                  <span className="text-4xl font-semibold text-amber-600">{targetScore}</span>
                </div>
                
                <input
                  type="range"
                  min="1900"
                  max="2700"
                  step="10"
                  value={targetScore}
                  onChange={(e) => {
                    setTargetScore(Number(e.target.value));
                    setResult(null);
                  }}
                  className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-amber-500
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:transition-transform
                    [&::-webkit-slider-thumb]:hover:scale-110
                    [&::-moz-range-thumb]:w-5
                    [&::-moz-range-thumb]:h-5
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-amber-500
                    [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>1900</span>
                  <span>2700</span>
                </div>
              </div>
            </div>
            
            {/* Score gap indicator */}
            <div className="flex items-center justify-center gap-6 py-6 border-y border-slate-100 mb-8">
              <div className="text-center">
                <span className="text-sm text-slate-500">Gap</span>
                <div className="text-2xl font-semibold text-slate-900">
                  {targetScore - currentScore > 0 ? `+${targetScore - currentScore}` : targetScore - currentScore}
                </div>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-center">
                <span className="text-sm text-slate-500">Points needed</span>
                <div className="text-2xl font-semibold text-slate-900">
                  {Math.max(0, targetScore - currentScore)}
                </div>
              </div>
            </div>
            
            <button
              onClick={calculateHours}
              className="w-full py-4 bg-slate-900 text-white rounded-full font-medium text-lg hover:bg-slate-800 transition-colors"
            >
              Calculate Hours
            </button>
          </div>
          
          {/* Results */}
          {result && (
            <div className="border-t border-slate-200 bg-slate-50 p-8 md:p-10">
              {targetScore <= currentScore ? (
                <div className="text-center">
                  <p className="text-slate-600 mb-4">
                    You're already at your target! We recommend our <strong>Kickstart</strong> package 
                    to maintain your score and build confidence.
                  </p>
                  <a
                    href="/ucat/payment?package=ucat_kickstart"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors"
                  >
                    Get Kickstart
                    <ArrowRightIcon className="w-4 h-4" />
                  </a>
                </div>
              ) : result.isCustom ? (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                    Custom plan recommended
                  </div>
                  <p className="text-slate-600 mb-6">
                    Based on your goals, we recommend a personalised consultation to create 
                    a custom tutoring plan tailored to your needs.
                  </p>
                  <a
                    href="#packages"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors"
                  >
                    View All Packages
                    <ArrowRightIcon className="w-4 h-4" />
                  </a>
                </div>
              ) : result.package && (
                <div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Recommended</p>
                      <h3 className="text-2xl font-semibold text-slate-900 mb-1">
                        {result.package.name}
                      </h3>
                      <p className="text-slate-600">{result.package.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-3xl font-semibold text-slate-900">{result.package.hours}</div>
                        <div className="text-sm text-slate-500">hours</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-semibold text-amber-600">£{result.package.price}</div>
                        <div className="text-sm text-slate-500">total</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <a
                      href={`/ucat/payment?package=${result.package.id}`}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors"
                    >
                      Get {result.package.name}
                      <ArrowRightIcon className="w-4 h-4" />
                    </a>
                    <a
                      href="#packages"
                      className="inline-flex items-center justify-center px-6 py-3 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                    >
                      Compare all packages
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <p className="text-center text-sm text-slate-400 mt-6">
          Estimates based on typical score improvements. Individual results vary based on 
          commitment and study habits.
        </p>
      </div>
    </section>
  );
};

export default UCATCalculator;