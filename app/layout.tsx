import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Header } from "@/designs/header/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Wishey - Premium Digital Wishing Cards & Celebrations",
  description: "Create, customize, and share beautiful, animated digital wishing cards for birthdays, anniversaries, weddings, Valentine's Day, and special milestones. Experience premium designs and interactive layouts.",
  keywords: ["digital wishing cards", "e-cards", "birthday wishes", "wedding wishes", "anniversary greetings", "interactive e-cards", "online greetings", "custom cards", "wishey"],
  authors: [{ name: "Wishey Team" }],
  openGraph: {
    title: "Wishey - Premium Digital Wishing Cards & Celebrations",
    description: "Design and share stunning, animated digital wishing cards with custom themes, music, and interactive overlays.",
    url: "https://wishey.com",
    siteName: "Wishey",
    images: [
      {
        url: "/icons/cake_of_wishes.png",
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
    description: "Design and share stunning, animated digital wishing cards with custom themes, music, and interactive overlays.",
    images: ["/icons/cake_of_wishes.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header LogoUrl="/icons/cake_of_wishes.png" BrandName="Wishey" />
        <main> {children}</main>
        <Toaster />
      </body>
    </html>
  );
}
