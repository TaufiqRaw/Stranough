/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors : {
        primary: "#55E0F7",
        "white-950" : "#E4E4E4",  
        "util" : "#333333"
      }
    }
  },
  plugins: []
};
