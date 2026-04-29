import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
        colors: {
            'primary': '#1E90FF',
            'secondary': '#FF69B4',
            'accent': '#32CD32',
            'background': '#F0F8FF',
            'text': '#333333',
        },
        fontFamily: {
            'sans': ['Helvetica', 'Arial', 'sans-serif'],
            'serif': ['Georgia', 'Times New Roman', 'serif'],
            'mono': ['Courier New', 'monospace'],
        },
        boxShadow: {
            'card': '0 4px 6px rgba(0, 0, 0, 0.1)',
            'button': '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        borderRadius: {
            'sm': '0.125rem',
            'md': '0.375rem',
            'lg': '0.5rem',
        },
    },
  },
  plugins: [],
} satisfies Config