import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        muted: "#4B5563",
        line: "#d8dee7",
        paper: "#F8FAFC",
        brand: {
          50: "#eef4fa",
          100: "#d9e5f2",
          500: "#2f537d",
          600: "#1E3A5F",
          700: "#142842",
        },
        mint: {
          50: "#ecfdf3",
          100: "#d1fae0",
          500: "#22C55E",
          600: "#16a34a",
          700: "#15803d",
        },
        amber: {
          50: "#fff7e6",
          500: "#f4a62a",
          700: "#a46207",
        },
        coral: {
          50: "#fff0ee",
          500: "#f25f4c",
          700: "#b83224",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 32, 51, 0.08)",
      },
    },
  },
  plugins: [forms],
};

export default config;
