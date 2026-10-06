"use client";

import { ChevronDown, Zap, Clock, ShieldCheck } from "lucide-react";
import { formatRupiah, startingPrice, type Product } from "@/lib/catalog";
import { useProductModal } from "@/components/ProductModal";
import { ART_ICONS } from "@/components/ProductArt";

/**
 * The billboard: one featured product across the top of the page, with the
 * two actions a catalogue billboard offers — act now, or read more.
 */
export function Hero({ product, eyebrow, compact = false, allHref }: { product: Product; eyebrow: string; compact?: boolean; allHref?: string }) {
  const { open } = useProductModal();
  const Icon = ART_ICONS[product.art.icon];
  const from = startingPrice(product);

  return (
    <section
      aria-label={`Unggulan: ${product.name}`}
      className={`relative isolate flex items-end overflow-hidden bg-night ${compact ? "min-h-[26rem] sm:min-h-[28rem]" : "min-h-[34rem] sm:min-h-[38rem]"}`}
    >
      {/* Artwork: the game's own image when there is one, the category icon otherwise */}
      <div className="absolute inset-0 -z-10" style={{ background: `linear-gradient(120deg, ${product.art.from} 0%, ${product.art.to} 70%, #0a1022 100%)` }} />
      {product.image ? (
        <>
          {!product.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt="" aria-hidden="true" className="absolute inset-0 -z-10 size-full scale-110 object-cover opacity-55 blur-2xl" />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt=""
            aria-hidden="true"
            className={`absolute right-[6%] top-1/2 -z-10 hidden aspect-square -translate-y-1/2 shadow-2xl md:block ${
              product.logo
                ? "logo-tile w-[min(20vw,13rem)] rounded-2xl object-contain p-5 ring-4 ring-white/15"
                : "w-[min(34vw,26rem)] rotate-3 rounded-[2rem] object-cover ring-1 ring-white/25"
            }`}
          />
        </>
      ) : (
        <Icon aria-hidden="true" className="absolute -right-10 top-1/2 -z-10 size-[26rem] -translate-y-1/2 rotate-[-10deg] text-white/10 sm:size-[38rem]" strokeWidth={1.1} />
      )}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-night/90 via-night/40 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-warm-white" />

      <div className={`w-full px-4 pt-28 sm:px-8 md:pt-24 ${compact ? "pb-14" : "pb-24"}`}>
        <div>
          <p className="mb-2 text-sm font-semibold text-accent-cyan">
            {eyebrow}
          </p>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/85">
            {from && <span className="font-bold text-white">Mulai {formatRupiah(from)}</span>}
            <span className="inline-flex items-center gap-1"><Clock size={14} aria-hidden="true" /> {product.processTime}</span>
            <span className="inline-flex items-center gap-1"><ShieldCheck size={14} aria-hidden="true" /> Proses otomatis</span>
          </div>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{product.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => open(product.slug)}
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-white px-6 text-base font-bold text-night transition-colors hover:bg-white/85"
            >
              <Zap size={18} aria-hidden="true" /> Top up sekarang
            </button>
            {allHref && (
              <a
                href={allHref}
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-white/15 px-6 text-base font-bold text-white transition-colors hover:bg-white/25"
              >
                <ChevronDown size={18} aria-hidden="true" /> Semua produk
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
