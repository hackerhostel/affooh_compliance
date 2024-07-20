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
      },
      height: {
        'list-screen': 'calc(100vh - 148px)',
      },
    },
  },
  plugins: [],
}
