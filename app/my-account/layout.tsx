import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account & Orders | Izhaan Lifestyle",
  description:
    "Manage your profile, view order tracking status, and see past orders at Izhaan Lifestyle.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
