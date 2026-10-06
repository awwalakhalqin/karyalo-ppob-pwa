"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { formatRupiah, productBySlug, startingPrice, type Product } from "@/lib/catalog";
import { useProductModal } from "@/components/ProductModal";
import { ProductArt } from "@/components/ProductArt";

/**
 * A horizontally scrolling shelf — the core of a streaming catalogue page.
 * Arrows page by one screen width on pointer devices; touch scrolls natively.
 */
export function Row({ id, title, href, children }: { id?: string; title: string; href?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  };
  useEffect(update, []);

  const page = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.9, behavior: "smooth" });

  return (
    <section id={id} aria-label={title} className="group/row relative scroll-mt-24">
      <div className="mb-2 flex items-baseline gap-3 px-4 sm:px-8">
        <h2 className="text-lg font-bold tracking-tight text-ink sm:text-xl">{title}</h2>
        {href && (
          <Link href={href} className="text-xs font-semibold text-karyalo-green opacity-0 transition-opacity group-hover/row:opacity-100 focus-visible:opacity-100 max-lg:opacity-100">
            Lihat semua ›
          </Link>
        )}
      </div>
      <div className="relative">
        <div ref={ref} onScroll={update} className="row-scroller flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-px-4 px-4 py-3 sm:scroll-px-8 sm:gap-3 sm:px-8">
          {children}
        </div>
        {!edges.start && (
          <button type="button" onClick={() => page(-1)} aria-label={`Geser ${title} ke kiri`} className="absolute inset-y-3 left-0 z-10 hidden w-10 items-center justify-center bg-warm-white/80 text-ink opacity-0 transition-opacity group-hover/row:opacity-100 sm:flex">
            <ChevronLeft size={28} />
          </button>
        )}
        {!edges.end && (
          <button type="button" onClick={() => page(1)} aria-label={`Geser ${title} ke kanan`} className="absolute inset-y-3 right-0 z-10 hidden w-10 items-center justify-center bg-warm-white/80 text-ink opacity-0 transition-opacity group-hover/row:opacity-100 sm:flex">
            <ChevronRight size={28} />
          </button>
        )}
      </div>
    </section>
  );
}

/** Landscape card that lifts on hover and reveals price and speed. */
export function ProductCard({ product }: { product: Product }) {
  const { open } = useProductModal();
  const from = startingPrice(product);
  return (
    <button
      type="button"
      onClick={() => open(product.slug)}
      className="group/card relative w-[44vw] shrink-0 snap-start overflow-hidden rounded-lg text-left shadow-sm transition-transform duration-200 hover:z-10 hover:scale-[1.06] focus-visible:scale-[1.06] sm:w-56 lg:w-64"
    >
      <ProductArt product={product} className="aspect-video" />
      {product.badge && (
        <span className="absolute right-2 top-2 rounded bg-terracotta px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">{product.badge}</span>
      )}
      <span className="absolute inset-x-0 bottom-0 translate-y-full bg-night/95 px-3 py-2 text-xs text-white transition-transform duration-200 group-hover/card:translate-y-0 group-focus-visible/card:translate-y-0">
        <span className="block font-semibold">{from ? `Mulai ${formatRupiah(from)}` : "Cek & bayar tagihan"}</span>
        <span className="block text-white/70">Proses {product.processTime}</span>
      </span>
    </button>
  );
}

/** "Top 10" card: a large outlined rank numeral beside a portrait card. */
export function RankCard({ product, rank }: { product: Product; rank: number }) {
  const { open } = useProductModal();
  return (
    <button
      type="button"
      onClick={() => open(product.slug)}
      aria-label={`Peringkat ${rank}: ${product.name}`}
      className="group/rank flex shrink-0 snap-start items-end text-left"
    >
      <span
        aria-hidden="true"
        className="-mr-4 select-none text-[7rem] font-black leading-[0.8] tracking-tighter text-warm-white sm:text-[9rem]"
        style={{ WebkitTextStroke: "3px var(--color-deep-pine)" }}
      >
        {rank}
      </span>
      <span className="relative w-28 overflow-hidden rounded-lg shadow-md transition-transform duration-200 group-hover/rank:scale-105 sm:w-36">
        <ProductArt product={product} size="tall" className="aspect-[2/3]" />
      </span>
    </button>
  );
}

/** "Beli lagi": the catalogue's "continue watching", one tap to reorder. */
export function ReorderCard({ slug, nominalId, target, whenLabel }: { slug: string; nominalId: string; target: string; whenLabel: string }) {
  const { open } = useProductModal();
  const product = productBySlug(slug);
  const nominal = product?.nominals.find((x) => x.id === nominalId);
  if (!product || !nominal) return null;
  return (
    <button
      type="button"
      onClick={() => open(slug, nominalId)}
      className="group/re w-[60vw] shrink-0 snap-start overflow-hidden rounded-lg bg-white text-left shadow-sm ring-1 ring-border transition-transform duration-200 hover:scale-[1.04] sm:w-64"
    >
      <div className="relative">
        <ProductArt product={product} className="aspect-video" />
        <span className="absolute inset-0 flex items-center justify-center bg-night/0 opacity-0 transition group-hover/re:bg-night/40 group-hover/re:opacity-100">
          <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink"><RotateCcw size={13} /> Beli lagi</span>
        </span>
      </div>
      <span className="block px-3 py-2">
        <span className="block truncate text-[13px] font-semibold text-ink">{nominal.label}</span>
        <span className="block truncate text-xs text-muted">{target} · {whenLabel}</span>
      </span>
    </button>
  );
}
