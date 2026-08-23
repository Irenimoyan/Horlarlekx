/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070C1E',
          900: '#0B132B',
          850: '#0F1A3A',
          800: '#142247',
          700: '#1E293B',
          600: '#334155',
          500: '#475569',
        },
        brand: {
          orange: '#EA580C',
          'orange-hover': '#C2410C',
          'orange-bright': '#FF6B00',
          'orange-light': '#FFF7ED',
          'orange-subtle': '#FFEDD5',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'navy-lg': '0 20px 25px -5px rgba(11, 19, 43, 0.5), 0 8px 10px -6px rgba(11, 19, 43, 0.3)',
        'orange-glow': '0 10px 25px -5px rgba(234, 88, 12, 0.4), 0 8px 10px -6px rgba(234, 88, 12, 0.2)',
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle, rgba(234,88,12,0.1) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
};
