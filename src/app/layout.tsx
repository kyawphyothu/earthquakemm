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
  title: "Myanmar Earthquake Relief Fund",
  description: "Support victims of the recent Myanmar earthquake by donating to our relief fund. Every contribution helps with emergency aid, medical care, and recovery efforts.",
  keywords: ["Myanmar", "earthquake", "disaster relief", "fundraising", "donations", "humanitarian aid"],
  openGraph: {
    title: "Myanmar Earthquake Relief Fund",
    description: "Support victims of the recent Myanmar earthquake by donating to our relief fund.",
    images: [{ url: "/og-image.jpg" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Myanmar Earthquake Relief Fund",
    description: "Support victims of the recent Myanmar earthquake by donating to our relief fund.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
