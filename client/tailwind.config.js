/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        blush: {
          50: '#FDE2E4',
          100: '#FAD2E1',
          200: '#E2ECE9',
          300: '#BEE1E6',
          400: '#DFE7FD',
        },
        emerald: {
          50: '#D8F3DC',
          100: '#B7E4C7',
          200: '#95D5B2',
          300: '#74C69D',
          400: '#52B788',
        },
        sunset: {
          50: '#FFB4A2',
          100: '#E5989B',
          200: '#B5838D',
          300: '#6D6875',
          400: '#FFCDB2',
        },
        ocean: {
          50: '#CDB4DB',
          100: '#BDE0FE',
          200: '#A2D2FF',
          300: '#FFC8DD',
          400: '#FFAFCC',
        },
        earthy: {
          50: '#E9EDC9',
          100: '#FEFAE0',
          200: '#FAEDCD',
          300: '#D4A373',
          400: '#CCD5AE',
        },
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        cormorant: ['Cormorant', 'serif'],
        lora: ['Lora', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        dancing: ['Dancing Script', 'cursive'],
        'great-vibes': ['Great Vibes', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
