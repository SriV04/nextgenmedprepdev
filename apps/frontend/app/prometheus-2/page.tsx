'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Satellite, Play, Search, X } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import Link from 'next/link';

// Medical Schools Data
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
    description: "One of the world's oldest and most prestigious medical schools, known for its tutorial system and cutting-edge research.",
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

// Prometheus — Satellite Command Center
export default function PrometheusSatelliteLanding() {
  const [palette, setPalette] = useState('prometheus');
  const [mounted, setMounted] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<MedicalSchool>(medicalSchools[0]);
  const [hoveredSchool, setHoveredSchool] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [unlockedTopics, setUnlockedTopics] = useState(medicalSchools.length);

  useEffect(() => {
    setMounted(true);
  }, []);

  const palettes = {
    prometheus: {
      '--bg': '#04122b',
      '--accent': '#00f0ff',
      '--warm': '#ffb648',
      '--muted': '#90a0b8'
    },
    ocean: {
      '--bg': '#021829',
      '--accent': '#ff6b6b',
      '--warm': '#ffd9b6',
      '--muted': '#e6f6ff'
    },
    navy: {
      '--bg': '#061227',
      '--accent': '#ff7a00',
      '--warm': '#f6eecb',
      '--muted': '#d9cebf'
    },
    midnight: {
      '--bg': '#010417',
      '--accent': '#6df7a2',
      '--warm': '#ffc957',
      '--muted': '#cfeee8'
    }
  };

  const setPaletteVars = (p: string) => {
    const vars = palettes[p as keyof typeof palettes];
    for (const k in vars) document.documentElement.style.setProperty(k, vars[k as keyof typeof vars]);
    setPalette(p);
  };

  useEffect(() => setPaletteVars(palette), []);

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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#04122b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Initializing Satellite Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white antialiased" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.35), transparent), var(--bg)' }}>
      {/* Top HUD */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center backdrop-blur-sm shadow-lg">
            <Monitor className="w-6 h-6 text-[color:var(--accent)]" />
          </div>
          <div>
            <div className="text-sm text-[color:var(--muted)]">PROMETHEUS</div>
            <div className="text-lg font-semibold">Satellite Command Center</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-[color:var(--muted)] hidden sm:block">Theme</div>
          <div className="flex gap-2">
            <button onClick={() => setPaletteVars('prometheus')} className="w-8 h-8 rounded-full ring-1 ring-white/10 hover:ring-white/30 transition-all" style={{ background: 'linear-gradient(135deg,#001025,#002c3a)' }}></button>
            <button onClick={() => setPaletteVars('ocean')} className="w-8 h-8 rounded-full ring-1 ring-white/10 hover:ring-white/30 transition-all" style={{ background: 'linear-gradient(135deg,#00303a,#3b2b2b)'}}></button>
            <button onClick={() => setPaletteVars('navy')} className="w-8 h-8 rounded-full ring-1 ring-white/10 hover:ring-white/30 transition-all" style={{ background: 'linear-gradient(135deg,#071228,#3a1f00)'}}></button>
            <button onClick={() => setPaletteVars('midnight')} className="w-8 h-8 rounded-full ring-1 ring-white/10 hover:ring-white/30 transition-all" style={{ background: 'linear-gradient(135deg,#00121b,#00301f)'}}></button>
          </div>
        </div>
      </header>

      {/* Main Hero */}
      <main className="px-6 lg:px-24 py-8">
        <section className="w-full relative mb-12">
          <div className="rounded-2xl overflow-hidden border border-white/6 bg-black/20 p-6 md:p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--warm)] bg-clip-text text-transparent">
                  Satellite Command Center
                </h1>
                <p className="mt-3 text-[color:var(--muted)] max-w-2xl text-lg">
                  A state-of-the-art medical interview question bank — delivered from orbit. University-sourced questions, adaptive difficulty, and satellite-driven progress visuals.
                </p>

                <div className="mt-6 flex flex-wrap gap-4">
                  <Link href="/get-started">
                    <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--warm)] text-black font-semibold shadow-xl transform hover:scale-[1.02] transition">
                      Start Simulated Interview
                    </button>
                  </Link>
                  <button className="px-5 py-3 rounded-xl border border-white/10 text-[color:var(--muted)] flex items-center gap-2 hover:bg-white/5 transition">
                    Demo Video <Play className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FeatureCard title="University-sourced" desc="Curated questions from top medical schools" icon={<Satellite className="w-5 h-5 text-[color:var(--accent)]" />} />
                  <FeatureCard title="Adaptive" desc="Difficulty evolves with your progress" icon={<Monitor className="w-5 h-5 text-[color:var(--accent)]" />} />
                </div>
              </div>

              {/* HUD quick stats */}
              <div className="w-full lg:w-44 text-center lg:text-right bg-black/20 lg:bg-transparent rounded-lg p-4 lg:p-0 border lg:border-0 border-white/5">
                <div className="text-xs text-[color:var(--muted)]">Connected Satellites</div>
                <div className="mt-2 text-3xl font-bold text-[color:var(--accent)]">{unlockedTopics}</div>
                <div className="mt-4 text-xs text-[color:var(--muted)]">Active Universities</div>
                <div className="mt-2 text-lg font-semibold">{medicalSchools.length}</div>
              </div>
            </div>

            {/* Scanning HUD overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <ScanningHUD />
            </div>
          </div>
        </section>

        {/* UK Medical Schools Satellite View */}
        <section className="w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--warm)] bg-clip-text text-transparent">
                UK Medical Schools Orbital Network
              </span>
            </h2>
            <p className="text-[color:var(--muted)] text-lg">
              Select a university to access satellite-powered interview intelligence
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search universities..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 pl-12 bg-black/50 border border-[color:var(--accent)]/30 rounded-lg text-white placeholder-gray-400 focus:border-[color:var(--accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20 transition-all"
                onFocus={() => setShowDropdown(searchTerm.length > 0)}
                onBlur={() => {
                  setTimeout(() => setShowDropdown(false), 200);
                }}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setShowDropdown(false);
                    setSelectedIndex(-1);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {showDropdown && filteredSchools.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-black/95 border border-[color:var(--accent)]/30 rounded-lg backdrop-blur-xl z-50 max-h-64 overflow-y-auto"
              >
                {filteredSchools.map((school, index) => (
                  <motion.button
                    key={school.id}
                    onClick={() => handleSearchSelect(school)}
                    className={`w-full px-4 py-3 text-left transition-colors border-b border-white/5 last:border-b-0 focus:outline-none ${
                      index === selectedIndex 
                        ? 'bg-[color:var(--accent)]/30' 
                        : 'hover:bg-[color:var(--accent)]/20 focus:bg-[color:var(--accent)]/20'
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{school.name}</div>
                        <div className="text-sm text-gray-400">{school.location}</div>
                      </div>
                      <div className="text-xs text-[color:var(--accent)]">{school.establishedYear}</div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {showDropdown && searchTerm.length > 0 && filteredSchools.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 bg-black/95 border border-[color:var(--accent)]/30 rounded-lg backdrop-blur-xl z-50 p-4 text-center text-gray-400"
              >
                No universities found for &quot;{searchTerm}&quot;
              </motion.div>
            )}
          </div>

          {/* Quick Access Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <span className="text-sm text-[color:var(--muted)] mr-2 hidden sm:inline">Popular:</span>
            {['oxford', 'cambridge', 'imperial', 'ucl', 'edinburgh'].map((schoolId) => {
              const school = medicalSchools.find(s => s.id === schoolId);
              if (!school) return null;
              return (
                <motion.button
                  key={schoolId}
                  onClick={() => setSelectedSchool(school)}
                  className={`px-3 py-1 text-sm rounded-full transition-all ${
                    selectedSchool.id === schoolId
                      ? 'bg-[color:var(--accent)] text-black'
                      : 'bg-[color:var(--accent)]/20 text-[color:var(--accent)] hover:bg-[color:var(--accent)]/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {school.location}
                </motion.button>
              );
            })}
          </div>

          {/* Main Map + Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-8">
            {/* UK Map with Satellites */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-white/6 bg-black/20 p-4">
                <div className="relative w-full aspect-square max-w-2xl mx-auto">
                  <UKMapWithSatellites 
                    selectedSchool={selectedSchool}
                    setSelectedSchool={setSelectedSchool}
                    hoveredSchool={hoveredSchool}
                    setHoveredSchool={setHoveredSchool}
                  />
                </div>
              </div>
            </div>

            {/* School Info Panel */}
            <motion.div
              key={selectedSchool.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-br from-black/40 to-black/20 border border-white/6 rounded-2xl p-6 backdrop-blur-sm">
                <motion.h3
                  className="text-2xl md:text-3xl font-bold mb-2 text-[color:var(--accent)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {selectedSchool.name}
                </motion.h3>

                <motion.p
                  className="text-[color:var(--muted)] mb-4 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {selectedSchool.description}
                </motion.p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <h4 className="text-sm font-semibold text-[color:var(--warm)] mb-1">Established</h4>
                    <p className="text-white font-bold">{selectedSchool.establishedYear}</p>
                  </motion.div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <h4 className="text-sm font-semibold text-[color:var(--warm)] mb-1">Interview Type</h4>
                    <p className="text-white text-sm">{selectedSchool.interviewFormat.split(' ')[0]}</p>
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  <h4 className="text-sm font-semibold text-[color:var(--warm)] mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedSchool.specialties.map(specialty => (
                      <span
                        key={specialty}
                        className="px-2 py-1 bg-[color:var(--accent)]/20 text-[color:var(--accent)] rounded-full text-xs border border-[color:var(--accent)]/20"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  className="pt-4 border-t border-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <h4 className="text-sm font-semibold text-[color:var(--warm)] mb-2">Entry Requirements</h4>
                  <p className="text-white text-sm mb-3">{selectedSchool.admissionRequirements}</p>

                  <h4 className="text-sm font-semibold text-[color:var(--warm)] mb-2">Interview Format</h4>
                  <p className="text-white text-sm">{selectedSchool.interviewFormat}</p>
                </motion.div>

                <motion.div
                  className="mt-4 pt-4 border-t border-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="bg-gradient-to-r from-[color:var(--accent)]/10 to-[color:var(--warm)]/10 p-4 rounded-lg border border-[color:var(--accent)]/20 mb-4">
                    <div className="flex items-center mb-3">
                      <div className="w-2 h-2 bg-[color:var(--accent)] rounded-full mr-2 animate-pulse" />
                      <h4 className="text-lg font-bold text-[color:var(--accent)]">Generate Mock Interview</h4>
                    </div>

                    <p className="text-[color:var(--muted)] text-sm mb-3 leading-relaxed">
                      Practice with AI-powered mock interviews specifically tailored for {selectedSchool.name}&apos;s interview format and style.
                    </p>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center text-[color:var(--muted)]">
                        <Satellite className="w-3 h-3 mr-1 text-[color:var(--accent)]" />
                        <span className="font-medium text-[color:var(--accent)]">Prometheus</span>&nbsp;is fuelling
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-500 uppercase tracking-wide">Expected Launch</div>
                        <div className="text-xs font-bold text-[color:var(--warm)]">October 2025</div>
                      </div>
                    </div>

                    <motion.button
                      className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-[color:var(--accent)]/30 to-[color:var(--warm)]/30 border border-[color:var(--accent)]/30 text-[color:var(--accent)] rounded-lg transition-all font-semibold text-sm relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled
                    >
                      <span className="relative">Coming Soon - Mock Interview Generator</span>
                    </motion.button>
                  </div>

                  <Link href="/get-started">
                    <button className="w-full px-4 py-3 bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--warm)] text-black rounded-lg transition-all font-semibold hover:scale-[1.02]">
                      Access {selectedSchool.location} Questions
                    </button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Statistics Section */}
      <section className="px-6 lg:px-24 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--warm)] bg-clip-text text-transparent">
              Mission Statistics
            </span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <StatCard icon="❓" label="Practice Questions" value="3500+" color="var(--accent)" />
          <StatCard icon="🏫" label="Universities Covered" value={String(medicalSchools.length)} color="var(--warm)" />
          <StatCard icon="⭐" label="Success Rate" value="94%" color="var(--accent)" />
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="px-6 lg:px-24 py-8">
        <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-black/40 to-transparent border border-white/6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-sm text-[color:var(--muted)]">Launch Readiness</div>
            <div className="text-xl md:text-2xl font-bold">Be interview-ready with university-level questions</div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <Link href="/get-started" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--warm)] text-black font-semibold hover:scale-[1.02] transition-transform">
                Get Started
              </button>
            </Link>
            <button className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/10 text-[color:var(--muted)] hover:bg-white/5 transition">
              Request University Access
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="bg-black/10 rounded-lg p-3 border border-white/4 flex items-start gap-3 hover:bg-black/20 transition">
      <div className="w-10 h-10 rounded-md bg-black/20 flex items-center justify-center flex-shrink-0">{icon}</div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-[color:var(--muted)]">{desc}</div>
      </div>
    </div>
  );
}

function ScanningHUD() {
  return (
    <>
      <div className="absolute inset-0">
        <svg className="w-full h-full mix-blend-screen opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.0" />
              <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="100" height="100" fill="url(#g1)" />
        </svg>

        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full bg-[linear-gradient(180deg,transparent_30%,rgba(0,0,0,0.15))]" />
        </div>
      </div>

      {/* scanning lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-[repeating-linear-gradient(0deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02) 1px, transparent 1px, transparent 20px)] animate-scan" />
      </div>

      <style>{`
        @keyframes scan { from { background-position: 0 0 } to { background-position: 0 40px } }
        .animate-scan { animation: scan 6s linear infinite; }
      `}</style>
    </>
  );
}

function UKMapWithSatellites({ 
  selectedSchool, 
  setSelectedSchool, 
  hoveredSchool, 
  setHoveredSchool 
}: {
  selectedSchool: MedicalSchool;
  setSelectedSchool: (school: MedicalSchool) => void;
  hoveredSchool: string | null;
  setHoveredSchool: (id: string | null) => void;
}) {
  return (
    <div className="relative w-full h-full">
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
                  fill="rgba(0, 240, 255, 0.08)"
                  stroke="rgba(0, 240, 255, 0.3)"
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
          const roundedCoordinates: [number, number] = [
            Math.round(school.coordinates[0] * 10000) / 10000,
            Math.round(school.coordinates[1] * 10000) / 10000
          ];
          return (
            <Marker key={school.id} coordinates={roundedCoordinates}>
              <g>
                {selectedSchool.id === school.id && (
                  <motion.circle
                    r="16"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <motion.circle
                  r={selectedSchool.id === school.id ? 9 : 6}
                  fill={selectedSchool.id === school.id ? 'var(--accent)' : 'var(--accent)'}
                  fillOpacity={selectedSchool.id === school.id ? 1 : 0.6}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer"
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setSelectedSchool(school)}
                  onMouseEnter={() => setHoveredSchool(school.id)}
                  onMouseLeave={() => setHoveredSchool(null)}
                />

                {/* Satellite beam effect for selected */}
                {selectedSchool.id === school.id && (
                  <SatelliteBeam />
                )}

                {hoveredSchool === school.id && (
                  <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    <rect
                      x={-50}
                      y={-32}
                      width="100"
                      height="26"
                      fill="rgba(4, 18, 43, 0.95)"
                      rx="6"
                      stroke="var(--accent)"
                      strokeWidth="1"
                    />
                    <text textAnchor="middle" y={-15} fontSize="14" fill="white" fontWeight="bold">
                      {school.location}
                    </text>
                  </motion.g>
                )}
              </g>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}

function SatelliteBeam() {
  return (
    <g className="pointer-events-none">
      <motion.line
        x1="0"
        y1="-50"
        x2="0"
        y2="0"
        stroke="var(--accent)"
        strokeWidth="1"
        strokeOpacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <motion.circle
        cx="0"
        cy="-50"
        r="4"
        fill="var(--accent)"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      />
    </g>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <motion.div
      className="bg-black/20 border border-white/6 rounded-2xl p-6 text-center hover:border-white/10 transition-all"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <div className="text-3xl font-bold mb-2" style={{ color }}>{value}</div>
      <div className="text-sm text-[color:var(--muted)]">{label}</div>
    </motion.div>
  );
}
