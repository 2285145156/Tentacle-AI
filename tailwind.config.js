/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tentacle: {
          dark: '#020617', // Slate 950
          primary: '#22d3ee', // Cyan 400
          secondary: '#6366f1', // Indigo 500
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Assuming Inter is available or default
      }
    },
  },
  plugins: [],
}
