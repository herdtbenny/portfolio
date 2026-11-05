/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Newsreader', '"Times New Roman"', 'Georgia', 'serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
        // per-project themes (see .theme-* in index.css)
        'p-display': ['var(--p-font-display)'],
        'p-body': ['var(--p-font-body)'],
        'p-mono': ['var(--p-font-mono)'],
      },
      colors: {
        accent: { DEFAULT: '#8fb0ff', deep: '#2f4f9e' },
        cream: '#f3ede2',
        p: {
            bg: 'rgb(var(--p-bg) / <alpha-value>)',
            panel: 'rgb(var(--p-panel) / <alpha-value>)',
            fg: 'rgb(var(--p-fg) / <alpha-value>)',
            muted: 'rgb(var(--p-muted) / <alpha-value>)',
            subtle: 'rgb(var(--p-subtle) / <alpha-value>)',
            accent: 'rgb(var(--p-accent) / <alpha-value>)',
            ink: 'rgb(var(--p-ink) / <alpha-value>)',
        },
        ink: '#1d1b18',
        pitch: '#34d399',
      },
      borderRadius: {
        p: 'var(--p-radius)',
        'p-sm': 'var(--p-radius-sm)',
      },
      boxShadow: {
        p: 'var(--p-shadow)',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        scrollLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        },
        wave: {
          '0%, 60%, 100%': { transform: 'rotate(0deg)' },
          '10%, 30%': { transform: 'rotate(14deg)' },
          '20%': { transform: 'rotate(-8deg)' },
          '40%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(10deg)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        blink: 'blink 0.75s step-end infinite',
        slideUp: 'slideUp 0.3s ease-out',
        marquee: 'marquee 32s linear infinite',
        wave: 'wave 2.4s ease-in-out 1s 2',
        scrollLine: 'scrollLine 1.8s cubic-bezier(0.65,0,0.35,1) infinite',
      },
    },
  },
  plugins: [],
};