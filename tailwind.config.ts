import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background:
          'hsl(var(--bg) / <alpha-value>)',
        foreground:
          'hsl(var(--fg) / <alpha-value>)',
        primary:
          'hsl(var(--color-primary-h) var(--color-primary-s) var(--color-primary-l) / <alpha-value>)',
        secondary:
          'hsl(var(--color-secondary-h) var(--color-secondary-s) var(--color-secondary-l) / <alpha-value>)'
      },
      borderRadius: {
        lg: 'var(--radius)'
      },
      fontFamily: {
        sans: ['var(--font-sans)']
      }
    },
  },
  plugins: [],
} satisfies Config;