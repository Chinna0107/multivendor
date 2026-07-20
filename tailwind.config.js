/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-orange': '#fe6603',
        'brand-maroon': '#036e26', // Note: Using the green from the logo
        'brand-gold': '#C9971C',
        'brand-cream': '#FFF8EE',
        'brand-cream-light': '#FDF6ED',
        'brand-green': '#036e26', // Updated to match the new green
        'brand-gray': '#8A8A8A',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
