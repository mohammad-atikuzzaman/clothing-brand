import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout & Shipping | Izhaan Lifestyle",
  description:
    "Complete your order with secure Cash on Delivery (COD) or bKash. Fast, reliable shipping across Bangladesh.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
