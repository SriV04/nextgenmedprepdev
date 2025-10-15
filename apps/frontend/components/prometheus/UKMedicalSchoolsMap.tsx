'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

interface MedicalSchool {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number];
  description: string;
  establishedYear: number;
  specialties: string[];
  admissionRequirements: string;
  interviewFormat: string;
}

const medicalSchools: MedicalSchool[] = [
  {
    id: 'oxford',
    name: 'University of Oxford',
    location: 'Oxford',
    coordinates: [-1.2577, 51.752],
    description:
      "One of the world's oldest and most prestigious medical schools, known for its tutorial system and cutting-edge research.",
    establishedYear: 1096,
    specialties: ['Clinical Medicine', 'Biomedical Sciences', 'Medical Research'],
    admissionRequirements: 'A*AA including Chemistry and Biology/Physics/Mathematics',
    interviewFormat: 'Multiple Mini Interviews (MMI) and traditional panel interviews',
  },
  {
    id: 'cambridge',
    name: 'University of Cambridge',
    location: 'Cambridge',
    coordinates: [0.1276, 52.2053],
    description: 'Renowned for academic excellence and innovative teaching methods in medical education.',
    establishedYear: 1209,
    specialties: ['Clinical Medicine', 'Veterinary Medicine', 'Medical Sciences'],
    admissionRequirements: 'A*A*A including Chemistry and Biology',
    interviewFormat: 'Traditional panel interviews with academic focus',
  },
  {
    id: 'imperial',
    name: 'Imperial College London',
    location: 'ICL',
    coordinates: [-0.1276, 51.5074],
    description: 'Leading institution in science, technology, and medicine with strong industry connections.',
    establishedYear: 1907,
    specialties: ['Medicine', 'Bioengineering', 'Public Health'],
    admissionRequirements: 'AAA including Chemistry and Biology',
    interviewFormat: 'Multiple Mini Interviews (MMI)',
  },
  {
    id: 'ucl',
    name: 'University College London',
    location: 'UCL',
    coordinates: [-0.134, 51.5246],
    description: 'Historic medical school with innovative curriculum and diverse student body.',
    establishedYear: 1826,
    specialties: ['Medicine', 'Medical Sciences', 'Global Health'],
    admissionRequirements: 'A*AA including Chemistry and Biology',
    interviewFormat: 'Multiple Mini Interviews (MMI)',
  },
  {
    id: 'edinburgh',
    name: 'University of Edinburgh',
    location: 'Edinburgh',
    coordinates: [-3.1883, 55.9533],
    description: "Scotland's premier medical school with a rich history and excellent research facilities.",
    establishedYear: 1583,
    specialties: ['Medicine', 'Veterinary Medicine', 'Biomedical Sciences'],
    admissionRequirements: 'AAA including Chemistry and Biology/Physics/Mathematics',
    interviewFormat: 'Multiple Mini Interviews (MMI)',
  },
  {
    id: 'glasgow',
    name: 'University of Glasgow',
    location: 'Glasgow',
    coordinates: [-4.2518, 55.8642],
    description: 'One of the oldest medical schools in the English speaking world.',
    establishedYear: 1451,
    specialties: ['Medicine', 'Dentistry', 'Veterinary Medicine'],
    admissionRequirements: 'AAA including Chemistry and Biology',
    interviewFormat: 'Multiple Mini Interviews (MMI)',
  },
  {
    id: 'manchester',
    name: 'University of Manchester',
    location: 'Manchester',
    coordinates: [-2.2426, 53.4808],
    description: 'Large medical school known for its research excellence and diverse programs.',
    establishedYear: 1824,
    specialties: ['Medicine', 'Dentistry', 'Pharmacy'],
    admissionRequirements: 'AAA including Chemistry and Biology',
    interviewFormat: 'Multiple Mini Interviews (MMI)',
  },
  {
    id: 'birmingham',
    name: 'University of Birmingham',
    location: 'Birmingham',
    coordinates: [-1.8904, 52.4862],
    description: 'First UK university to offer dentistry and medicine programs with strong clinical training.',
    establishedYear: 1900,
    specialties: ['Medicine', 'Dentistry', 'Medical Sciences'],
    admissionRequirements: 'AAA including Chemistry and Biology/Physics/Mathematics',
    interviewFormat: 'Multiple Mini Interviews (MMI)',
  },
  {
    id: 'bristol',
    name: 'University of Bristol',
    location: 'Bristol',
    coordinates: [-2.5879, 51.4545],
    description: 'Russell Group university with excellent medical and dental programs.',
    establishedYear: 1876,
    specialties: ['Medicine', 'Dentistry', 'Veterinary Sciences'],
    admissionRequirements: 'AAA including Chemistry and Biology',
    interviewFormat: 'Multiple Mini Interviews (MMI)',
  },
  {
    id: 'leeds',
    name: 'University of Leeds',
    location: 'Leeds',
    coordinates: [-1.5491, 53.8008],
    description: 'Well-established medical school with strong community links and clinical training.',
    establishedYear: 1904,
    specialties: ['Medicine', 'Dentistry', 'Healthcare Sciences'],
    admissionRequirements: 'AAA including Chemistry and Biology',
    interviewFormat: 'Multiple Mini Interviews (MMI)',
  },
  {
    id: 'cardiff',
    name: 'Cardiff University',
    location: 'Cardiff',
    coordinates: [-3.1791, 51.4816],
    description: 'Leading Welsh medical school with strong emphasis on community medicine and research.',
    establishedYear: 1893,
    specialties: ['Medicine', 'Dentistry', 'Pharmacy'],
    admissionRequirements: 'AAA including Chemistry and Biology',
    interviewFormat: 'Multiple Mini Interviews (MMI)',
  },
  {
    id: 'liverpool',
    name: 'University of Liverpool',
    location: 'Liverpool',
    coordinates: [-2.9916, 53.4084],
    description: 'Historic medical school known for tropical medicine and global health.',
    establishedYear: 1881,
    specialties: ['Medicine', 'Dentistry', 'Tropical Medicine'],
    admissionRequirements: 'AAA including Chemistry and Biology',
    interviewFormat: 'Multiple Mini Interviews (MMI)',
  },
  {
    id: 'newcastle',
    name: 'Newcastle University',
    location: 'Newcastle',
    coordinates: [-1.6178, 54.9783],
    description: 'Innovative medical school with strong clinical partnerships in the North East.',
    establishedYear: 1834,
    specialties: ['Medicine', 'Dentistry', 'Biomedical Sciences'],
    admissionRequirements: 'AAA including Chemistry and Biology',
    interviewFormat: 'Multiple Mini Interviews (MMI)',
  },
  {
    id: 'dundee',
    name: 'University of Dundee',
    location: 'Dundee',
    coordinates: [-2.9707, 56.462],
    description: 'Scottish medical school renowned for anatomy teaching and medical research.',
    establishedYear: 1967,
    specialties: ['Medicine', 'Dentistry', 'Life Sciences'],
    admissionRequirements: 'AAA including Chemistry and Biology',
    interviewFormat: 'Multiple Mini Interviews (MMI)',
  },
];

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
              {school.location}
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-8 items-start">
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
                return (
                <Marker key={String(school.id)} coordinates={roundedCoordinates}>
                  <g>
                    {selectedSchool.id === school.id ? (
                      <motion.circle
                        r="16"
                        fill="none"
                        stroke="rgba(79, 70, 229, 0.6)"
                        strokeWidth="2"
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 1.6, opacity: 0 }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    ) : null}

                    <motion.circle
                      r={selectedSchool.id === school.id ? 9 : 7}
                      fill={selectedSchool.id === school.id ? '#4F46E5' : '#6366F1'}
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer"
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setSelectedSchool(school)}
                      onMouseEnter={() => setHoveredSchool(school.id)}
                      onMouseLeave={() => setHoveredSchool(null)}
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
                          {school.location}
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
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h4 className="text-base font-semibold text-purple-300 mb-1">Entry Requirements</h4>
            <p className="text-gray-300 text-sm mb-3">{selectedSchool.admissionRequirements}</p>

            <h4 className="text-base font-semibold text-purple-300 mb-1">Interview Format</h4>
            <p className="text-gray-300 text-sm">{selectedSchool.interviewFormat}</p>
          </motion.div>

          <motion.div
            className="mt-4 pt-4 border-t border-indigo-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
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
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-green-300">Available Now</span>
                  </div>
                </div>

                <motion.a
                  href={`/interviews/payment?service=actual&package=essentials&university=${selectedSchool.id}`}
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
    </div>
  );
}