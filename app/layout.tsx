// Root layout: fonts, metadata and page wrapper
import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME, APP_SLOGAN } from "@/lib/constants";

const siteName: string = APP_NAME ?? "AfriMart";
const siteSlogan: string = APP_SLOGAN ?? "Your Gateway to African Products";
const siteDescription: string = APP_DESCRIPTION ?? "An African E-commerce Platform";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteSlogan}`,
  },
  description: siteDescription,
  icons: {
    icon: "/logo/AfriMartLog.png",
    shortcut: "/logo/AfriMartLog.png",
    apple: "/logo/AfriMartLog.png",
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
