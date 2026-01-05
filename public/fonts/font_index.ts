import localFont from "next/font/local";

const ai_sans = localFont({
  src: [
    {
      path: "./AISans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./AISans-Semibold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
});

const main_font = ai_sans;
const money_font = ai_sans;
const title_font = ai_sans;

export { main_font, money_font, title_font };
