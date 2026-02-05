"use client";
import { useState } from 'react';
import { LogIn } from 'lucide-react';

interface MenuItem {
  title: string;
  href: string;
}

interface MegaMenuProps {
  title: string;
  href?: string;
  items: MenuItem[];
}

const MegaMenu = ({ title, href, items }: MegaMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Determine if this is the Prometheus menu item or Login item
  const isPrometheus = title === "Prometheus";
  const isLogin = title === "Login";
  const hasItems = items.length > 0;

  const linkPath = href || `/${title.toLowerCase().replace(/\s+/g, "-")}`;

  const trigger = (
    <a
      href={linkPath}
      className={`px-1.5 py-1.5 mr-0.5 rounded-full transition-all duration-300 font-medium text-xs whitespace-nowrap flex items-center gap-1 ${
        isPrometheus
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-md"
          : isLogin
          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-md"
          : "text-text-secondary hover:bg-background-accent"
      }`}
    >
      {isLogin && <LogIn className="w-3.5 h-3.5 flex-shrink-0" />}
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
    return <div className="relative inline-block">{trigger}</div>;
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger */}
      {trigger}

      {/* Mega Menu Panel - Only render if there are items */}
      {hasItems && (
        <div
          role="menu"
          aria-hidden={!isOpen}
          className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 min-w-[220px] max-w-[90vw] w-auto ${
            isPrometheus ? 'bg-gradient-to-br from-blue-50 to-purple-50' : 'bg-background-secondary'
          } border ${
            isPrometheus ? 'border-purple-200' : 'border-border-accent'
          } rounded-lg shadow-lg z-50 transition-all duration-200 ${
            isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
          }`}
        >
          <div className="p-3">
            <div className="grid gap-1">
              {items.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className={`block px-2 py-1.5 rounded-md transition-all duration-200 text-xs ${
                    isPrometheus 
                      ? 'text-purple-700 hover:text-purple-900 hover:bg-purple-100' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-background-accent'
                  }`}
                >
                  {item.title}
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