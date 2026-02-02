import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Relationship App - Трекер отношений",
  description: "Приложение для отслеживания отношений, подарков, настроения и важных моментов",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  );
}
