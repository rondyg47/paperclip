import type { Config } from "tailwindcss";

/**
 * Paleta oficial do Karaúbas Futebol Clube (KFC)
 * Extraída do escudo oficial: azul royal, amarelo dourado, laranja (fênix).
 * Fundado em 29 de agosto de 2009.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kfc: {
          // Azul royal — cor primária (institucional, header, botões principais)
          blue: {
            50: "#E8EEF9",
            100: "#C5D2EE",
            200: "#9DB4E1",
            300: "#7395D3",
            400: "#4F7CC8",
            500: "#1E4FB5",
            600: "#1A45A0",
            700: "#153984",
            800: "#102C68",
            900: "#0A1F4B",
            DEFAULT: "#1E4FB5",
          },
          // Amarelo dourado — cor secundária (destaques, badges, CTA)
          yellow: {
            50: "#FFF8E1",
            100: "#FFEDB3",
            200: "#FFE082",
            300: "#FFD54F",
            400: "#FFCA28",
            500: "#FFC72C",
            600: "#E0A800",
            700: "#B58800",
            800: "#8A6700",
            900: "#604700",
            DEFAULT: "#FFC72C",
          },
          // Laranja fênix — cor de acento (alertas positivos, gols, conquistas)
          orange: {
            50: "#FDECE0",
            100: "#FBCFB1",
            200: "#F8B07F",
            300: "#F4904E",
            400: "#F17829",
            500: "#E8651F",
            600: "#CC571A",
            700: "#A64614",
            800: "#80360F",
            900: "#5A260A",
            DEFAULT: "#E8651F",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-bebas)", "Impact", "sans-serif"],
      },
      backgroundImage: {
        "kfc-gradient":
          "linear-gradient(135deg, #1E4FB5 0%, #153984 50%, #102C68 100%)",
        "kfc-splash":
          "linear-gradient(135deg, #1E4FB5 0%, #FFC72C 50%, #1E4FB5 100%)",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.05), 0 1px 3px 0 rgb(0 0 0 / 0.1)",
        "card-hover":
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        kfc: "0 4px 14px 0 rgb(30 79 181 / 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
