/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0F172A',
        indigo: { DEFAULT: '#6366F1', soft: '#818CF8', deep: '#4F46E5' },
        offwhite: '#F8FAFC',
        gold: '#FBBF24',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        floatY: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        dots: {
          '0%,20%': { opacity: 0.2 },
          '50%': { opacity: 1 },
          '100%': { opacity: 0.2 },
        },
        confetti: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: 1 },
          '100%': { transform: 'translateY(420px) rotate(720deg)', opacity: 0 },
        },
        equation: {
          '0%': { opacity: 0, letterSpacing: '0.6em' },
          '100%': { opacity: 1, letterSpacing: '0.05em' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out both',
        'float-y': 'floatY 6s ease-in-out infinite',
        dots: 'dots 1.4s ease-in-out infinite',
        confetti: 'confetti 2.4s ease-out forwards',
        equation: 'equation 1.2s ease-out both',
      },
    },
  },
  plugins: [],
};
