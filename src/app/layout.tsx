import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SiteChrome } from "@/components/SiteChrome";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bid-NYUAD",
  description: "NYUAD campus currency bidding marketplace"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
