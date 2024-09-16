import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    colors: {
      gunmetal: "#002E3B",
      blue: "#EDF3FA",
      white: "#FFFFFF",
      sapphire: "#0053B3",
      black: "#00131D",
      red: "#FF0000",
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
