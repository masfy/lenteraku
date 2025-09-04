/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6750A4", // MD3 primary
          50:"#f6f2fb",100:"#ece6f6",200:"#d9cff2",300:"#c6b6ec",400:"#b39de6",500:"#9f84df",600:"#8666d1",700:"#6d4fb6",800:"#573e93",900:"#463376"
        },
        surface: "#FFFBFE",
        onSurface: "#1C1B1F",
        outline: "#79747E",
        success: "#2E7D32",
        warning: "#ED6C02",
        danger: "#B3261E"
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.08)"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
