import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProductModalProvider } from "@/components/ProductModal";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Karyalo PPOB — Top Up & Tagihan", template: "%s — Karyalo PPOB" },
  description: "Top up game, pulsa & paket data, token PLN, tagihan bulanan, dan saldo e-money dalam satu tempat.",
  manifest: "/manifest.json",
  icons: { icon: "/icons/icon-192.png", apple: "/icons/icon-192.png" },
};

export const viewport: Viewport = {
  themeColor: "#1e2f5c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={inter.variable}>
      <body>
        <ProductModalProvider>{children}</ProductModalProvider>
      </body>
    </html>
  );
}
