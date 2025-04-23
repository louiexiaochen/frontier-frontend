/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      colors: {
        blue: {
          DEFAULT: '#4A99E9',
        },
        purple: {
          DEFAULT: '#5C2797',
        }
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'float-slow': 'float 15s ease-in-out infinite alternate',
        'float-reverse': 'float 20s ease-in-out infinite alternate-reverse',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(5%, 5%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      boxShadow: {
        'blue-glow': '0 5px 15px rgba(74, 153, 233, 0.2)',
        'blue-glow-lg': '0 8px 20px rgba(74, 153, 233, 0.3)',
        'blue-glow-sm': '0 2px 10px rgba(74, 153, 233, 0.2)',
      },
      minWidth: {
        '6': '1.5rem',
      },
      minHeight: {
        '6': '1.5rem',
      },
    },
  },
  plugins: [],
}