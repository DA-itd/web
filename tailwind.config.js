/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/react-app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e7f1',
          200: '#b3cfe3',
          300: '#8cb7d5',
          400: '#669fc7',
          500: '#4087b9',
          600: '#336b94',
          700: '#264f6f',
          800: '#1a334a',
          900: '#0d1725',
        },
      },
    },
  },
  plugins: [],
};
