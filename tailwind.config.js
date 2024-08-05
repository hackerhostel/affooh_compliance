/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-pink': '#EB5A84',
        'secondary-pink': '#fdd6db',
        'dashboard-bgc': '#f4f5fb',
        'secondary-grey' : '#747A88'
      },
      height: {
        'list-screen': 'calc(100vh - 148px)',
      },
    },
  },
  plugins: [],
}
