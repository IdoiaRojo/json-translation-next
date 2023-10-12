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
