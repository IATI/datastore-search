module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "iati-grey": "#155366",
        "iati-blue": "#81c3d6",
        "iati-accent": "#1e7590",
        "btn-red": "#860404",
        "btn-green": "green",
        "btn-yellow": "#5e5e00",
      },
      fontFamily: {
        sans: ["Avenir", "Helvetica", "Arial", "sans-serif"],
      },
      screens: {
        advanced: "1000px",
      },
    },
  },
  plugins: [],
};
