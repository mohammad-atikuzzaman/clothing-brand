import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AppShell } from "@/components/AppShell";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import { Analytics } from "@/components/Analytics";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://izhaanlifestyle.com"),
  title: {
    default: "Izhaan | Wear the heritage. Own the trend. – Panjabi",
    template: "%s | Izhaan Lifestyle",
  },
  description:
    "Izhaan Lifestyle - Premium Panjabi collection in Bangladesh. Best quality, reasonable price, and nationwide Cash on Delivery.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: "https://izhaanlifestyle.com",
    siteName: "Izhaan Lifestyle",
    title: "Izhaan | Wear the heritage. Own the trend. – Panjabi",
    description:
      "Izhaan Lifestyle - Premium Panjabi collection in Bangladesh. Best quality, reasonable price, and nationwide Cash on Delivery.",
    images: [
      {
        url: "https://izhaanlifestyle.com/favicon.png",
        width: 150,
        height: 150,
        alt: "Izhaan Lifestyle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Izhaan | Wear the heritage. Own the trend. – Panjabi",
    description:
      "Izhaan Lifestyle - Premium Panjabi collection in Bangladesh. Best quality, reasonable price, and nationwide Cash on Delivery.",
    images: ["https://izhaanlifestyle.com/favicon.png"],
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
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-white text-neutral-900">
        <AppShell>{children}</AppShell>
        <Analytics />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
