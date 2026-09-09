import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist | Izhaan Lifestyle",
  description:
    "View your saved designer Panjabi styles and favorite luxury menswear pieces.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
