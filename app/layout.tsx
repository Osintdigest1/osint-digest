import type { Metadata } from "next";

import {
  Orbitron,
  Rajdhani,
} from "next/font/google";

import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-rajdhani",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "OSINT.DIGEST",
  description:
    "Global OSINT Monitoring Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${rajdhani.variable}`}
      >
        {children}
      </body>
    </html>
  );
}