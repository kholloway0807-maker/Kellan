import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: "#1B4D2E",
          dark: "#133820",
          light: "#2D6B43",
        },
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E0C57A",
          dark: "#A8872E",
        },
        cream: {
          DEFAULT: "#F9F6EF",
          dark: "#EDE9DF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #1B4D2E 0%, #0F2E1A 60%, #133820 100%)",
        "gold-gradient": "linear-gradient(90deg, #C9A84C, #E0C57A, #C9A84C)",
      },
    },
  },
  plugins: [],
};
export default config;
