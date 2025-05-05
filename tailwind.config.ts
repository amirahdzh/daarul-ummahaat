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
        primary: "#E53935", // merah cerah
        accent: "#43A047", // hijau
        "hover-accent": "#388E3C", // hijau lebih gelap (untuk hover)
        highlight: "#FDD835", // kuning emas
        shadow: "#1F1F1F", // hitam keabuan
        background: "#FFFFFF", // putih bersih
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        arabic: ['"Scheherazade New"', "serif"],
      },
      boxShadow: {
        DEFAULT: "0 4px 6px rgba(0, 0, 0, 0.1)", // default shadow hitam keabuan
        md: "0 6px 10px rgba(0, 0, 0, 0.15)",
        lg: "0 8px 20px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
