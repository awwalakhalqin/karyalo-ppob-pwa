"use client";

import { Info, Zap, Clock, ShieldCheck } from "lucide-react";
import { formatRupiah, startingPrice, type Product } from "@/lib/catalog";
import { useProductModal } from "@/components/ProductModal";
import { ART_ICONS } from "@/components/ProductArt";

/**
 * The billboard: one featured product across the top of the page, with the
 * two actions a catalogue billboard offers — act now, or read more.
 */
export function Hero({ product, eyebrow, compact = false }: { product: Product; eyebrow: string; compact?: boolean }) {
  const { open } = useProductModal();
  const Icon = ART_ICONS[product.art.icon];
  const from = startingPrice(product);

  return (
    <section
      aria-label={`Unggulan: ${product.name}`}
      className={`relative isolate flex items-end overflow-hidden bg-night ${compact ? "min-h-[46vh] sm:min-h-[52vh]" : "min-h-[72vh] sm:min-h-[80vh]"}`}
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
            className={`absolute right-[6%] top-1/2 -z-10 hidden aspect-square w-[min(34vw,26rem)] -translate-y-1/2 rotate-3 rounded-[2rem] bg-white shadow-2xl ${product.logo ? "object-contain" : "object-cover"} ring-1 ring-white/25 md:block`}
          />
        </>
      ) : (
        <Icon aria-hidden="true" className="absolute -right-10 top-1/2 -z-10 size-[26rem] -translate-y-1/2 rotate-[-10deg] text-white/10 sm:size-[38rem]" strokeWidth={1.1} />
      )}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-night/90 via-night/40 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-warm-white" />

      <div className={`w-full px-4 sm:px-8 ${compact ? "pb-14 pt-32" : "pb-24 pt-36 sm:pb-32"}`}>
        <div>
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent-cyan">
            <Zap size={14} aria-hidden="true" /> {eyebrow}
          </p>
          <h1 className="max-w-2xl text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-7xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/85">
            {from && <span className="font-bold text-white">Mulai {formatRupiah(from)}</span>}
            <span className="inline-flex items-center gap-1"><Clock size={14} aria-hidden="true" /> {product.processTime}</span>
            <span className="inline-flex items-center gap-1"><ShieldCheck size={14} aria-hidden="true" /> Proses otomatis</span>
          </div>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">{product.tagline} {product.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => open(product.slug)}
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-white px-6 text-base font-bold text-night transition-colors hover:bg-white/85"
            >
              <Zap size={18} aria-hidden="true" /> Top up sekarang
            </button>
            <button
              type="button"
              onClick={() => open(product.slug)}
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-white/20 px-6 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              <Info size={18} aria-hidden="true" /> Info lengkap
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
