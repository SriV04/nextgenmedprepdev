"use client";

import { useState } from 'react';

interface MegaMenuProps {
  title: string;
  items: string[];
}

const MegaMenu = ({ title, items }: MegaMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Determine if this is the Prometheus menu item or if there are no items
  const isPrometheus = title === "Prometheus";
  const hasItems = items.length > 0;

  const linkPath = `/${title.toLowerCase().replace(/\s+/g, "-")}`;

  const trigger = (
    <a
      href={linkPath}
      className={`px-2 py-1.5 mx-0.5 rounded-full transition-all duration-300 font-medium text-xs whitespace-nowrap flex items-center gap-1 ${
        isPrometheus
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-md"
          : "text-text-secondary hover:bg-background-accent"
      }`}
    >
      <span className="whitespace-nowrap">{title}</span>
      {hasItems && (
        <svg
          className={`w-3 h-3 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      )}
    </a>
  );

  if (!hasItems) {
    return <div className="relative group">{trigger}</div>;
  }
  
  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger */}
      {trigger}
      
      {/* Mega Menu Panel - Only render if there are items */}
      {hasItems && (
        <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 ${
          isPrometheus ? 'bg-gradient-to-br from-blue-50 to-purple-50' : 'bg-background-secondary'
        } border ${
          isPrometheus ? 'border-purple-200' : 'border-border-accent'
        } rounded-lg shadow-lg z-50 transition-all duration-300 ${
          isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
        }`}>
          <div className="p-3">
            <div className="grid gap-1">
              {items.map((item) => (
                <a
                  key={item}
                  href={`/${title.toLowerCase().replace(/\s+/g, '-')}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`block px-2 py-1.5 rounded-md transition-all duration-200 text-xs ${
                    isPrometheus 
                      ? 'text-purple-700 hover:text-purple-900 hover:bg-purple-100' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-background-accent'
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          
          {/* Arrow pointing up */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className={`w-4 h-4 rotate-45 ${
              isPrometheus 
                ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-l border-t border-purple-200' 
                : 'bg-background-secondary border-l border-t border-border-accent'
            }`}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MegaMenu;