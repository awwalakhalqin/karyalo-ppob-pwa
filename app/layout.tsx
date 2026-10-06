import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ProductModalProvider } from "@/components/ProductModal";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Karyalo PPOB: Top Up Game & Tagihan", template: "%s | Karyalo PPOB" },
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
    <html lang="id" className={geist.variable}>
      <body>
        <ProductModalProvider>{children}</ProductModalProvider>
      </body>
    </html>
  );
}
