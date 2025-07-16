// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        barlow: ['"Barlow"', 'sans-serif'],
        custom: ['"Bebas Neue"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 15px rgba(255, 193, 7, 0.5), 0 0 30px rgba(255, 193, 7, 0.2)',
        innerGlow: 'inset 0 0 4px #3a2f12',
      },
      colors: {
        'gold-soft': '#ffe066',
        'gold-strong': '#ffd53c',
        'gold-deep': '#5e4c19',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
