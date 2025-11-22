import { Inter, Funnel_Display } from "next/font/google";
import localFont from "next/font/local";

// const aeonik = localFont({
//   src: [
//     {
//       path: "../fonts/aeonik-regular.otf",
//       weight: "400",
//       style: "normal",
//     },
//   ],
// });

const anthropic_sans = localFont({
  src: [
    {
      path: "../fonts/anthropic-sans.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

const funnel_display = Funnel_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const main_font = anthropic_sans;
const money_font = funnel_display;
const title_font = funnel_display;

export { main_font, money_font, title_font };
