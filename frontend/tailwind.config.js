/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"]
      },
      colors: {
        saffron: {
          50: "#fff8ed",
          100: "#ffebc7",
          500: "#f59e0b",
          600: "#d97706"
        },
        herb: {
          50: "#eefdf4",
          100: "#d6f8e3",
          500: "#22c55e",
          700: "#15803d"
        },
        berry: {
          500: "#e11d48"
        },
        ink: {
          900: "#111827"
        }
      },
      boxShadow: {
        glow: "0 24px 80px rgba(245, 158, 11, 0.22)",
        soft: "0 18px 50px rgba(15, 23, 42, 0.12)"
      }
    }
  },
  plugins: []
};

