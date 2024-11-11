/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        dark:{
          100:'#4B465C',
          200: '#F8F7FA',
          300: '#DBDADE',
          400: '#909090'
        },
        primary:{
          main:"#246AA3"
        }
      }
    },
  },
  plugins: [],
}


