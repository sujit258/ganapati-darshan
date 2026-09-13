import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF8F5",
        surface: "#FFFFFF",
        card: "#FFFFFF",
        border: "#E9E2D8",
        saffron: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#EA580C", // rich vermilion / kesari
          600: "#C2410C",
          700: "#9A3412",
          800: "#7C2D12",
          900: "#431407",
        },
        sacred: {
          gold: "#D97706",
          maroon: "#881337",
          cream: "#FAF8F5",
          sand: "#F4ECE1",
        }
      },
      fontFamily: {
        devanagari: ["var(--font-noto-devanagari)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 2px 10px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 20px -4px rgba(194, 65, 12, 0.08)',
        'sticky-bar': '0 -4px 16px -2px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
} satisfies Config;
