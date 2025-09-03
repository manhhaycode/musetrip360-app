const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: '#ffd2b2',
        input: '#ffd2b2',
        ring: '#ff914d',
        background: '#fff6ed',
        foreground: '#2d1f13',
        primary: {
          DEFAULT: '#ff914d',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#ffe3cc',
          foreground: '#2d1f13',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f5e9dd',
          foreground: '#a67c52',
        },
        accent: {
          DEFAULT: '#ffb672',
          foreground: '#2d1f13',
        },
        popover: {
          DEFAULT: '#fff6ed',
          foreground: '#2d1f13',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#2d1f13',
        },
      },
      borderRadius: {
        DEFAULT: '10px',
        sm: '6px',
        lg: '14px',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
