/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // Site design: Fira Code for headings and labels (the `serif` key is kept so existing
      // classes pick it up), Antic for taglines, Inter for running text.
      fontFamily: {
        serif: ['"Fira Code"', 'ui-monospace', 'monospace'],
        inter: ['Inter', 'sans-serif'],
        mono: ['"Fira Code"', 'ui-monospace', 'monospace'],
        antic: ['Antic', 'sans-serif'],
        signature: ['"Brush Script MT"', '"Lucida Handwriting"', 'cursive'],
      },
      colors: {
        // Site tokens: CSS variables in index.css, dark by default, light via the toggle.
        // The names are historical (cream = page background, ink = foreground) so every
        // section and showcase page follows the theme without per-file changes.
        accent: {
            DEFAULT: 'rgb(var(--accent) / <alpha-value>)', // CV blue #4472C4, for fills
            deep: 'rgb(var(--accent-text) / <alpha-value>)', // CV blue as text, a lighter step on dark
        },
        cream: 'rgb(var(--bg) / <alpha-value>)',
        ink: 'rgb(var(--fg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        stone: {
            400: 'rgb(var(--muted-2) / <alpha-value>)',
            500: 'rgb(var(--muted) / <alpha-value>)',
            600: 'rgb(var(--muted-strong) / <alpha-value>)',
            700: 'rgb(var(--fg-soft) / <alpha-value>)',
        },
        // each home section keeps its own background tone
        sage: 'rgb(var(--sec-cv) / <alpha-value>)',
        mist: 'rgb(var(--sec-projects) / <alpha-value>)',
        sand: 'rgb(var(--sec-contact) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};