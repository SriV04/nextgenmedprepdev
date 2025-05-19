// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light theme base
        background: '#F7FAFC',
        surface:    '#FFFFFF',
        text:       '#1A202C',
        muted:      '#718096',

        // Branding & accents
        primary:   '#2C3E50',
        accent:    '#16A085',
        highlight: '#1ABC9C',
        success:    '#16A085',
        info:       '#3182CE',
        warning:    '#D69E2E',
        danger:     '#E53E3E',
      },
      fontFamily: {
        sans: ['var(--font-josefin)', 'sans-serif'],
        heading: ['"Josefin Sans"', 'sans-serif'],
      },
      fontSize: {
        h1: ['2.25rem', { lineHeight: '2.5rem', fontWeight: '600' }],
        h2: ['1.875rem', { lineHeight: '2.25rem', fontWeight: '600' }],
        h3: ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        body: ['1rem', { lineHeight: '1.75rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
      },
      borderRadius: {
        md: '0.5rem',
        lg: '0.75rem',
      },
      boxShadow: {
        card:  '0 4px 6px rgba(0,0,0,0.05)',
        dialog:'0 8px 16px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
