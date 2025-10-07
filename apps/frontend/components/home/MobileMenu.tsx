"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface MenuItem {
  title: string;
  href: string;
}

interface MegaMenuConfig {
  title: string;
  href?: string;
  items: MenuItem[];
}

interface MobileMenuProps {
  megaMenuItems: MegaMenuConfig[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ megaMenuItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setExpandedSection(null); // Reset expanded sections when opening menu
    }
  };

  const toggleSection = (title: string) => {
    setExpandedSection(expandedSection === title ? null : title);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setExpandedSection(null);
  };

  return (
    <div className="lg:hidden">
      {/* Hamburger Button */}
      <button 
        onClick={toggleMenu}
        className="focus:outline-none flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        aria-label="Toggle mobile menu"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={closeMenu}>
          <div 
            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <img
                  src="/NGMP logo.png"
                  alt="NextGenMedPrep Logo"
                  className="h-8 w-auto"
                />
                <span className="text-lg font-bold text-gradient-primary">
                  NextGenMedPrep
                </span>
              </div>
              <button
                onClick={closeMenu}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                aria-label="Close menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="overflow-y-auto h-full pb-20">
              <nav className="p-4">
                {megaMenuItems.map((menuConfig) => {
                  const isPrometheus = menuConfig.title === "Prometheus";
                  
                  return (
                    <div key={menuConfig.title} className="mb-2">
                      {menuConfig.href && menuConfig.items.length === 0 ? (
                        // Direct link without submenu
                        <Link
                          href={menuConfig.href}
                          className={`block w-full text-left p-3 rounded-lg font-medium transition-colors duration-200 ${
                            isPrometheus
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-md"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                          onClick={closeMenu}
                        >
                          {menuConfig.title}
                        </Link>
                      ) : (
                        // Section with submenu
                        <div>
                          <div className={`flex items-center rounded-lg overflow-hidden ${
                            isPrometheus 
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                              : "text-gray-700 hover:bg-gray-100"
                          }`}>
                            {/* Main title link */}
                            <Link
                              href={menuConfig.href || `/${menuConfig.title.toLowerCase().replace(/\s+/g, "-")}`}
                              className="flex-1 p-3 text-left font-medium transition-colors duration-200 hover:bg-black hover:bg-opacity-10"
                              onClick={closeMenu}
                            >
                              {menuConfig.title}
                            </Link>
                            
                            {/* Chevron button for submenu */}
                            {menuConfig.items.length > 0 && (
                              <button
                                onClick={() => toggleSection(menuConfig.title)}
                                className="p-3 hover:bg-black hover:bg-opacity-10 transition-colors duration-200"
                                aria-label={`Toggle ${menuConfig.title} submenu`}
                              >
                                <svg
                                  className={`h-5 w-5 transform transition-transform duration-200 ${
                                    expandedSection === menuConfig.title ? 'rotate-180' : ''
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            )}
                          </div>

                          {/* Submenu Items */}
                          {expandedSection === menuConfig.title && menuConfig.items.length > 0 && (
                            <div className="ml-4 mt-2 space-y-1">
                              {menuConfig.items.map((item) => (
                                <Link
                                  key={item.title}
                                  href={item.href}
                                  className={`block p-3 text-sm rounded-lg transition-colors duration-200 ${
                                    isPrometheus
                                      ? "text-purple-700 hover:text-purple-900 hover:bg-purple-50"
                                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                  }`}
                                  onClick={closeMenu}
                                >
                                  {item.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* Mobile Menu Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-3">Connect with us</p>
                  <div className="flex justify-center space-x-4">
                    {[
                      { name: 'Instagram', url: 'https://www.instagram.com/nextgenmedprep/' },
                      { name: 'Twitter', url: 'https://x.com/NextGenMedPrep' },
                      { name: 'TikTok', url: 'https://www.tiktok.com/@nextgenmedprep' },
                      { name: 'Facebook', url: 'https://www.facebook.com/people/NextGen-MedPrep/61566778581462/' },
                    ].map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        aria-label={social.name}
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          {social.name === 'Instagram' && (
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          )}
                          {social.name === 'Twitter' && (
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                          )}
                          {social.name === 'TikTok' && (
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                          )}
                          {social.name === 'Facebook' && (
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          )}
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;