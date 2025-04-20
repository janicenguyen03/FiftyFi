/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
import aspectRatio from "@tailwindcss/aspect-ratio";

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "custom-mesh": `
          radial-gradient(at 16% 0%, rgb(226, 232, 240) 0, transparent 36%),
          radial-gradient(at 71% 100%, rgb(134, 239, 172) 0, transparent 40%),
          radial-gradient(at 100% 0%, rgb(224, 231, 255) 0, transparent 24%),
          radial-gradient(at 60% 77%, rgb(21, 128, 61) 0, transparent 45%),
          radial-gradient(at 0% 100%, rgb(245, 245, 244) 0, transparent 29%);
  `,
      },
      colors: {
        "green-base": "rgb(22, 163, 74)",
      },
    },
  },
  plugins: [],
};
