'use client';

import React, { useState } from 'react';
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
    location: 'London',
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
    location: 'London',
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
  const [selectedSchool, setSelectedSchool] = useState<MedicalSchool>(medicalSchools[0]);
  const [hoveredSchool, setHoveredSchool] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-12 items-start">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative h-full"
          style={{ filter: 'drop-shadow(0 10px 20px rgba(79, 70, 229, 0.3))' }}
        >
          <div className="w-full h-full min-h-[540px]">
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
                {({ geographies }) => {
                  // Make sure we explicitly return a React fragment with Geography elements inside
                  return (
                    <>
                      {geographies
                        .filter(geo => geo.properties.name === 'United Kingdom')
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
                        ))}
                    </>
                  );
                }}
              </Geographies>

              {medicalSchools.map(school => (
                <Marker key={school.id} coordinates={school.coordinates}>
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

                    {hoveredSchool === school.id ? (
                      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                        <rect
                          x={-44}
                          y={-30}
                          width="88"
                          height="22"
                          fill="rgba(10, 10, 20, 0.92)"
                          rx="6"
                          stroke="rgba(79, 70, 229, 0.5)"
                          strokeWidth="1"
                        />
                        <text textAnchor="middle" y={-15} fontSize="11" fill="white" fontWeight="bold">
                          {school.location}
                        </text>
                      </motion.g>
                    ) : null}
                  </g>
                </Marker>
              ))}
            </ComposableMap>
          </div>
        </motion.div>
      </div>

      <motion.div
        key={selectedSchool.id}
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-black p-8 rounded-lg border border-indigo-500/30">
          <motion.h3
            className="text-3xl font-bold mb-2 text-indigo-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {selectedSchool.name}
          </motion.h3>

          <motion.p
            className="text-gray-300 mb-6 text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {selectedSchool.description}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <h4 className="text-lg font-semibold text-purple-300 mb-2">Established</h4>
              <p className="text-gray-300">{selectedSchool.establishedYear}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <h4 className="text-lg font-semibold text-purple-300 mb-2">Specialties</h4>
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
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h4 className="text-lg font-semibold text-purple-300 mb-2">Entry Requirements</h4>
            <p className="text-gray-300 mb-4">{selectedSchool.admissionRequirements}</p>

            <h4 className="text-lg font-semibold text-purple-300 mb-2">Interview Format</h4>
            <p className="text-gray-300">{selectedSchool.interviewFormat}</p>
          </motion.div>

          <motion.div
            className="mt-6 pt-6 border-t border-indigo-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-6 rounded-lg border border-purple-500/20 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-purple-400 rounded-full mr-3 animate-pulse" />
                <h4 className="text-xl font-bold text-purple-300">Generate Mock Interview</h4>
              </div>

              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                Practice with AI-powered mock interviews specifically tailored for {selectedSchool.name}'s interview
                format and style.
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-400">
                  <svg className="w-4 h-4 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium text-purple-300">Prometheus</span>&nbsp;is fuelling
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Expected Launch</div>
                  <div className="text-sm font-bold text-orange-400">October 2025</div>
                </div>
              </div>

              <motion.button
                className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-purple-600/50 to-indigo-600/50 border border-purple-500/30 text-purple-200 rounded-lg transition-all font-semibold relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 hover:opacity-100 transition-opacity" />
                <span className="relative">Coming Soon - Mock Interview Generator</span>
              </motion.button>
            </div>

            <button className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors font-semibold">
              Learn More About {selectedSchool.location}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}