import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CommandPalette from "@/components/CommandPalette";

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Arseniy | Personal OS",
  description: "16 лет · Севастополь · AI · CODE · BUSINESS · SPORT · LIFE",
  manifest: "/manifest.json",
  themeColor: "#10b981",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Arseniy OS",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Arseniy OS",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[#0a0a0a] text-[#ededed]`}>
        <Navbar />
        <CommandPalette />
        <main className="pt-14"> 
          {children}
        </main>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('SW registered:', registration);
                    })
                    .catch((error) => {
                      console.log('SW registration failed:', error);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}