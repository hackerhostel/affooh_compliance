/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'mainColor': 'rgba(235, 90, 132, 1)',
        'textColor': 'rgba(116, 122, 136, 1)',
      }
    },
  },
  plugins: [],
}
