/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: "#00d4ff",
          purple: "#b347ff",
          cyan: "#00ffe7",
          pink: "#ff2d9b",
        },
        dark: {
          900: "#020408",
          800: "#060d17",
          700: "#0a1628",
          600: "#0f2040",
        },
      },
      fontFamily: {
        mono: ["'Share Tech Mono'", "monospace"],
        display: ["'Orbitron'", "monospace"],
        body: ["'Exo 2'", "sans-serif"],
      },
      animation: {
        "pulse-neon": "pulseNeon 2s ease-in-out infinite",
        scanline: "scanline 8s linear infinite",
        glitch: "glitch 3s infinite",
        "float-up": "floatUp 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
