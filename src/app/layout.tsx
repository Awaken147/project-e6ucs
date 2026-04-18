import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SubzAgency — India's #1 Cinematic 3D Web Agency",
  description: "Stunning 3D websites with anime.js, Three.js, and cinematic animations. Premium web design at super affordable Indian prices. Starting ₹4,999.",
  keywords: ["3D website", "cinematic web design", "India web agency", "affordable websites", "anime.js", "Three.js", "Next.js", "web development India"],
  authors: [{ name: "SubzAgency" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "SubzAgency — Cinematic 3D Web Agency",
    description: "Premium 3D websites starting at ₹4,999. No hidden charges.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#030014] text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
