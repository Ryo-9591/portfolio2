/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        space: {
          dark: '#0a0a0a',
          blue: '#1e3a8a',
          purple: '#6b21a8',
          nebula: '#7c3aed',
        },
        cosmic: {
          gold: '#fbbf24',
          silver: '#e5e7eb',
          plasma: '#06b6d4',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'rotate-slow': 'rotate 20s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 5px rgba(124, 58, 237, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
