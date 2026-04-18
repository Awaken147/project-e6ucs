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
  title: "SubzAgency — Sikkim's #1 Cinematic 3D Web Agency",
  description: "Stunning 3D websites with anime.js, Three.js, and cinematic animations. Premium web design from Gangtok, Sikkim, India at super affordable prices. Starting ₹9,999.",
  keywords: ["3D website", "cinematic web design", "Sikkim web agency", "Gangtok web design", "affordable websites", "anime.js", "Three.js", "Next.js", "web development Sikkim"],
  authors: [{ name: "SubzAgency" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "SubzAgency — Sikkim's Cinematic 3D Web Agency",
    description: "Premium 3D websites from Gangtok, Sikkim. Starting at ₹9,999. No hidden charges.",
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
