import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          hover: "#4338CA",
          50: "#EEF2FF",
          100: "#E0E7FF",
          500: "#4F46E5",
          600: "#4338CA",
          700: "#3730A3",
        },
        background: "#F8FAFC",
        surface: "#FFFFFF",
        textPrimary: "#0F172A",
        textSecondary: "#64748B",
        borderColor: "#E2E8F0",
        success: {
          DEFAULT: "#15803D",
          50: "#F0FDF4",
          100: "#DCFCE7",
          700: "#15803D",
        },
        warning: {
          DEFAULT: "#D97706",
          50: "#FFFBEB",
          100: "#FEF3C7",
          700: "#B45309",
        },
        danger: {
          DEFAULT: "#DC2626",
          50: "#FEF2F2",
          100: "#FEE2E2",
          700: "#B91C1C",
        },
        info: {
          DEFAULT: "#0284C7",
          50: "#F0F9FF",
          100: "#E0F2FE",
          700: "#0369A1",
        },
      },
    },
  },
  plugins: [],
};
export default config;
