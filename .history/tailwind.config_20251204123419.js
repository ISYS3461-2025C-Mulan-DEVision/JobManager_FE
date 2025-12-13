/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1a2b3c', 
        'primary': '#ff4500',
        'background-color': '#F8FAFC'
      },
    },
  },
  plugins: [],
  
}

