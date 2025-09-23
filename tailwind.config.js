module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Satoshi", "sans"],
        satoshi: ["Satoshi", "sans"],
      },
      colors: {
        river: {
          bg: "#0A0A0A",
          blue: "#3B82F6",
          purple: "#7C3AED",
          card: "rgba(255,255,255,0.05)",
          border: "#232323",
          text: "#FFFFFF",
          secondary: "#A1A1AA",
        },
      },
      screens: {
        laptop: '1024px', // or use a custom range if needed
      },
    },
  },
  plugins: [],
};
