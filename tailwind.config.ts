import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'dark-gray': '#dfe1e4',
        'medium-gray': '#f0f1f3',
        enmity: '#75fa61',
        'dark-enmity': '#47c452',
      },
    },
  },
  plugins: [],
} satisfies Config;
