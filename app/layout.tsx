import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lora Chavez — Landing Pages",
  description: "Landing pages professionnelles par Lora Chavez",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
