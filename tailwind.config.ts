import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"]
      },
      colors: {
        ink: "#201714",
        parchment: "#f8f1e7",
        latte: "#e6d2c2",
        blush: "#d1977c",
        rosewood: "#764134",
        cedar: "#44231c",
        gold: "#bf8f62"
      },
      boxShadow: {
        glow: "0 20px 60px rgba(118, 65, 52, 0.18)"
      },
      backgroundImage: {
        "grain-radial":
          "radial-gradient(circle at top, rgba(255,255,255,0.18), transparent 45%), radial-gradient(circle at bottom, rgba(191,143,98,0.15), transparent 40%)"
      }
    }
  },
  plugins: [typography]
};

export default config;
