import { Gamepad2, Receipt, Smartphone, Ticket, Wallet, Zap, type LucideIcon } from "lucide-react";
import type { ArtIcon, Product } from "@/lib/catalog";

export const ART_ICONS: Record<ArtIcon, LucideIcon> = {
  game: Gamepad2,
  phone: Smartphone,
  zap: Zap,
  receipt: Receipt,
  wallet: Wallet,
  ticket: Ticket,
};

/**
 * The product's "poster": a brand-neutral gradient, the category icon as a
 * large watermark, and the name set as type. No third-party logos.
 */
export function ProductArt({ product, size = "card", className = "" }: { product: Product; size?: "card" | "tall" | "hero"; className?: string }) {
  const Icon = ART_ICONS[product.art.icon];
  const nameClass =
    size === "hero" ? "text-4xl sm:text-6xl" : size === "tall" ? "text-xl" : "text-base sm:text-lg";
  return (
    <div
      className={`relative isolate overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${product.art.from} 0%, ${product.art.to} 100%)` }}
      aria-hidden="true"
    >
      <Icon className="absolute -right-4 -bottom-6 -z-10 size-32 rotate-[-12deg] text-white/12 sm:size-40" strokeWidth={1.4} />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.18),transparent_55%)]" />
      {size !== "hero" && (
        <div className="flex h-full flex-col justify-between p-3">
          <Icon className="size-5 text-white/85" strokeWidth={2} />
          <span className={`font-extrabold leading-tight tracking-tight text-white drop-shadow-sm ${nameClass}`}>{product.name}</span>
        </div>
      )}
    </div>
  );
}
