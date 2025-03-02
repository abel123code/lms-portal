import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderMenu from "@/components/HeaderMenu";
import { SessionProvider } from "next-auth/react";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LMS System",
  description: "A tool to improve student's learning experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <HeaderMenu />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
