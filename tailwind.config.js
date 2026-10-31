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
        // Ambrook Palette Tokens
        parchment: {
          DEFAULT: '#fcfaf1',
          light: '#fdfcf7',
          dark: '#f7f2e4',
        },
        bone: {
          DEFAULT: '#efe9e0',
          dark: '#e3dbcf',
        },
        loam: {
          DEFAULT: '#c7bcaf',
          light: '#d8cfc4',
          dark: '#b2a596',
        },
        bark: {
          DEFAULT: '#96897b',
          light: '#ab9f92',
          dark: '#7e7265',
        },
        saddle: {
          DEFAULT: '#50463c',
          light: '#655a4f',
          dark: '#3e362e',
        },
        ink: {
          DEFAULT: '#211b15',
          light: '#362f27',
          dark: '#14100c',
        },
        charcoal: {
          DEFAULT: '#252a23',
          dark: '#191d18',
        },
        olive: {
          DEFAULT: '#434f40',
          light: '#536250',
          dark: '#323b30',
        },
        sage: {
          DEFAULT: '#7a9779',
          light: '#eef5ee',
          border: '#c5d8c4',
          dark: '#5e7b5d',
        },
        amber: {
          DEFAULT: '#e8b672',
          hover: '#dba35c',
          active: '#c9944d',
          light: '#fdf6ed',
          wash: '#fbf2e3',
          subtle: 'rgba(232, 182, 114, 0.18)',
        },
        wheat: {
          DEFAULT: '#f0c891',
          light: '#faebd2',
        },
        pure: '#ffffff',
        // Fallback compatibility tokens for teammates
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
        background: '#fcfaf1',
        surface: {
          DEFAULT: '#FFFFFF',
          dark: "#0f172a",
          card: "#1e293b",
          hover: "#334155",
          border: "#334155",
        },
        text: {
          primary: '#211b15',
          secondary: '#50463c',
        },
      },
      fontFamily: {
        display: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        btn: '3.75px',
        input: '3.75px',
        card: '7.5px',
        cardLarge: '11.25px',
      },
      boxShadow: {
        'ambrook-card': 'rgba(33, 27, 21, 0.04) 0px 4px 14px 0px, rgba(33, 27, 21, 0.03) 0px 1px 3px 0px',
        'ambrook-btn': 'rgba(232, 182, 114, 0.35) 0px 2px 6px 0px',
        'ambrook-focus': 'rgba(232, 182, 114, 0.25) 0px 0px 0px 2px',
      },
    },
  },
  plugins: [],
};
