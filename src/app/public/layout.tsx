import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "River Onboarding",
  description: "AI-Powered Meta Ads Audits for D2C Brands",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`antialiased`}>
      {children}
    </div>
  );
}
