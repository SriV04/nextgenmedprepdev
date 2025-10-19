'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { universities } from '../../app/interviews/payment/data/packages';
import { ExtendedPackage } from '../../app/interviews/data/interviewPackages';

interface Step3UniversitiesProps {
  selectedUniversities: string[];
  selectedPackage: ExtendedPackage | null;
  onUniversityToggle: (universityId: string) => void;
  onProceedToNext: () => void;
}

export default function Step3Universities({ 
  selectedUniversities, 
  selectedPackage, 
  onUniversityToggle, 
  onProceedToNext 
}: Step3UniversitiesProps) {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Show 10 universities per page

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!selectedPackage) return null;

  // Filter universities based on search term
  const filteredUniversities = universities.filter(university =>
    university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    university.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUniversities = filteredUniversities.slice(startIndex, endIndex);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSearchSelect = (university: typeof universities[0]) => {
    onUniversityToggle(university.id);
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
    if (!showDropdown || filteredUniversities.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredUniversities.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredUniversities.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredUniversities.length) {
          handleSearchSelect(filteredUniversities[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Popular universities (most commonly selected)
  const popularUniversities = ['oxford', 'cambridge', 'imperial', 'ucl', 'kings'];

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Select <span className="text-gradient-aurora">Universities</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Choose up to {selectedPackage.interviews} universities (selected: {selectedUniversities.length})
        </p>

        {/* Search Bar */}
        {mounted && (
          <div className="relative max-w-md mx-auto mb-6">
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
            <AnimatePresence>
              {showDropdown && filteredUniversities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-black/95 border border-indigo-500/30 rounded-lg backdrop-blur-xl z-50 max-h-64 overflow-y-auto"
                >
                  {filteredUniversities.map((university, index) => (
                    <motion.button
                      key={university.id}
                      onClick={() => handleSearchSelect(university)}
                      className={`w-full px-4 py-3 text-left transition-colors border-b border-indigo-500/10 last:border-b-0 focus:outline-none ${
                        index === selectedIndex 
                          ? 'bg-indigo-500/30' 
                          : 'hover:bg-indigo-500/20 focus:bg-indigo-500/20'
                      } ${
                        selectedUniversities.includes(university.id)
                          ? 'bg-indigo-500/20 border-l-4 border-l-indigo-500'
                          : ''
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white flex items-center gap-2">
                            {university.name}
                            {selectedUniversities.includes(university.id) && (
                              <span className="text-indigo-400 text-sm">✓ Selected</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">{university.country}</div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {university.interviewTypes.slice(0, 2).map((type) => (
                            <span key={type} className="px-2 py-1 bg-gray-700/50 text-xs rounded text-gray-300">
                              {type.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* No Results */}
            <AnimatePresence>
              {showDropdown && searchTerm.length > 0 && filteredUniversities.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-black/95 border border-indigo-500/30 rounded-lg backdrop-blur-xl z-50 p-4 text-center text-gray-400"
                >
                  No universities found for "{searchTerm}"
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Popular Universities Pills */}
        {mounted && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <span className="text-sm text-gray-400 mr-2">Popular:</span>
            {popularUniversities.map((universityId) => {
              const university = universities.find(u => u.id === universityId);
              if (!university) return null;
              return (
                <motion.button
                  key={universityId}
                  onClick={() => onUniversityToggle(universityId)}
                  className={`px-3 py-1 text-sm rounded-full transition-all ${
                    selectedUniversities.includes(universityId)
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-1">
                    {university.displayName ? university.displayName : university.name.split(' ').slice(-1)[0]} {/* Show last word (e.g., "Oxford", "Cambridge") */}
                    {selectedUniversities.includes(universityId) && (
                      <span className="text-xs">✓</span>
                    )}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* University Selection Progress Bar */}
      {selectedUniversities.length > 0 && (
        <motion.div 
          className="mb-8 bg-black/40 rounded-lg p-4 border border-indigo-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Selection Progress</span>
            <span className="text-sm text-indigo-400 font-semibold">
              {selectedUniversities.length} of {selectedPackage.interviews}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(selectedUniversities.length / selectedPackage.interviews) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {selectedUniversities.length >= selectedPackage.interviews && (
            <motion.p 
              className="text-xs text-green-400 mt-2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ✓ Selection complete! You can proceed to the next step.
            </motion.p>
          )}
        </motion.div>
      )}

      {/* Top Continue Button */}
      <AnimatePresence>
        {selectedUniversities.length > 0 && (
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.button
              onClick={onProceedToNext}
              className="relative px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-xl shadow-indigo-500/25 overflow-hidden group"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated background overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-white/10 to-purple-600/0"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              
              <span className="relative z-10 flex items-center gap-2">
                Continue to Contact Details
                <motion.svg 
                  className="w-5 h-5"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </span>
            </motion.button>
            
            <motion.p 
              className="text-sm text-gray-400 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {selectedUniversities.length === 1 
                ? `1 university selected` 
                : `${selectedUniversities.length} universities selected`}
            </motion.p>

            {/* Selected Universities Summary */}
            <motion.div 
              className="mt-4 flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {selectedUniversities.map((universityId) => {
                const university = universities.find(u => u.id === universityId);
                if (!university) return null;
                return (
                  <motion.div
                    key={universityId}
                    className="flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm border border-indigo-500/30"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <span>{university.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUniversityToggle(universityId);
                      }}
                      className="text-indigo-400 hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedUniversities.map((university, index) => (
          <motion.button
            key={university.id}
            onClick={() => onUniversityToggle(university.id)}
            disabled={!selectedUniversities.includes(university.id) && selectedUniversities.length >= selectedPackage.interviews}
            className={`p-6 rounded-xl border-2 text-left transition-all feature-card relative overflow-hidden ${
              selectedUniversities.includes(university.id)
                ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/25'
                : !selectedUniversities.includes(university.id) && selectedUniversities.length >= selectedPackage.interviews
                ? 'border-gray-700 bg-gray-900/40 opacity-50 cursor-not-allowed'
                : 'border-gray-600 bg-black/40 hover:border-indigo-400 hover:bg-indigo-500/10'
            }`}
            whileHover={selectedUniversities.includes(university.id) || selectedUniversities.length < selectedPackage.interviews ? { y: -2, scale: 1.02 } : {}}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {/* Animated background for selected universities */}
            {selectedUniversities.includes(university.id) && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-lg font-semibold pr-2">{university.name}</h4>
                {selectedUniversities.includes(university.id) && (
                  <motion.div 
                    className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <span className="text-white text-sm">✓</span>
                  </motion.div>
                )}
              </div>
              
              <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                {university.country}
              </p>
              
              <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Interview Types</p>
                <div className="flex flex-wrap gap-2">
                  {university.interviewTypes.map((type) => (
                    <span key={type} className="px-3 py-1 bg-gray-700/60 text-xs rounded-full text-gray-300 border border-gray-600">
                      {type.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Popular badge for popular universities */}
              {popularUniversities.includes(university.id) && (
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                    Popular
                  </span>
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <motion.div 
          className="flex items-center justify-center gap-2 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Previous Button */}
          <motion.button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg transition-all ${
              currentPage === 1
                ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30'
            }`}
            whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
            whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          {/* Page Numbers */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              // Show first page, last page, current page, and pages around current
              const showPage = pageNum === 1 || 
                               pageNum === totalPages || 
                               Math.abs(pageNum - currentPage) <= 1;
              
              // Show ellipsis
              const showEllipsis = (pageNum === currentPage - 2 && currentPage > 3) ||
                                  (pageNum === currentPage + 2 && currentPage < totalPages - 2);

              if (showEllipsis) {
                return (
                  <span key={pageNum} className="px-3 py-2 text-gray-500">
                    ...
                  </span>
                );
              }

              if (!showPage && pageNum !== currentPage - 2 && pageNum !== currentPage + 2) {
                return null;
              }

              return (
                <motion.button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentPage === pageNum
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {pageNum}
                </motion.button>
              );
            })}
          </div>

          {/* Next Button */}
          <motion.button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg transition-all ${
              currentPage === totalPages
                ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30'
            }`}
            whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
            whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </motion.div>
      )}

      {/* Page Info */}
      {totalPages > 1 && (
        <motion.p 
          className="text-center text-sm text-gray-400 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Showing {startIndex + 1}-{Math.min(endIndex, filteredUniversities.length)} of {filteredUniversities.length} universities
        </motion.p>
      )}

      {/* Continue Button */}
      <AnimatePresence>
        {selectedUniversities.length > 0 && (
          <motion.div 
            className="text-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <motion.button
              onClick={onProceedToNext}
              className="relative px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-xl shadow-indigo-500/25 overflow-hidden group"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated background overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-white/10 to-purple-600/0"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              
              <span className="relative z-10 flex items-center gap-2">
                Continue to Contact Details
                <motion.svg 
                  className="w-5 h-5"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </span>
            </motion.button>
            
            <motion.p 
              className="text-sm text-gray-400 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {selectedUniversities.length === 1 
                ? `1 university selected` 
                : `${selectedUniversities.length} universities selected`}
            </motion.p>

            {/* Selected Universities Summary */}
            <motion.div 
              className="mt-4 flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {selectedUniversities.map((universityId) => {
                const university = universities.find(u => u.id === universityId);
                if (!university) return null;
                return (
                  <motion.div
                    key={universityId}
                    className="flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm border border-indigo-500/30"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <span>{university.name}</span>
                    <button
                      onClick={() => onUniversityToggle(universityId)}
                      className="text-indigo-400 hover:text-red-400 transition-colors"
                    >
                      ×
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}