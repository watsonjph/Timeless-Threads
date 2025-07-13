/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "../client/**/*.{html,js,jsx,ts,tsx}",
    "../client/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        spartan: ["'League Spartan'", 'sans-serif'],
        poppins: ["Poppins", 'sans-serif'],
        kanit: ["Kanit", 'sans-serif'],
        nunito: ["'Nunito Sans'", 'sans-serif'],
      },
    },
  },
  plugins: [],
} 