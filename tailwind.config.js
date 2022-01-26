module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'iati-grey': '#155366',
        'iati-blue': '#81c3d6'
      },
      fontFamily: {
        'sans': ["Avenir", "Helvetica", "Arial", "sans-serif"],
      }
    },
  },
  plugins: [],
}
