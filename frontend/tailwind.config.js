/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-yellow': '#F8EB1F',
        'brand-blue-1': '#00B0FF',
        'brand-blue-2': '#2693FF',
        'brand-light-blue-1': '#6CB9FF',
        'brand-light-blue-2': '#82C4FF',
        'brand-white': '#FFFFFF',
        'brand-black': '#000000',
      },
      fontFamily: {
        'neutral': ['Neutral Sans', 'Arial', 'sans-serif'],
        'merriweather': ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
}
