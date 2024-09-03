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
        'text-color': 'rgba(116, 122, 136, 1)',
        'card-white': '#FFFFFF',

        'dashboard-bgc': '#f4f5fb',
        'secondary-grey': '#747A88',
        'dark-white': '#fbfbfb',
        'in-progress': '#cafafa',
        'secondary-bgc': '#E8E8E85C'
      },
      height: {
        'list-screen': 'calc(100vh - 148px)',
      },
    },
  },
  plugins: [],
}
