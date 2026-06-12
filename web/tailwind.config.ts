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
        soil: "#3d2b1f",
        wheat: "#c9a84c",
        sage: "#6b7c3f",
        cream: "#faf6ee",
        terracotta: "#c0522a",
        "soil-light": "#5c4033",
        "sage-light": "#8fa854",
        "wheat-light": "#dfc077",
        "cream-dark": "#ede8dc",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["DM Sans", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        warm: "0 4px 24px 0 rgba(61,43,31,0.10)",
        "warm-md": "0 8px 32px 0 rgba(61,43,31,0.14)",
        "warm-lg": "0 16px 48px 0 rgba(61,43,31,0.18)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
