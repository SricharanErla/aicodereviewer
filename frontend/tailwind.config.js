/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 20px 80px rgba(79, 70, 229, 0.18)'
      },
      backgroundImage: {
        'grid-fade': 'linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '0.85' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseSoft: 'pulseSoft 2.5s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
