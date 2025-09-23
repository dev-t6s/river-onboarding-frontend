import type { Metadata } from "next";
import "./globals.css";
import { FacebookProvider } from "../context/FacebookContext";
import { DiscordProvider } from "@/context/DiscordLogContext";

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
    <html lang="en">
      <body className={`antialiased`}>
        <DiscordProvider
          webhookUrl={process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL!}
          defaultMetadata={{ appVersion: "1.0.0" }}
          threadId={process.env.NEXT_PUBLIC_DISCORD_THREAD_ID}
        >
          <FacebookProvider
            initialFacebookAppId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
          >
            {children}
          </FacebookProvider>
        </DiscordProvider>
      </body>
    </html>
  );
}
