import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Ирина Головатова | Энергия Первоначальности",
  description: "Энергетическое Клеточное Пробуждение и исцеление на уровне ДНК",
  icons: {
    icon: "https://res.cloudinary.com/dij7s1nbf/image/upload/v1769356927/5453934422802501391_wfkxhr.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${inter.className} bg-[#000000] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
