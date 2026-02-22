import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { SupportChat } from "@/components/SupportChat";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

const inter = Inter({ subsets: ["latin", "cyrillic"] });
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-hero",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://energy-practice.org";
const iconUrl = "https://res.cloudinary.com/dij7s1nbf/image/upload/v1769356927/5453934422802501391_wfkxhr.jpg";

export const metadata: Metadata = {
  title: "Ирина Головатова | Энергия Первоначальности",
  description: "Энергетическое Клеточное Пробуждение и исцеление на уровне ДНК",
  metadataBase: new URL(siteUrl),
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Энергия Первоначальности",
  },
  icons: {
    icon: iconUrl,
    apple: iconUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${inter.className} ${cormorant.variable} bg-[#000000] text-white antialiased`}>
        {children}
        <SupportChat />
      </body>
    </html>
  );
}
