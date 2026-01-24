import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Маа'За'Тамее | Курс заочных ЭнергоМедитаций",
  description: "Энергетическое Клеточное Пробуждение и исцеление на уровне ДНК",
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
