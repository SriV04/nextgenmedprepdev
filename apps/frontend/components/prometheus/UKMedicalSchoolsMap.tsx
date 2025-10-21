'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { medicalSchools, type MedicalSchool } from '@/data/universities';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export default function UKMedicalSchoolsMap() {
  const [mounted, setMounted] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<MedicalSchool>(medicalSchools[0]);
  const [hoveredSchool, setHoveredSchool] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter schools based on search term
  const filteredSchools = medicalSchools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchSelect = (school: MedicalSchool) => {
    setSelectedSchool(school);
    setSearchTerm('');
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || filteredSchools.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSchools.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSchools.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredSchools.length) {
          handleSearchSelect(filteredSchools[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Prevent hydration mismatch by only rendering on client
  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="relative max-w-md mx-auto px-4 sm:px-0">
          <div className="relative">
            <div className="w-full px-4 py-3 pl-12 bg-black/50 border border-indigo-500/30 rounded-lg text-white placeholder-gray-400 animate-pulse">
              Loading search...
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-8 items-start">
          <div className="relative">
            <div className="w-full h-full min-h-[440px] bg-black/20 animate-pulse rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Loading map...</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-black p-6 rounded-lg border border-indigo-500/30 animate-pulse">
              <div className="h-8 bg-indigo-400/20 rounded mb-4"></div>
              <div className="h-20 bg-gray-700/20 rounded mb-6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto px-4 sm:px-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search universities..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 pl-12 bg-black/50 border border-indigo-500/30 rounded-lg text-white placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-base"
            onFocus={() => setShowDropdown(searchTerm.length > 0)}
            onBlur={() => {
              // Delay hiding dropdown to allow clicks
              setTimeout(() => setShowDropdown(false), 200);
            }}
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          
          {/* Clear Button */}
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setShowDropdown(false);
                setSelectedIndex(-1);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-white transition-colors"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Search Dropdown */}
        {showDropdown && filteredSchools.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-black/95 border border-indigo-500/30 rounded-lg backdrop-blur-xl z-50 max-h-64 overflow-y-auto"
          >
            {filteredSchools.map((school, index) => (
              <motion.button
                key={school.id}
                onClick={() => handleSearchSelect(school)}
                className={`w-full px-4 py-3 text-left transition-colors border-b border-indigo-500/10 last:border-b-0 focus:outline-none ${
                  index === selectedIndex 
                    ? 'bg-indigo-500/30' 
                    : 'hover:bg-indigo-500/20 focus:bg-indigo-500/20'
                }`}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{school.name}</div>
                    <div className="text-sm text-gray-400">{school.location}</div>
                  </div>
                  <div className="text-xs text-indigo-300">{school.establishedYear}</div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* No Results */}
        {showDropdown && searchTerm.length > 0 && filteredSchools.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-2 bg-black/95 border border-indigo-500/30 rounded-lg backdrop-blur-xl z-50 p-4 text-center text-gray-400"
          >
            No universities found for "{searchTerm}"
          </motion.div>
        )}
      </div>

      {/* Quick Access Pills */}
      <div className="flex flex-wrap justify-center gap-2 px-4">
        <span className="text-sm text-gray-400 mr-2">Popular:</span>
        {['oxford', 'cambridge', 'imperial', 'ucl', 'edinburgh'].map((schoolId) => {
          const school = medicalSchools.find(s => s.id === schoolId);
          if (!school) return null;
          return (
            <motion.button
              key={schoolId}
              onClick={() => setSelectedSchool(school)}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                selectedSchool.id === schoolId
                  ? 'bg-indigo-500 text-white'
                  : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {school.displayName}
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-2 lg:gap-8 items-start">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative h-full"
          style={{ filter: 'drop-shadow(0 10px 20px rgba(79, 70, 229, 0.3))' }}
        >
          <div className="w-full h-full min-h-[440px]">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 3200,
                center: [-2.5, 54.5],
              }}
              width={960}
              height={960}
              style={{ width: '100%', height: '100%' }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies
                    .filter(geo => geo.properties?.name === 'United Kingdom')
                    .map(geo => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo} 
                        fill="rgba(79, 70, 229, 0.12)"
                        stroke="rgba(129, 140, 248, 0.45)"
                        strokeWidth={0.8}
                        style={{
                          default: { outline: 'none' },
                          hover: { outline: 'none' },
                          pressed: { outline: 'none' },
                        }}
                      />
                    ))
                }
              </Geographies>

              {medicalSchools.map(school => {
                // Round coordinates to prevent hydration mismatch
                const roundedCoordinates: [number, number] = [
                  Math.round(school.coordinates[0] * 10000) / 10000,
                  Math.round(school.coordinates[1] * 10000) / 10000
                ];
                // Bigger circles on mobile
                const isSelected = selectedSchool.id === school.id;
                const mobileRadius = isSelected ? 14 : 11;
                const desktopRadius = isSelected ? 9 : 7;
                
                return (
                <Marker key={String(school.id)} coordinates={roundedCoordinates}>
                  <g>
                    {isSelected ? (
                      <motion.circle
                        r="24"
                        fill="none"
                        stroke="rgba(79, 70, 229, 0.6)"
                        strokeWidth="2"
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 1.6, opacity: 0 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="hidden md:block"
                      />
                    ) : null}
                    
                    {isSelected ? (
                      <motion.circle
                        r="20"
                        fill="none"
                        stroke="rgba(79, 70, 229, 0.6)"
                        strokeWidth="2"
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="md:hidden"
                      />
                    ) : null}

                    {/* Desktop circles */}
                    <motion.circle
                      r={desktopRadius}
                      fill={isSelected ? '#4F46E5' : '#6366F1'}
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer hidden md:block"
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setSelectedSchool(school)}
                      onMouseEnter={() => setHoveredSchool(school.id)}
                      onMouseLeave={() => setHoveredSchool(null)}
                    />
                    
                    {/* Mobile circles - bigger and easier to tap */}
                    <motion.circle
                      r={mobileRadius}
                      fill={isSelected ? '#4F46E5' : '#6366F1'}
                      stroke="white"
                      strokeWidth="2.5"
                      className="cursor-pointer md:hidden"
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setSelectedSchool(school)}
                    />

                    {/* School Info Tooltip */}
                    {hoveredSchool === school.id ? (
                      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                        <rect
                          x={-50}
                          y={-32}
                          width="100"
                          height="26"
                          fill="rgba(10, 10, 20, 0.92)"
                          rx="6"
                          stroke="rgba(79, 70, 229, 0.5)"
                          strokeWidth="1"
                        />
                        <text textAnchor="middle" y={-15} fontSize="14" fill="white" fontWeight="bold">
                          {school.displayName}
                        </text>
                      </motion.g>
                    ) : null}
                  </g>
                </Marker>
                );
              })}
            </ComposableMap>
          </div>
        </motion.div>
      </div>

      <motion.div
        key={selectedSchool.id}
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-black p-6 rounded-lg border border-indigo-500/30">
          <motion.h3
            className="text-2xl font-bold mb-2 text-indigo-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {selectedSchool.name}
          </motion.h3>

          <motion.p
            className="text-gray-300 mb-4 text-base leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {selectedSchool.description}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <h4 className="text-base font-semibold text-purple-300 mb-1">Established</h4>
              <p className="text-gray-300">{selectedSchool.establishedYear}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <h4 className="text-base font-semibold text-purple-300 mb-1">Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSchool.specialties.map(specialty => (
                  <span
                    key={specialty}
                    className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-4 pt-4 border-t border-indigo-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-black p-5 rounded-xl border border-purple-500/30 mb-4 relative overflow-hidden">
              {/* Animated background glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center mb-3">
                  <motion.div 
                    className="w-3 h-3 bg-purple-400 rounded-full mr-3"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <h4 className="text-lg font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
                    Generate Mock Interview
                  </h4>
                </div>

                <p className="text-gray-300 mb-3 text-sm leading-relaxed">
                  Practice with AI-powered mock interviews specifically tailored for {String(selectedSchool.name)}'s interview
                  format and style.
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-400">
                    <svg className="w-4 h-4 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium text-purple-300">Prometheus</span>&nbsp;powered
                  </div>
                  {/* Hide "Available Now" badge on mobile */}
                  <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-green-300">Available Now</span>
                  </div>
                </div>

                <motion.a
                  href={`/interviews/payment?service=live&package=essentials&university=${selectedSchool.id}`}
                  className="group w-full px-5 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-xl font-bold text-center relative overflow-hidden block shadow-lg shadow-purple-500/50"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Animated shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ['-200%', '200%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Button content */}
                  <div className="relative flex items-center justify-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generate Mock Interview</span>
                    <svg 
                      className="w-5 h-5 transition-transform group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-pink-400/30 to-indigo-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.a>
              </div>
            </div>

            <button className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors font-semibold">
              Learn More About {String(selectedSchool.location)}
            </button>
          </motion.div>
        </div>
      </motion.div>
      </div>

      {/* Entry Requirements Section - Below Map */}
      <motion.div
        key={`requirements-${selectedSchool.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-black p-6 md:p-8 rounded-xl border border-indigo-500/30"
      >
        <div className="flex items-center mb-6">
          <svg className="w-6 h-6 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-2xl font-bold text-indigo-400">
            Entry Requirements for {selectedSchool.name}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* A-Level Requirements */}
          <motion.div 
            className="bg-black/30 p-5 rounded-lg border border-indigo-500/20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-start mb-3">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-purple-300 mb-2">A-Level Requirements</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{selectedSchool.admissionRequirements}</p>
              </div>
            </div>
          </motion.div>

          {/* UCAT Requirements */}
          <motion.div 
            className="bg-black/30 p-5 rounded-lg border border-purple-500/20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-start mb-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-purple-300 mb-2">UCAT Requirement</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{selectedSchool.ucatRequirement}</p>
                {selectedSchool.ucatRequirement !== 'Not required - uses BMAT instead' && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-cyan-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>Competitive scores are typically higher</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Interview Format */}
          <motion.div 
            className="bg-black/30 p-5 rounded-lg border border-pink-500/20 md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-start mb-3">
              <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-pink-300 mb-2">Interview Format</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{selectedSchool.interviewFormat}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Info Box */}
        <motion.div 
          className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-start">
            <svg className="w-5 h-5 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-indigo-300">Please Note:</span> These requirements are typical for entry but may vary by year and specific circumstances. Always check the official university website for the most up-to-date information.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}