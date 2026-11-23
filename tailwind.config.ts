import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        midnight: {
          950: "#060A12",
          900: "#0B1120",
          850: "#10192D",
          800: "#1E293B",
          700: "#334155",
        },
        brand: {
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
          indigo: "#6366F1",
          sky: "#0EA5E9",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        nastaliq: ["var(--font-nastaliq)", "Noto Nastaliq Urdu", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
