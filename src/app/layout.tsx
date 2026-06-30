import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://kellanlawncare.com"),
  title: {
    default: "Kellan Holloway Lawncare | Lawn Care Bloomington-Normal IL",
    template: "%s | Kellan Holloway Lawncare",
  },
  description:
    "Professional lawn care in Bloomington-Normal, IL. Mowing, edging, fertilization, aeration & more. Serving McLean County. Free estimates. Locally owned & fully insured.",
  keywords: [
    "lawn care Bloomington IL",
    "lawncare Normal IL",
    "lawn mowing McLean County",
    "lawn service Bloomington Normal",
    "landscaping McLean County IL",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Kellan Holloway Lawncare",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-cream text-gray-900 antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-gold focus:text-green">
          Skip to main content
        </a>
        <NavBar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
