import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | Izhaan Lifestyle",
  description:
    "Review items in your shopping cart. Premium designer Panjabis and luxury menswear with nationwide delivery.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
