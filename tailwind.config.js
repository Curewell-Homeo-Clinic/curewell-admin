/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A1B1E",
        secondary: "#373A40",
        primaryLight: "#C1C2C5",
        lightWhite: "#ffffff2b",
      },
    },
  },
};
