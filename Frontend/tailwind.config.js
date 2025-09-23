/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        slide: 'slide 1s ease-out forwards',
        scroll: 'scroll 40s linear infinite',
        marquee: 'marquee 30s linear infinite',
      },
      fontFamily: {
        dire: ['DireDawa', 'sans-serif'],
        nokya: ['Nokya', 'sans-serif'],
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.swiper-button': {
          color: '#EB6407',
          top: '40%',
          position: 'absolute',
          zIndex: 10,
          transform: 'translateY(-50%)',
        },
        '.swiper-button-prev': {
          left: '-10px',
        },
        '.swiper-button-next': {
          right: '-10px',
        },
      });
    }),
  ],
};
