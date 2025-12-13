/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1a2b3c', // Define a custom color with a hex code
        'primary': '#ff4500',
        'background': '#'
      },
    },
  },
  plugins: [],
  
}

