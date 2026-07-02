/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nova: {
          cream:  '#F8F7F3',
          paper:  '#F0EFE9',
          bone:   '#E8E6DF',
          ink:    '#0A0A0A',
          muted:  '#6B6B6B',
          border: '#E0DED7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        eyebrow: '0.22em',
      },
    },
  },
  plugins: [],
};
