/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#030712', // Deepest black
          900: '#0B0F1A', // Main background
          800: '#111827', // Card background
          700: '#1F2937', // Border/lighter background
        },
        primary: {
          500: '#6366f1',
          600: '#4f46e5',
        },
        accent: {
          cyan: '#22d3ee',
          purple: '#a855f7',
        }
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
