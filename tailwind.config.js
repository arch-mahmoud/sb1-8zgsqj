/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f6ff',
          100: '#e0ecff',
          200: '#c0daff',
          300: '#91bfff',
          400: '#609bff',
          500: '#3b76ff',
          600: '#1B2A4E',
          700: '#1a3fa8',
          800: '#1a358c',
          900: '#1b2f6f',
        },
        secondary: {
          50: '#fdf8f0',
          100: '#f9ecda',
          200: '#f2d7b4',
          300: '#E5B875',
          400: '#e19c45',
          500: '#d6822d',
          600: '#c06522',
          700: '#a04b1f',
          800: '#833d1f',
          900: '#6c331d',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};