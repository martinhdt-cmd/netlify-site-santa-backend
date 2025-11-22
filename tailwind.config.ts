
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7F1D1D', // Deep red
        secondary: '#D97706', // Warm gold
        accent: '#FEF7CD', // Cream
        wood: '#92400E', // Wood brown
        cream: '#FEF7CD',
        'red-900': '#7F1D1D',
        'amber-600': '#D97706',
        'amber-700': '#B45309',
      },
      fontFamily: {
        serif: ['Crimson Text', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
} satisfies Config
