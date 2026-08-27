/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#004880',
          dark: '#003F73',
        },
        secondary: '#00687C',
        cyan: {
          DEFAULT: '#00A8BC',
          hover: '#00687C',
        },
        accent: '#AE057B',
        custom: {
          white: '#FCFCFC',
          light: '#E2EBEE',
          darkText: '#324250',
        },
        navy: {
          950: '#003F73',
          900: '#004880',
          850: '#004880',
          800: '#003F73',
          700: '#00687C',
          600: '#00687C',
          500: '#324250',
        },
        brand: {
          orange: '#00A8BC',
          'orange-hover': '#00687C',
          'orange-bright': '#AE057B',
          'orange-light': '#E2EBEE',
          'orange-subtle': '#E2EBEE',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'navy-lg': '0 20px 25px -5px rgba(0, 63, 115, 0.5), 0 8px 10px -6px rgba(0, 63, 115, 0.3)',
        'orange-glow': '0 10px 25px -5px rgba(0, 168, 188, 0.4), 0 8px 10px -6px rgba(0, 168, 188, 0.2)',
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle, rgba(0,168,188,0.1) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
};
