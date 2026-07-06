import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Inter', 'sans-serif'],
        code: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        'dark-bg': '#0d1117',
        'dark-surface': '#161b22',
        'dark-border': '#30363d',
        'accent-blue': '#58a6ff',
        'accent-red': '#f85149',
        'accent-purple': '#a5a5ff',
        'accent-green': '#3fb950',
        'accent-yellow': '#f9c23c',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {height: '0'},
          to: {height: 'var(--radix-accordion-content-height)'},
        },
        'accordion-up': {
          from: {height: 'var(--radix-accordion-content-height)'},
          to: {height: '0'},
        },
        float: {
          '0%, 100%': {transform: 'translateY(0px) rotate(0deg)'},
          '33%': {transform: 'translateY(-20px) rotate(1deg)'},
          '66%': {transform: 'translateY(-10px) rotate(-1deg)'},
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow:
              '0 0 20px rgba(88, 166, 255, 0.4), 0 0 40px rgba(88, 166, 255, 0.2)',
          },
          '50%': {
            boxShadow:
              '0 0 40px rgba(88, 166, 255, 0.8), 0 0 80px rgba(88, 166, 255, 0.4)',
          },
        },
        'slide-in-left': {
          from: {transform: 'translateX(-100%)', opacity: '0'},
          to: {transform: 'translateX(0)', opacity: '1'},
        },
        'slide-in-right': {
          from: {transform: 'translateX(100%)', opacity: '0'},
          to: {transform: 'translateX(0)', opacity: '1'},
        },
        'fade-in-up': {
          from: {transform: 'translateY(50px)', opacity: '0'},
          to: {transform: 'translateY(0)', opacity: '1'},
        },
        'bounce-in': {
          '0%': {transform: 'scale(0.3)', opacity: '0'},
          '50%': {transform: 'scale(1.05)'},
          '70%': {transform: 'scale(0.9)'},
          '100%': {transform: 'scale(1)', opacity: '1'},
        },
        'scale-in': {
          from: {transform: 'scale(0)', opacity: '0'},
          to: {transform: 'scale(1)', opacity: '1'},
        },
        typing: {
          from: { width: '0' },
          to: { width: '100%' },
        },
        'blink-caret': {
            'from, to': { 'border-color': 'transparent' },
            '50%': { 'border-color': '#58a6ff' },
        },
        matrix: {
            '0%': { transform: 'translateY(-100%)' },
            '100%': { transform: 'translateY(100vh)' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
        'slide-in-left': 'slide-in-left 0.8s ease-out',
        'slide-in-right': 'slide-in-right 0.8s ease-out',
        'fade-in-up': 'fade-in-up 0.8s ease-out',
        'bounce-in': 'bounce-in 0.6s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
        typing: 'typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite',
        matrix: 'matrix 20s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
