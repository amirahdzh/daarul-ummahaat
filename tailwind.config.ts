import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
    "./content/**/*.md",
  ],
  theme: {
    extend: {
      colors: {
        // Branding palette
        primary: "#53B389",           // Logo green
        "primary-dark": "#3D8B6B",    // For hover/active
        "primary-light": "#A2D7C0",   // Light accents or backgrounds

        accent: "#2C4E4E",            // Deep teal for emphasis (e.g. headings)
        "hover-accent": "#1F3B3B",    // Darker teal for hover states

        highlight: "#FDD835",         // Golden yellow for callouts/warnings
        sand: "#EBDDC6",              // Warm beige background
        beige: "#D5B892",             // Accent or card fill

        background: "#FFFFFF",        // Main background
        "background-soft": "#F5F7F6", // Light gray for sections

        text: "#3A3A3A",              // Main body text
        border: "#D3DAD7",            // Neutral border

        shadow: "#1F1F1F",            // Shadow gray (unchanged)
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        arabic: ['"Scheherazade New"', "serif"],
      },
      boxShadow: {
        DEFAULT: "0 4px 6px rgba(0, 0, 0, 0.1)",
        md: "0 6px 10px rgba(0, 0, 0, 0.15)",
        lg: "0 8px 20px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
