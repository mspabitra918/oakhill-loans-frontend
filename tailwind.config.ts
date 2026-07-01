import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Deep institutional navy — trust, stability.
        navy: {
          50: "#eef2f8",
          100: "#d6e0ef",
          200: "#aac1df",
          300: "#7397c6",
          400: "#436fa8",
          500: "#2a5288",
          600: "#1d3d6b",
          700: "#152e52",
          800: "#0e2140",
          900: "#0a1830",
          950: "#060f1f",
        },
        // The "Northstar" accent — a bright, optimistic gold.
        star: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px -8px rgba(10, 24, 48, 0.12)",
        lift: "0 12px 40px -12px rgba(10, 24, 48, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
