import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#ec4899",
          light: "#f9a8d4",
          dark: "#be185d",
        },
        secondary: {
          DEFAULT: "#8b5cf6",
          light: "#c4b5fd",
          dark: "#6d28d9",
        },
      },
    },
  },
  plugins: [],
};
export default config;
