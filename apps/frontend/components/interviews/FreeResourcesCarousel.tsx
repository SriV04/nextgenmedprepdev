'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Resource {
  title: string;
  description: string;
  image: string;
  downloadUrl: string;
}

interface FreeResourcesCarouselProps {
  resources?: Resource[];
}

const defaultResources: Resource[] = [
  {
    title: "Ultimate Guide to MMI",
    description: "Master Multiple Mini Interviews with comprehensive preparation strategies",
    image: "/guides/UGMMI.png",
    downloadUrl: "/resources/mmi"
  },
  {
    title: "Ultimate Guide to Panel Interviews", 
    description: "Excel in traditional medical school panel interviews",
    image: "/guides/UGPI.png",
    downloadUrl: "/resources/panel-interviews"
  },
  {
    title: "Ultimate Guide to Medical Ethics",
    description: "Navigate ethical scenarios in medical school interviews",
    image: "/guides/UGME.png",
    downloadUrl: "/resources/ultimate-ethics-guide"
  },
  {
    title: "Ultimate Medical Hot Topics",
    description: "Stay updated with the latest medical trends and topics",
    image: "/guides/UMHT.png",
    downloadUrl: "/resources/ultimate-medical-hot-topics"
  },
  {
    title: "Ultimate Guide to Medical Applications",
    description: "Complete guide to medical school applications",
    image: "/guides/UGAM.png",
    downloadUrl: "/resources/ultimate-medicine-application-guide"
  }
];

export default function FreeResourcesCarousel({ resources = defaultResources }: FreeResourcesCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(resources.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Free Interview Preparation Resources</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Download our comprehensive guides to boost your interview preparation
          </p>
        </div>
        
        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-3 gap-6 px-4">
                    {resources
                      .slice(slideIndex * itemsPerSlide, slideIndex * itemsPerSlide + itemsPerSlide)
                      .map((resource, index) => (
                        <div key={slideIndex * itemsPerSlide + index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                          {/* Thumbnail Image */}
                          <div className="relative h-64 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
                            <div className="relative w-32 h-48">
                              <Image
                                src={resource.image}
                                alt={resource.title}
                                fill
                                className="object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                              />
                            </div>
                            {/* Quick View Badge */}
                            <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              FREE
                            </div>
                          </div>
                          
                          {/* Content */}
                          <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                              {resource.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                              {resource.description}
                            </p>
                            
                            {/* Features */}
                            <div className="space-y-2 mb-6">
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="text-green-500">✓</span>
                                Expert-written content
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="text-green-500">✓</span>
                                Practical examples & scenarios
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="text-green-500">✓</span>
                                Proven strategies
                              </div>
                            </div>
                            
                            {/* Download Button */}
                            <Link 
                              href={resource.downloadUrl}
                              className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 group-hover:from-blue-700 group-hover:to-purple-700"
                            >
                              Download Free Guide
                            </Link>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10 disabled:opacity-50"
            disabled={currentSlide === 0}
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10 disabled:opacity-50"
            disabled={currentSlide === totalSlides - 1}
            aria-label="Next slide"
          >
            <ChevronRightIcon className="w-6 h-6 text-gray-600" />
          </button>
          
          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
