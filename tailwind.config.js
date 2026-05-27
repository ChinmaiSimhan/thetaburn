/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#07090c',
        surface: '#0d1117',
        card: '#111827',
        'card-hover': '#161f2e',
        accent: '#00e5a0',
        'accent-dim': '#00c47a',
        danger: '#ff3b5c',
        'danger-dim': '#cc2244',
        sky: '#38bdf8',
        muted: '#4b5563',
        subtle: '#9ca3af',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 229, 160, 0.15)',
        'glow-red': '0 0 20px rgba(255, 59, 92, 0.15)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'number-pop': 'numberPop 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        numberPop: {
          '0%': { transform: 'scale(1.15)', opacity: '0.7' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'hero-glow': 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(0,229,160,0.12), transparent)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
      },
    },
  },
  plugins: [],
}
