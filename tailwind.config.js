/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#05070a',
        accent: {
          DEFAULT: '#76ff03',
          hover: '#64dd17',
          dim: 'rgba(118, 255, 3, 0.1)',
        },
        cyan: {
          DEFAULT: '#00e5ff',
          dim: 'rgba(0, 229, 255, 0.1)',
        },
        violet: {
          DEFAULT: '#8b5cf6',
          dim: 'rgba(139, 92, 246, 0.1)',
        },
        background: {
          DEFAULT: '#05070a',
          secondary: '#080c14',
          card: '#0c111d',
          surface: '#121826',
        },
        electric: {
          green: '#76ff03',
          emerald: '#10b981',
          cyan: '#00e5ff',
          teal: '#06b6d4',
          violet: '#8b5cf6',
          purple: '#a855f7',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', '"Outfit"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"Outfit"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at 50% 50%, rgba(118, 255, 3, 0.08) 0%, transparent 65%)',
        'cyan-glow': 'radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.08) 0%, transparent 65%)',
        'tech-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
