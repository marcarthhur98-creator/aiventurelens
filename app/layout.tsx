import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIventureLens — Startup Security & Risk Scanner",
  description:
    "Assess your startup's security and operational risk posture across 4 domains. Get an AI-powered Venture Risk Score and prioritized action items to become investment ready.",
  openGraph: {
    title: "AIventureLens — Startup Security & Risk Scanner",
    description:
      "Get your Venture Risk Score — AI-powered security assessment for early-stage startups.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-100 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
