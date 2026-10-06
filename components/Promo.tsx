"use client";

/* eslint-disable @next/next/no-img-element -- images are static and unoptimized (next.config) */
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame, Zap } from "lucide-react";
import { flashSessionEnd, formatRupiah, productBySlug, type FlashDeal, type PromoBanner } from "@/lib/catalog";
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
      className="group/fs flex w-40 shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-white text-left shadow-sm ring-1 ring-border transition-transform duration-200 hover:scale-[1.04] focus-visible:scale-[1.04] sm:w-48"
    >
      <span className="relative">
        {product.image ? (
          <img
            src={product.image}
            alt=""
            loading="lazy"
            className={`block aspect-square w-full bg-white ${product.logo ? "object-contain p-6" : "object-cover"}`}
          />
        ) : (
          <ProductArt product={product} className="aspect-square" />
        )}
        <span className="absolute left-2 top-2 rounded bg-terracotta px-1.5 py-0.5 text-[11px] font-extrabold text-white">−{off}%</span>
      </span>
      <span className="flex flex-1 flex-col gap-1 p-2.5">
        <span className="truncate text-[11px] font-semibold uppercase tracking-wide text-muted">{product.name}</span>
        <span className="truncate text-[13px] font-semibold text-ink">{nominal.label}</span>
        <span className="text-base font-extrabold leading-none tabular-nums text-terracotta">{formatRupiah(deal.price)}</span>
        <s className="text-[11px] tabular-nums text-muted">{formatRupiah(nominal.price)}</s>
        <span className="mt-1 flex flex-col gap-1">
          <span className="block h-1.5 overflow-hidden rounded-full bg-terracotta-soft" role="presentation">
            <span className="block h-full rounded-full bg-terracotta" style={{ width: `${soldPct}%` }} />
          </span>
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${almostGone ? "text-terracotta" : "text-muted"}`}>
            {almostGone && <Flame size={11} aria-hidden="true" />}
            {almostGone ? `Hampir habis · sisa ${left}` : `Terjual ${deal.sold} dari ${deal.quota}`}
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
      <span className="inline-flex items-center gap-1.5 text-lg font-black uppercase italic tracking-tight text-terracotta sm:text-xl">
        <Zap size={20} className="fill-terracotta" aria-hidden="true" /> Flash Sale
      </span>
      <FlashCountdown />
    </span>
  );
}

/**
 * An ad banner in the DeliaStore layout — copy on the left, a stack of game art
 * on the right — drawn in code so it stays sharp and editable.
 */
export function BannerCard({ banner }: { banner: PromoBanner }) {
  const art = banner.showcase.map((slug) => productBySlug(slug)).filter((p) => p?.image);
  const isHash = banner.href.startsWith("/#");
  const inner = (
    <>
      <span aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: `linear-gradient(115deg, ${banner.tone.from} 0%, ${banner.tone.from} 38%, ${banner.tone.to} 100%)` }} />
      <span aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.18),transparent_45%)]" />

      {/* Showcase: tilted app tiles on the right */}
      <span aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-[46%]">
        {art.slice(0, 4).map((p, i) => {
          const spots = [
            "right-[38%] top-[10%] w-[44%] -rotate-6",
            "right-[4%] top-[4%] w-[40%] rotate-6",
            "right-[30%] bottom-[6%] w-[36%] rotate-3",
            "right-[2%] bottom-[12%] w-[38%] -rotate-3",
          ];
          return (
            <img
              key={p!.slug}
              src={p!.image}
              alt=""
              loading="lazy"
              className={`absolute aspect-square rounded-2xl bg-white shadow-xl ring-2 ring-white/70 transition-transform duration-300 group-hover/bn:scale-105 ${p!.logo ? "object-contain p-1.5" : "object-cover"} ${spots[i]}`}
            />
          );
        })}
      </span>
      <span aria-hidden="true" className="absolute inset-y-0 left-0 -z-10 w-[70%] bg-gradient-to-r from-night/70 to-transparent" />

      <span className="flex h-full max-w-[60%] flex-col justify-center gap-1.5 p-4 sm:gap-2 sm:p-6">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white sm:text-[11px]">
          <span className="size-1.5 rounded-full bg-accent-cyan" /> {banner.eyebrow}
        </span>
        <span className="text-lg font-black leading-[1.05] tracking-tight text-white sm:text-2xl lg:text-[1.7rem]">
          {banner.title} <span className="text-accent-cyan">{banner.highlight}</span>
        </span>
        <span className="hidden text-xs leading-snug text-white/80 sm:line-clamp-2 sm:block">{banner.body}</span>
        <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-white py-1 pl-3 pr-1 text-xs font-bold text-night sm:text-[13px]">
          {banner.cta}
          <span className="flex size-5 items-center justify-center rounded-full bg-karyalo-green text-white sm:size-6"><ArrowRight size={13} /></span>
        </span>
      </span>
      {banner.sticker && (
        <span className="absolute bottom-3 right-3 rotate-[-6deg] rounded-full bg-terracotta-soft px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-terracotta shadow-lg sm:text-xs">
          {banner.sticker}
        </span>
      )}
    </>
  );
  const cls =
    "group/bn relative isolate aspect-[2/1] w-[86vw] shrink-0 snap-start overflow-hidden rounded-2xl shadow-md transition-transform duration-200 hover:scale-[1.02] focus-visible:scale-[1.02] sm:w-[34rem] lg:w-[40rem]";
  // In-page anchors use a plain <a> so the hash scroll works from any page.
  return isHash ? (
    <a href={banner.href} aria-label={`${banner.title} ${banner.highlight}`} className={cls}>{inner}</a>
  ) : (
    <Link href={banner.href} aria-label={`${banner.title} ${banner.highlight}`} className={cls}>{inner}</Link>
  );
}
