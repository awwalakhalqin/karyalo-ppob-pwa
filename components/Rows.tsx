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
export function Row({ id, title, heading, href, children }: { id?: string; title: string; heading?: React.ReactNode; href?: string; children: React.ReactNode }) {
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
        <h2 className="text-lg font-bold tracking-tight text-ink sm:text-xl">{heading ?? title}</h2>
        {href && (
          <Link href={href} className="inline-flex items-center text-xs font-semibold text-karyalo-green opacity-0 transition-opacity group-hover/row:opacity-100 focus-visible:opacity-100 max-lg:opacity-100">
            Lihat semua <ChevronRight size={14} aria-hidden="true" />
          </Link>
        )}
      </div>
      <div className="relative">
        <div ref={ref} onScroll={update} className="row-scroller flex snap-x snap-mandatory gap-2 overflow-x-auto overflow-y-hidden scroll-px-4 px-4 py-3 sm:scroll-px-8 sm:gap-3 sm:px-8">
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
export function ProductCard({ product, fluid = false }: { product: Product; fluid?: boolean }) {
  const { open } = useProductModal();
  const from = startingPrice(product);
  return (
    <button
      type="button"
      onClick={() => open(product.slug)}
      className={`group/card relative overflow-hidden rounded-lg text-left shadow-[0_1px_2px_rgb(30_47_92/0.06),0_8px_20px_-10px_rgb(30_47_92/0.25)] transition-transform duration-200 hover:z-10 hover:scale-[1.04] focus-visible:scale-[1.04] active:scale-[0.98] ${fluid ? "w-full" : "w-[44vw] shrink-0 snap-start sm:w-56 lg:w-64"}`}
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
        className="-mr-3 shrink-0 select-none pb-[0.18em] text-[6rem] font-black leading-[0.8] tracking-tighter text-warm-white sm:-mr-4 sm:text-[8rem]"
        style={{ WebkitTextStroke: "3px var(--color-deep-pine)" }}
      >
        {rank}
      </span>
      <span className="relative mb-[1.1rem] w-28 shrink-0 overflow-hidden rounded-lg shadow-md transition-transform duration-200 group-hover/rank:scale-105 sm:mb-[1.45rem] sm:w-36">
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
      className="group/re surface flex w-[82vw] shrink-0 snap-start items-center gap-3 rounded-lg p-2.5 text-left transition-[box-shadow,transform] duration-200 hover:surface-hover active:scale-[0.98] sm:w-96"
    >
      {product.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.image} alt="" className={`size-14 shrink-0 rounded-lg ring-1 ring-deep-pine/10 ${product.logo ? "logo-tile object-contain p-1.5" : "object-cover"}`} />
      ) : (
        <ProductArt product={product} size="tall" className="size-14 shrink-0 rounded-lg" />
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-bold text-ink">{product.name}</span>
        <span className="block truncate text-[13px] text-ink/80">{nominal.label}</span>
        <span className="block truncate text-xs text-muted">{target}, {whenLabel.toLowerCase()}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1 rounded-md bg-soft-sage px-2.5 py-1.5 text-xs font-bold text-karyalo-green transition-colors group-hover/re:bg-karyalo-green group-hover/re:text-white">
        <RotateCcw size={13} aria-hidden="true" /> Beli lagi
      </span>
    </button>
  );
}
