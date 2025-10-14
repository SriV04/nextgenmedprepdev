import Link from 'next/link';
import { Map } from 'lucide-react';

/**
 * Sitemap Link Component
 * Add this to your footer or navigation to provide easy access to the sitemap
 * 
 * Usage:
 * import SitemapLink from '@/components/SitemapLink';
 * 
 * <SitemapLink />
 * or
 * <SitemapLink variant="footer" />
 */

interface SitemapLinkProps {
  variant?: 'default' | 'footer' | 'minimal';
  className?: string;
}

export default function SitemapLink({ variant = 'default', className = '' }: SitemapLinkProps) {
  if (variant === 'minimal') {
    return (
      <Link 
        href="/sitemap" 
        className={`text-sm text-gray-600 hover:text-indigo-600 transition-colors ${className}`}
      >
        Sitemap
      </Link>
    );
  }

  if (variant === 'footer') {
    return (
      <Link 
        href="/sitemap" 
        className={`flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors ${className}`}
      >
        <Map className="w-4 h-4" />
        <span>Site Map</span>
      </Link>
    );
  }

  return (
    <Link 
      href="/sitemap" 
      className={`inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all ${className}`}
    >
      <Map className="w-5 h-5 text-indigo-600" />
      <span className="font-medium text-gray-700">View Site Map</span>
    </Link>
  );
}
