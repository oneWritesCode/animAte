import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import PageLoader from "@/components/PageLoader";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "animAte - a animation library",
  description:
    "Browse a hundreds of animations, preview them live, and copy the code into your projects.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <Script
          data-goatcounter="https://animate.goatcounter.com/count"
          strategy="afterInteractive"
          src="//gc.zgo.at/count.js"
        />
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="7f303534-c2ab-4ecb-92cf-c40db49304ba"
        ></script>
        
        <Analytics />
        <PageLoader />
        {children}
      </body>
    </html>
  );
}
