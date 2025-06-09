/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
import aspectRatio from "@tailwindcss/aspect-ratio";

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        tangerine: ["Tangerine", "cursive"],
        ancizar: ["Ancizar", "sans-serif"],
      },
      backgroundImage: {
        "custom-mesh-dark": 
        `radial-gradient(at 0% 100%, rgb(21, 128, 61) 0, transparent 46%),
        radial-gradient(at 0% 100%, rgb(52, 211, 153) 0, transparent 57%),
        radial-gradient(at 0% 100%, rgb(232, 121, 249) 0, transparent 40%),
        radial-gradient(at 100% 0%, rgb(21, 128, 61) 0, transparent 48%),
        radial-gradient(at 100% 0%, rgb(232, 121, 249) 0, transparent 42%),
        radial-gradient(at 100% 0%, rgb(52, 211, 153) 0, transparent 56%);
        `,
      },
      colors: {
        "dark-base": "rgb(23, 23, 23)"
      },
      animation: {
        'mesh': 'animateMesh 20s infinite',
      },
      keyframes: {
        animateMesh: {
          '0%': {
            backgroundPosition: '0% 0%',
          },
          '25%': {
            backgroundPosition: '50% 5%',
          },
          '50%': {
            backgroundPosition: '100% 10%',
          },
          '75%': {
            backgroundPosition: '50% 5%',
          },
          '100%': {
            backgroundPosition: '0% 0%',
          },

        },
      },
    },
  },
  plugins: [],
};
