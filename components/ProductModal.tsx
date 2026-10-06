"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Clock, Coins, Info, ShieldCheck, X, Zap } from "lucide-react";
import { earnablePoints, flashDealFor, formatRupiah, POINTS_EXPIRY_DAYS, productBySlug, TARGET_FIELDS, type Product } from "@/lib/catalog";
import { ProductArt } from "@/components/ProductArt";

interface ModalState {
  open: (slug: string, nominalId?: string) => void;
}

const ModalContext = createContext<ModalState>({ open: () => {} });
export const useProductModal = () => useContext(ModalContext);

/**
 * One detail panel for the whole site, like a streaming catalogue's title
 * preview: any card, the billboard or a search result opens it.
 */
export function ProductModalProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<{ product: Product; nominalId?: string } | null>(null);
  const open = useCallback((slug: string, nominalId?: string) => {
    const product = productBySlug(slug);
    if (product) setCurrent({ product, nominalId });
  }, []);
  const value = useMemo(() => ({ open }), [open]);
  return (
    <ModalContext.Provider value={value}>
      {children}
      {current && (
        <ProductDialog key={current.product.slug} product={current.product} initialNominal={current.nominalId} onClose={() => setCurrent(null)} />
      )}
    </ModalContext.Provider>
  );
}

function ProductDialog({ product, initialNominal, onClose }: { product: Product; initialNominal?: string; onClose: () => void }) {
  const target = TARGET_FIELDS[product.target];
  const [nominalId, setNominalId] = useState(initialNominal ?? product.nominals[0]?.id);
  const [values, setValues] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [voucher, setVoucher] = useState("");
  const [voucherNote, setVoucherNote] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    opener.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [onClose]);

  const nominal = product.nominals.find((x) => x.id === nominalId);
  const isBill = (nominal?.price ?? 0) === 0;
  const deal = flashDealFor(product.slug, nominal?.id);
  const payable = deal?.price ?? nominal?.price ?? 0;
  const errors = target.fields
    .filter((f) => (values[f.key] ?? "").replace(/\D/g, "").length < f.minLength)
    .map((f) => f.key);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (errors.length > 0 || !nominal) return;
    setNotice(
      isBill
        ? "Pengecekan tagihan belum tersambung di prototype ini. Belum ada transaksi yang dibuat."
        : "Pembayaran belum aktif di prototype ini. Belum ada transaksi yang dibuat dan tidak ada saldo yang terpotong."
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-night/70 px-3 py-6 sm:py-10" onMouseDown={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-3xl overflow-hidden rounded-2xl bg-warm-white shadow-2xl focus:outline-none"
      >
        {/* Header art */}
        <div className="relative">
          <ProductArt product={product} size="hero" className="h-44 sm:h-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-white via-warm-white/10 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-night/70 text-white hover:bg-night"
          >
            <X size={20} />
          </button>
          <div className="absolute inset-x-5 bottom-3 flex items-end gap-4 sm:inset-x-8">
            {product.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image} alt="" aria-hidden="true" className={`size-20 shrink-0 rounded-2xl shadow-xl ${product.logo ? "logo-tile object-contain p-2" : "object-cover"} ring-2 ring-warm-white sm:size-24`} />
            )}
            <h2 id="product-title" className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{product.name}</h2>
          </div>
        </div>

        <form onSubmit={submit} className="grid gap-6 px-5 pb-6 pt-2 sm:grid-cols-[1fr_17rem] sm:px-8 sm:pb-8">
          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              {product.badge && <span className="rounded bg-terracotta px-2 py-0.5 text-white">{product.badge}</span>}
              <span className="inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-muted"><Clock size={12} /> {product.processTime}</span>
              <span className="inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-muted"><ShieldCheck size={12} /> Proses otomatis</span>
            </div>
            <p className="text-sm leading-relaxed text-ink/85">{product.description}</p>

            <fieldset>
              <legend className="mb-2 text-sm font-bold text-ink">1. Pilih nominal</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {product.nominals.map((x) => {
                  const selected = x.id === nominalId;
                  const flash = flashDealFor(product.slug, x.id);
                  const compareAt = flash ? x.price : x.compareAt;
                  return (
                    <label
                      key={x.id}
                      className={`flex cursor-pointer flex-col gap-0.5 rounded-xl border p-3 text-left transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-karyalo-green has-[:focus-visible]:ring-offset-2 ${
                        selected ? "border-karyalo-green bg-soft-sage ring-1 ring-karyalo-green" : "border-deep-pine/15 bg-white hover:border-karyalo-green/60"
                      }`}
                    >
                      <input type="radio" name="nominal" value={x.id} checked={selected} onChange={() => setNominalId(x.id)} className="sr-only" />
                      {flash && (
                        <span className="inline-flex w-fit items-center gap-0.5 rounded bg-terracotta px-1.5 py-px text-[10px] font-bold uppercase tracking-wide text-white">
                          <Zap size={10} aria-hidden="true" /> Flash sale
                        </span>
                      )}
                      <span className="text-[13px] font-semibold text-ink">{x.label}</span>
                      {x.price > 0 ? (
                        <span className="flex flex-wrap gap-x-1 text-xs tabular-nums text-muted">
                          {compareAt && <s>{formatRupiah(compareAt)}</s>}
                          <span className={compareAt ? "font-bold text-terracotta" : ""}>{formatRupiah(flash?.price ?? x.price)}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-muted">Jumlah dicek dulu</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-1 text-sm font-bold text-ink">2. Isi {target.label.replace(/^\w/, (c) => c.toLowerCase())}</legend>
              <p className="mb-2 text-xs text-muted">{target.hint}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {target.fields.map((f) => {
                  const invalid = touched && errors.includes(f.key);
                  return (
                    <label key={f.key} className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-ink">{f.label}</span>
                      <input
                        inputMode={f.inputMode}
                        autoComplete="off"
                        value={values[f.key] ?? ""}
                        onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                        placeholder={f.key === "phone" ? "08xxxxxxxxxx" : ""}
                        aria-invalid={invalid}
                        className={`h-11 rounded-xl border bg-white px-3 text-sm text-ink tabular-nums focus:outline-none focus:ring-2 focus:ring-karyalo-green ${invalid ? "border-status-critical" : "border-deep-pine/20"}`}
                      />
                      {invalid && <span className="text-xs text-status-critical">Minimal {f.minLength} digit.</span>}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>

          {/* Summary */}
          <aside className="flex flex-col gap-3 self-start rounded-2xl border border-deep-pine/10 bg-soft-sand p-4 sm:sticky sm:top-4">
            <h3 className="text-sm font-bold text-ink">Ringkasan</h3>
            <dl className="flex flex-col gap-1.5 text-[13px]">
              <div className="flex justify-between gap-2"><dt className="text-muted">Produk</dt><dd className="text-right font-medium text-ink">{product.name}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-muted">Nominal</dt><dd className="text-right font-medium text-ink">{nominal?.label ?? "-"}</dd></div>
              {deal && nominal && (
                <div className="flex justify-between gap-2">
                  <dt className="inline-flex items-center gap-1 text-terracotta"><Zap size={12} aria-hidden="true" /> Flash sale</dt>
                  <dd className="text-right font-medium tabular-nums text-terracotta">−{formatRupiah(nominal.price - deal.price)}</dd>
                </div>
              )}
              <div className="flex justify-between gap-2 border-t border-border pt-2">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="text-right text-base font-extrabold tabular-nums text-ink">{payable > 0 ? formatRupiah(payable) : "Dicek dulu"}</dd>
              </div>
              {payable > 0 && (
                <div className="flex justify-between gap-2 text-xs">
                  <dt className="inline-flex items-center gap-1 text-muted"><Coins size={12} aria-hidden="true" /> Poin member</dt>
                  <dd className="text-right font-semibold tabular-nums text-status-success">+{earnablePoints(payable).toLocaleString("id-ID")}</dd>
                </div>
              )}
            </dl>
            {deal && (
              <p className="text-[11px] text-terracotta">Sisa kuota flash sale: {deal.quota - deal.sold} dari {deal.quota}.</p>
            )}
            {!isBill && (
              <div className="flex flex-col gap-1">
                <label htmlFor="voucher" className="text-xs font-semibold text-ink">Kode voucher</label>
                <div className="flex gap-1.5">
                  <input
                    id="voucher"
                    value={voucher}
                    onChange={(e) => { setVoucher(e.target.value.toUpperCase()); setVoucherNote(null); }}
                    autoComplete="off"
                    className="h-9 min-w-0 flex-1 rounded-lg border border-deep-pine/20 bg-white px-2.5 text-xs uppercase tracking-wide text-ink focus:outline-none focus:ring-2 focus:ring-karyalo-green"
                  />
                  <button
                    type="button"
                    disabled={!voucher.trim()}
                    onClick={() => setVoucherNote("Voucher khusus member. Login member belum aktif di prototype ini, jadi voucher belum bisa dipakai.")}
                    className="h-9 rounded-lg border border-karyalo-green px-3 text-xs font-bold text-karyalo-green hover:bg-soft-sage disabled:opacity-40"
                  >
                    Pakai
                  </button>
                </div>
                {voucherNote && <p role="status" className="text-[11px] leading-relaxed text-muted">{voucherNote}</p>}
              </div>
            )}
            <button type="submit" className="h-11 rounded-xl bg-karyalo-green text-sm font-bold text-white transition-colors hover:bg-deep-pine">
              {isBill ? "Cek tagihan" : "Lanjut ke pembayaran"}
            </button>
            {notice && (
              <p role="status" className="flex gap-2 rounded-xl border border-terracotta-soft bg-terracotta-soft/40 p-2.5 text-xs leading-relaxed text-ink">
                <Info size={14} className="mt-0.5 shrink-0 text-terracotta" /> {notice}
              </p>
            )}
            <p className="text-[11px] leading-relaxed text-muted">
              Harga dan nominal di halaman ini adalah data contoh. Poin member: 1 poin = Rp1, berlaku {POINTS_EXPIRY_DAYS} hari.
            </p>
          </aside>
        </form>
      </div>
    </div>
  );
}
