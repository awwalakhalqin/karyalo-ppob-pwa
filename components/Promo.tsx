"use client";

/* eslint-disable @next/next/no-img-element -- images are static and unoptimized (next.config) */
import { useEffect, useState } from "react";
import { Flame, Zap } from "lucide-react";
import { flashSessionEnd, formatRupiah, productBySlug, type FlashDeal } from "@/lib/catalog";
import { useProductModal } from "@/components/ProductModal";
import { ProductArt } from "@/components/ProductArt";

const pad = (v: number) => String(v).padStart(2, "0");

/**
 * Time left in the current flash-sale session. The clock is the visitor's own,
 * so nothing renders until mount — the server can't know it.
 */
export function FlashCountdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setLeft(Math.max(0, flashSessionEnd(now) - now.getTime()));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const total = left === null ? null : Math.floor(left / 1000);
  const parts = total === null ? ["--", "--", "--"] : [pad(Math.floor(total / 3600)), pad(Math.floor((total % 3600) / 60)), pad(total % 60)];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted">
      Berakhir dalam
      <span className="inline-flex items-center gap-0.5 tabular-nums" role="timer" aria-label={total === null ? undefined : `${parts[0]} jam ${parts[1]} menit ${parts[2]} detik`}>
        {parts.map((v, i) => (
          <span key={i} className="flex items-center gap-0.5">
            {i > 0 && <span aria-hidden="true" className="text-terracotta">:</span>}
            <span aria-hidden="true" className="min-w-[1.75rem] rounded bg-terracotta px-1 py-0.5 text-center text-sm font-bold text-white">{v}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

/** One flash-sale nominal: key art, the cut price, and how much of the quota is gone. */
export function FlashSaleCard({ deal }: { deal: FlashDeal }) {
  const { open } = useProductModal();
  const product = productBySlug(deal.slug);
  const nominal = product?.nominals.find((x) => x.id === deal.nominalId);
  if (!product || !nominal) return null;

  const off = Math.round((1 - deal.price / nominal.price) * 100);
  const soldPct = Math.min(100, Math.round((deal.sold / deal.quota) * 100));
  const left = deal.quota - deal.sold;
  const almostGone = soldPct >= 80;

  return (
    <button
      type="button"
      onClick={() => open(deal.slug, deal.nominalId)}
      className="group/fs surface flex w-40 shrink-0 snap-start flex-col overflow-hidden rounded-lg text-left transition-[transform,box-shadow] duration-200 hover:surface-hover hover:scale-[1.03] focus-visible:scale-[1.03] active:scale-[0.98] sm:w-48"
    >
      <span className="relative">
        {product.image && product.logo ? (
          <span className="tile-navy flex aspect-square w-full items-center justify-center p-5">
            <img src={product.image} alt="" loading="lazy" className="logo-tile aspect-square w-full rounded-xl object-contain p-[4%] shadow-lg ring-1 ring-white/20" />
          </span>
        ) : product.image ? (
          <img src={product.image} alt="" loading="lazy" className="block aspect-square w-full object-cover" />
        ) : (
          <ProductArt product={product} className="aspect-square" />
        )}
        <span className="absolute left-2 top-2 rounded bg-terracotta px-1.5 py-0.5 text-[11px] font-extrabold text-white">−{off}%</span>
      </span>
      <span className="flex flex-1 flex-col gap-1 p-2.5">
        <span className="truncate text-xs text-muted">{product.name}</span>
        <span className="truncate text-[13px] font-semibold text-ink">{nominal.label}</span>
        <span className="text-base font-extrabold leading-none tabular-nums text-terracotta">{formatRupiah(deal.price)}</span>
        <s className="text-[11px] tabular-nums text-muted">{formatRupiah(nominal.price)}</s>
        <span className="mt-1 flex flex-col gap-1">
          <span className="block h-1.5 overflow-hidden rounded-full bg-terracotta-soft" role="presentation">
            <span className="block h-full rounded-full bg-terracotta" style={{ width: `${soldPct}%` }} />
          </span>
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${almostGone ? "text-terracotta" : "text-muted"}`}>
            {almostGone && <Flame size={11} aria-hidden="true" />}
            {almostGone ? `Sisa ${left}, hampir habis` : `Terjual ${deal.sold} dari ${deal.quota}`}
          </span>
        </span>
      </span>
    </button>
  );
}

/** Row heading extras for the flash-sale shelf. */
export function FlashSaleTitle() {
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="inline-flex items-center gap-1.5 text-lg font-bold tracking-tight text-ink sm:text-xl">
        <Zap size={19} className="fill-terracotta text-terracotta" aria-hidden="true" /> Flash Sale
      </span>
      <FlashCountdown />
    </span>
  );
}
