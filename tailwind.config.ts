import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        paper: "#f7f5ef",
        falcon: "#7d1f2a",
        date: "#b45f3c",
        palm: "#28634a",
        gulf: "#19647e"
      },
      boxShadow: {
        soft: "0 14px 40px rgba(23, 32, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
