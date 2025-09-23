import type {Config} from 'tailwindcss';

const { fontFamily } = require("tailwindcss/defaultTheme")

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        mono: ["var(--font-source-code-pro)", ...fontFamily.mono],
      },
      colors: {
        'dark-bg': '#0d1117',
        'dark-surface': '#161b22',
        'dark-border': '#30363d',
        'accent-blue': '#58a6ff',
        'accent-red': '#f85149',
        'accent-purple': '#a5a5ff',
        'accent-green': '#3fb950',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'float': { 
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '33%': { transform: 'translateY(-20px) rotate(1deg)' },
            '66%': { transform: 'translateY(-10px) rotate(-1deg)' },
        },
        'pulse-glow': {
            '0%, 100%': { boxShadow: '0 0 20px rgba(88, 166, 255, 0.4), 0 0 40px rgba(88, 166, 255, 0.2)' },
            '50%': { boxShadow: '0 0 40px rgba(88, 166, 255, 0.8), 0 0 80px rgba(88, 166, 255, 0.4)' },
        },
        'slideInLeft': {
            from: { transform: 'translateX(-100%)', opacity: '0' },
            to: { transform: 'translateX(0)', opacity: '1' },
        },
        'slideInRight': {
            from: { transform: 'translateX(100%)', opacity: '0' },
            to: { transform: 'translateX(0)', opacity: '1' },
        },
        'fadeInUp': {
            from: { transform: 'translateY(50px)', opacity: '0' },
            to: { transform: 'translateY(0)', opacity: '1' },
        },
        'typing': {
            from: { width: '0' },
            to: { width: '100%' },
        },
        'blink-caret': {
            'from, to': { borderColor: 'transparent' },
            '50%': { borderColor: '#58a6ff' },
        },
        'matrix': {
            '0%': { transform: 'translateY(-100%)' },
            '100%': { transform: 'translateY(100vh)' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
        'slide-in-left': 'slideInLeft 0.8s ease-out',
        'slide-in-right': 'slideInRight 0.8s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'typing': 'typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite',
        'matrix': 'matrix 20s linear infinite'
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config;
