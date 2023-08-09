/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      white: "#f1f7ed",
      black: "#010402",
      cyan: "#4bc3b5",
      marine: "#1c2c54",
      pink: "#d175b7",
      red: "#b33951",
    },
  },
  plugins: [],
};
