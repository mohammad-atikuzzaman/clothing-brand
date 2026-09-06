import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AppShell } from "@/components/AppShell";
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
  title: "Izhaan | Wear the heritage. Own the trend. – Panjabi",
  description: "Izhaan Lifestyle - Premium Panjabi collection in Bangladesh. Best quality, reasonable price, and nationwide Cash on Delivery.",
  icons: {
    icon: "https://izhaanlifestyle.com/wp-content/uploads/2026/01/Izhaan-logo-150x150.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        <AppShell>{children}</AppShell>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
