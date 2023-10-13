/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        grey: {
          100: '#F4F5F7',
          200: '#ebecf0',
          300: '#dfe1e6',
          400: '#c1c7d0',
          500: '#a2a9b0',
          600: '#7a838e',
          700: '#555e6d',
          800: '#373f4b',
          900: '#1e2129',
        },
        primary: {
          100: '#E2F3FF',
          200: '#C4E6FF',
          300: '#A7D9FF',
          400: '#89CCFF',
          500: '#6BC0FF',
          600: '#49ACF7',
          700: '#3384C7',
          800: '#1E5B97',
          900: '#0F3B6E',
        },
        secondary: {
          100: '#FFEDDD',
          200: '#FFDDBB',
          300: '#FFCC99',
          400: '#FFBB77',
          500: '#FFAA55',
          600: '#FF9933',
          700: '#DD7700',
          800: '#BB5500',
          900: '#994400',
        },
        blue: {
          100: '#deebff',
        },
        success: '#36b27e',
        pending: 'blue',
        error: '#ff5630',
      },
    },
  },
  plugins: [],
};
