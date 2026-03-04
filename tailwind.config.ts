import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e7edf7',
          100: '#c6d4eb',
          200: '#a2b9de',
          300: '#7d9ed0',
          400: '#5a83c3',
          500: '#3568b6',
          600: '#0b4a8f', // brand blue
          700: '#08356a',
          800: '#052145',
          900: '#020c21',
        },
        accent: {
          coral: '#9ca3af',
          teal: '#6b7280',
          sand: '#e5e7eb',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
