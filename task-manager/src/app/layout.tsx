import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import { Navigation } from "@/components/Navigation";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { ParticleEffect } from "@/components/ParticleEffect";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "任务管理系统",
  description: "局域网协作任务管理平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>
          <BackgroundVideo />
          <ParticleEffect />
          <Navigation />
          <main className="min-h-screen pt-28 pb-12 px-6">
            {children}
          </main>
          <Toaster />
        </ClientBody>
      </body>
    </html>
  );
}
