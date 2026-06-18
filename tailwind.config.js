/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nova: {
          black: '#050505',
          ink: '#0a0a0c',
          blue: '#3B82F6',
          cyan: '#22D3EE',
          orange: '#FF5E3A',
          red: '#FF3B00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        eyebrow: '0.35em',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'spin-slow': 'spin 18s linear infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
