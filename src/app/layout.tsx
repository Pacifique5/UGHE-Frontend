import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";

import "./globals.css";

/*
  Font name: Museo Slab, falling back to Roboto Slab.
  Museo Slab is applied in globals.css with @font-face. The files were found
  in the public UGHE homepage stylesheet:
  https://ughe.org/wp-content/uploads/elementor/css/post-2136.css
  How the fallback is included: next/font/google downloads Roboto Slab during
  `next dev` and `next build`, then exposes it as --font-roboto-slab.
  Where Roboto Slab was found: https://fonts.google.com/specimen/Roboto+Slab
  The brief also allows Rockwell and Courier New, which remain the last
  families in the font stack in globals.css.
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
