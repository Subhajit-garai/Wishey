import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Header } from "@/designs/header/Header";
import { Footer } from "@/designs/footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: "Wishey - Premium Digital Wishing Cards & Celebrations",
  description:
    "Create, customize, and share beautiful, animated digital wishing cards for birthdays, anniversaries, weddings, Valentine's Day, and special milestones. Experience premium designs and interactive layouts.",
  keywords: [
    "digital wishing cards",
    "e-cards",
    "birthday wishes",
    "wedding wishes",
    "anniversary greetings",
    "interactive e-cards",
    "online greetings",
    "custom cards",
    "wishey",
  ],
  authors: [{ name: "Wishey Team" }],
  openGraph: {
    title: "Wishey - Premium Digital Wishing Cards & Celebrations",
    description:
      "Design and share stunning, animated digital wishing cards with custom themes, music, and interactive overlays.",
    url: "https://wishey.com",
    siteName: "Wishey",
    images: [
      {
        url: "/logo.svg",
        width: 512,
        height: 512,
        alt: "Wishey Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wishey - Premium Digital Wishing Cards & Celebrations",
    description:
      "Design and share stunning, animated digital wishing cards with custom themes, music, and interactive overlays.",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {adsenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col">
        <Header LogoUrl="/logo.svg" BrandName="Wishey" />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
