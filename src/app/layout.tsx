import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";

import "./globals.css";

/*
  Font name: Roboto Slab.
  How it is included: next/font/google downloads the font during `next dev`
  and `next build`, then exposes it as the CSS variable --font-roboto-slab.
  globals.css applies that variable on the body.
  Where it was found: https://fonts.google.com/specimen/Roboto+Slab
  Museo Slab was requested first. It is sold through Adobe Fonts and is not
  available as a free file, so this project uses Roboto Slab, which the brief
  lists as an acceptable substitute. Rockwell is named only as a last-resort
  fallback in globals.css if the downloaded font cannot load.
*/
const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-roboto-slab",
});

export const metadata: Metadata = {
  title: "University of Global Health Equity",
  description: "UGHE Test Web App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={robotoSlab.variable}>{children}</body>
    </html>
  );
}
