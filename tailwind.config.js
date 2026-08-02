module.exports = {
  /** @type {import('tailwindcss').Config} */
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4da6ff',
          DEFAULT: '#0078ff',
          dark: '#0057b8',
        },
        secondary: {
          light: '#f8f9fa',
          DEFAULT: '#e9ecef',
          dark: '#dee2e6',
        },
        cinematic: {
          black: '#0a0a0a',
          darkest: '#0d0d0d',
          dark: '#111111',
          charcoal: '#1a1a1a',
          gold: '#c9a84c',
          'gold-light': '#e8c96a',
          'gold-dark': '#a07830',
          'gold-bright': '#f0d060',
          cream: '#f5e6c8',
          'nav-bg': 'rgba(10, 8, 4, 0.75)',
          'footer-bg': '#080604',
        },
      },
      fontFamily: {
        baskerville: ['Baskerville', 'Palatino Linotype', 'Book Antiqua', 'Palatino', 'serif'],
        cinematic: ['Cinzel', 'Baskerville', 'serif'],
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translate3d(0px, 0px, 0px)' },
          '25%': { transform: 'translate3d(-3px, -5px, 0px)' },
          '50%': { transform: 'translate3d(3px, -3px, 0px)' },
          '75%': { transform: 'translate3d(-2px, 4px, 0px)' },
        },
        'gold-pulse': {
          '0%, 100%': { opacity: '0.7', filter: 'brightness(1)' },
          '50%': { opacity: '1', filter: 'brightness(1.3)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'glow-ring': {
          '0%, 100%': { filter: 'drop-shadow(0 0 6px rgba(201, 168, 76, 0.4))' },
          '50%': { filter: 'drop-shadow(0 0 18px rgba(201, 168, 76, 0.9))' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      animation: {
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'gold-pulse': 'gold-pulse 3s ease-in-out infinite',
        'fade-in': 'fade-in 1s ease-out forwards',
        'glow-ring': 'glow-ring 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
};
