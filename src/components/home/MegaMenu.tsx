"use client";

import { useState } from 'react';

interface MegaMenuProps {
  title: string;
  items: string[];
}

const MegaMenu = ({ title, items }: MegaMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger */}
      <a
        href={`/${title.toLowerCase().replace(/\s+/g, '-')}`}
        className="px-2 py-1.5 mx-0.5 rounded-full text-text-secondary hover:bg-background-accent transition-all duration-300 font-medium text-xs whitespace-nowrap flex items-center gap-1"
      >
        <span className="whitespace-nowrap">{title}</span>
        <svg 
          className={`w-3 h-3 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </a>
      
      {/* Mega Menu Panel */}
      <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-background-secondary border border-border-accent rounded-lg shadow-lg z-50 transition-all duration-300 ${
        isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
      }`}>
        <div className="p-3">
          <div className="grid gap-1">
            {items.map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="block px-2 py-1.5 text-text-secondary hover:text-text-primary hover:bg-background-accent rounded-md transition-all duration-200 text-xs"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
        
        {/* Arrow pointing up */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <div className="w-4 h-4 bg-background-secondary border-l border-t border-border-accent rotate-45"></div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;