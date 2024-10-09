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
        'cancel-button':"rgba(116, 122, 136, 1)",
        'priority-button-high':"rgba(219, 93, 93, 1)",
        'priority-button-medium':"rgba(201, 246, 191, 1)",
        'priority-button-low': "rgba(251, 242, 173, 1)",
        'user-invite-button' : "rgba(65, 169, 54, 1);",

        

        'dashboard-bgc': '#f4f5fb',
        'secondary-grey': '#747A88',
        'dark-white': '#fbfbfb',
        'in-progress': '#cafafa',
        'secondary-bgc': '#E8E8E85C',
        'status-todo': '#C9232F',
        'status-in-progress': '#E4AF00',
        'status-done': '#7DB67F',
        'create-button': 'rgba(235, 90, 132, 1)',
      },
      height: {
        'list-screen': 'calc(100vh - 148px)',
        'content-screen': 'calc(100vh - 90px)',
      },
    },
  },
  plugins: [],
}
