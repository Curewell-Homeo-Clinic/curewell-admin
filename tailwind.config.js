/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        logo: "#1541c5",
        primary: "#081A51",
        secondary: "#081a51cb",
        lightWhite: "#ffffff2b",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
