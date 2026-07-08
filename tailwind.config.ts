import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        sxc: {
          navy:          "#07224F",
          eggplant:      "#1B0A40",
          indigo:        "#24277B",
          blue:          "#2061E3",
          skyblue:       "#00ADF1",
          "skyblue-light": "#8ECAE6",
          yellow:        "#F4CC0A",
          steel:         "#1E517D",
          dark:          "#0F1266",
          purple:        "#5942C8",
        },
      },
      fontFamily: {
        sans:    ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "2px",
        md: "4px",
        lg: "8px",
        xl: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
