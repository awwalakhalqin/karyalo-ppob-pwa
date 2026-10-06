/* eslint-disable @next/next/no-img-element -- images are static and unoptimized (next.config) */
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
 * The product's "poster".
 *
 * With artwork: the square app icon is shown whole — a landscape card would crop
 * the character — over a blurred, enlarged copy of itself, so each card takes
 * the colours of its game. A brand logo (operator, PLN, e-wallet) sits whole on
 * a light tile instead — blurring a logo on white only gives grey mush. Without
 * artwork: a gradient, the category icon as a watermark, and the name set as type.
 */
export function ProductArt({ product, size = "card", className = "" }: { product: Product; size?: "card" | "tall" | "hero"; className?: string }) {
  const Icon = ART_ICONS[product.art.icon];

  if (product.image && product.logo && size !== "hero") {
    const tall = size === "tall";
    return (
      <div className={`relative isolate overflow-hidden bg-gradient-to-br from-white to-soft-sage ${className}`} aria-hidden="true">
        <div className={tall ? "flex h-full flex-col justify-between p-2.5" : "flex h-full items-end gap-3 p-3"}>
          <img src={product.image} alt="" loading="lazy" className={`aspect-square shrink-0 rounded-xl bg-white object-contain shadow-sm ring-1 ring-border ${tall ? "w-full" : "h-[62%]"}`} />
          <span className={`min-w-0 font-extrabold leading-tight tracking-tight text-ink ${tall ? "text-[15px]" : "pb-1 text-base sm:text-lg"}`}>{product.name}</span>
        </div>
      </div>
    );
  }

  if (product.image && !product.logo) {
    return (
      <div className={`relative isolate overflow-hidden bg-night ${className}`} aria-hidden="true">
        <img src={product.image} alt="" loading="lazy" className="absolute inset-0 -z-10 size-full scale-125 object-cover opacity-80 blur-xl" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night/85 via-night/25 to-night/10" />
        {size === "card" && (
          <div className="flex h-full items-end gap-3 p-3">
            <img src={product.image} alt="" loading="lazy" className="aspect-square h-[62%] shrink-0 rounded-xl object-cover shadow-lg ring-1 ring-white/20" />
            <span className="min-w-0 pb-1 text-base font-extrabold leading-tight tracking-tight text-white drop-shadow sm:text-lg">{product.name}</span>
          </div>
        )}
        {size === "tall" && (
          <div className="flex h-full flex-col justify-between p-2.5">
            <img src={product.image} alt="" loading="lazy" className="aspect-square w-full rounded-lg object-cover shadow-lg ring-1 ring-white/20" />
            <span className="text-[15px] font-extrabold leading-tight tracking-tight text-white drop-shadow">{product.name}</span>
          </div>
        )}
      </div>
    );
  }

  const nameClass = size === "tall" ? "text-xl" : "text-base sm:text-lg";
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
