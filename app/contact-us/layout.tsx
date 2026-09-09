import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Store Location | Izhaan Lifestyle",
  description:
    "Get in touch with Izhaan Lifestyle customer support. Visit our Banani showroom in Dhaka or message us on WhatsApp.",
  openGraph: {
    title: "Contact Us & Store Location | Izhaan Lifestyle",
    description:
      "Get in touch with Izhaan Lifestyle customer support. Visit our Banani showroom in Dhaka or message us on WhatsApp.",
    url: "https://izhaanlifestyle.com/contact-us",
  },
};

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
