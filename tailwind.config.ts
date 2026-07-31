import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./sections/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050509",
        gold: "#F2D28B",
        ivory: "#F6F3F0",
        muted: "#9E9EAE",
        border: "rgba(255,255,255,0.10)",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 8vw, 5.5rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        "display-l": ["clamp(2.5rem, 5vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.005em" }],
        "display-m": ["clamp(2rem, 4vw, 2.5rem)", { lineHeight: "1.15" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        body: ["1rem", { lineHeight: "1.7" }],
        caption: ["0.8125rem", { lineHeight: "1.5", letterSpacing: "0.08em" }],
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
        "20": "80px",
        "24": "96px",
        "32": "128px",
      },
      borderRadius: {
        card: "20px",
        lg: "24px",
        md: "16px",
        pill: "9999px",
      },
      maxWidth: {
        content: "1280px",
      },
      transitionTimingFunction: {
        lux: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
