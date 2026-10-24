/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sc: {
          black: '#0A0A0A',
          ink: '#121211',
          cream: '#F0EDE6',
          stone: '#B9B4A9',
          line: 'rgba(240,237,230,0.14)',
        },
      },
      fontFamily: {
        serif: ['Cormorant', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        gothic: ['UnifrakturMaguntia', 'Cormorant', 'serif'],
      },
      letterSpacing: {
        eyebrow: '0.35em',
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
