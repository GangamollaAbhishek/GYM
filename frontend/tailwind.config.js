/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: {
          bg: "#090C0E",
          card: "#12161A",
          surface: "rgba(18, 22, 26, 0.85)",
          border: "rgba(255, 255, 255, 0.08)",
        },
        crimson: {
          primary: "#FF2E4C",
          hover: "#FF526B",
          glow: "rgba(255, 46, 76, 0.4)",
        },
        cyan: {
          secondary: "#00F0FF",
          glow: "rgba(0, 240, 255, 0.4)",
        },
        subdued: "#8A94A0",
        pureWhite: "#FFFFFF",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Outfit", "sans-serif"],
        heading: ["Outfit", "sans-serif"],
        serifItalic: ["Playfair Display", "serif"],
        mono: ["Space Mono", "monospace"],
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 14s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
