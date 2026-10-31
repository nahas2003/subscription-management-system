/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          light: '#EEF2FF',
          dark: '#3730A3',
        },
        background: '#F8FAFC',
        surface: '#FFFFFF',
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
