import type { Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // ForgeMancer custom colors
        forge: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        mancer: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
      },
      fontSize: {
        xs: ["clamp(0.65rem, 0.2vw + 0.6rem, 0.75rem)", { lineHeight: "1rem" }],
        sm: ["clamp(0.75rem, 0.3vw + 0.7rem, 0.875rem)", { lineHeight: "1.25rem" }],
        base: ["clamp(0.875rem, 0.4vw + 0.75rem, 1rem)", { lineHeight: "1.5rem" }],
        lg: ["clamp(1rem, 0.5vw + 0.85rem, 1.125rem)", { lineHeight: "1.75rem" }],
        xl: ["clamp(1.125rem, 0.6vw + 0.95rem, 1.25rem)", { lineHeight: "1.75rem" }],
        "2xl": ["clamp(1.25rem, 0.8vw + 1rem, 1.5rem)", { lineHeight: "2rem" }],
        "3xl": ["clamp(1.5rem, 1vw + 1.2rem, 1.875rem)", { lineHeight: "2.25rem" }],
        "4xl": ["clamp(1.875rem, 1.5vw + 1.4rem, 2.25rem)", { lineHeight: "2.5rem" }],
        "5xl": ["clamp(2.25rem, 2vw + 1.6rem, 3rem)", { lineHeight: "1.1" }],
        "6xl": ["clamp(2.75rem, 3vw + 1.8rem, 3.75rem)", { lineHeight: "1.1" }],
        "7xl": ["clamp(3.25rem, 4vw + 2rem, 4.5rem)", { lineHeight: "1.1" }],
        "8xl": ["clamp(4rem, 5vw + 2.5rem, 6rem)", { lineHeight: "1" }],
        "9xl": ["clamp(5rem, 7vw + 3rem, 8rem)", { lineHeight: "1" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-right": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config
