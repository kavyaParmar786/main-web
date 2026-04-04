// FILE: tailwind.config.ts
import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cyan: { 400: '#00d4ff' },
        purple: { 500: '#6c35de' },
      },
      fontFamily: {
        display: ['Orbitron','monospace'],
        mono:    ['Space Mono','monospace'],
        body:    ['Rajdhani','sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
