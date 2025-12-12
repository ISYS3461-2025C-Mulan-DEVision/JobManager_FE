/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                "dark-blue": "#1E293B",
                "background-color": "#F8FAFC",
                "heading": "#ff0000",
            },
        },
    },
    plugins: [],
};
