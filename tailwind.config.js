/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          light: '#EEF2FF',
          dark: '#3730A3',
        },
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        background: '#F8FAFC',
        surface: {
          DEFAULT: '#FFFFFF',
          dark: "#0f172a",
          card: "#1e293b",
          hover: "#334155",
          border: "#334155",
        },
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
        },
        border: '#E2E8F0',
        semantic: {
          success: '#15803D',
          warning: '#D97706',
          danger: '#DC2626',
          info: '#0284C7',
        },
      },
      borderRadius: {
        card: '12px',
        control: '8px',
      },
    },
  },
  plugins: [],
};
