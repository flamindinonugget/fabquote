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
        ink: "#172033",
        muted: "#5b6577",
        line: "#dbe3ee",
        paper: "#f7f9fc",
        brand: {
          50: "#eef8ff",
          100: "#d8efff",
          500: "#1877f2",
          600: "#0f65d8",
          700: "#0e55b8",
        },
        mint: {
          50: "#ecfdf6",
          500: "#19a974",
          700: "#08724f",
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
