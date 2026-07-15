import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SubnetStreak | CCNA IPv4 Trainer",
  description: "Gamified, mathematically accurate IPv4 subnetting practice.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
