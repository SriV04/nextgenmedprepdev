// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class', // Enable dark mode support
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        // Using CSS variables for theme colors
        // Backgrounds
        'background-primary': 'var(--color-background-primary)', 
        'background-secondary': 'var(--color-background-secondary)',
        'background-accent': 'var(--color-background-accent)',

        // Text
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-accent': 'var(--color-text-accent)',
        'text-on-accent': 'var(--color-text-on-accent)',

        // Borders
        'border-primary': 'var(--color-border-primary)',
        'border-accent': 'var(--color-border-accent)',

        // Interactive Elements
        'accent-primary': 'var(--color-accent-primary)',
        'accent-primary-hover': 'var(--color-accent-primary-hover)',
        'accent-primary-focus': 'var(--color-accent-primary-focus)',
        'accent-secondary': 'var(--color-accent-secondary)',
        'accent-secondary-hover': 'var(--color-accent-secondary-hover)',

        // Semantic Colors
        'success': 'var(--color-success)',
        'warning': 'var(--color-warning)',
        'error': 'var(--color-error)',
        'info': 'var(--color-info)',
      },
      fontFamily: {
        sans: ['var(--font-karla)', 'sans-serif'], // Using Karla from layout.tsx
      },
      spacing: {
        // You can define custom spacing here if needed
        // e.g., '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem', // Slightly larger default for a softer look
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'subtle': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        'DEFAULT': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)', // Softer default shadow
        'lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [
    // require('@tailwindcss/forms'), // Useful for styling form elements
  ],
};
export default config;