/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--main)",
          foreground: "var(--main-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary-background)",
          foreground: "var(--foreground)",
        },
        destructive: {
          DEFAULT: "#ff4d4d",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f1f1f1",
          foreground: "#646464",
        },
        accent: {
          DEFAULT: "rgba(82, 148, 255, 0.1)",
          foreground: "var(--foreground)",
        },
        card: {
          DEFAULT: "var(--background)",
          foreground: "var(--foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: ["tailwindcss-animate"],
}