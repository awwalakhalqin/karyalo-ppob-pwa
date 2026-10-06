"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Clock, Info, ShieldCheck, X } from "lucide-react";
import { formatRupiah, productBySlug, TARGET_FIELDS, type Product } from "@/lib/catalog";
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
          <div className="absolute inset-x-5 bottom-3 sm:inset-x-8">
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
                  return (
                    <label
                      key={x.id}
                      className={`flex cursor-pointer flex-col gap-0.5 rounded-xl border p-3 text-left transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-karyalo-green has-[:focus-visible]:ring-offset-2 ${
                        selected ? "border-karyalo-green bg-soft-sage ring-1 ring-karyalo-green" : "border-border bg-white hover:border-karyalo-green/50"
                      }`}
                    >
                      <input type="radio" name="nominal" value={x.id} checked={selected} onChange={() => setNominalId(x.id)} className="sr-only" />
                      <span className="text-[13px] font-semibold text-ink">{x.label}</span>
                      {x.price > 0 ? (
                        <span className="text-xs tabular-nums text-muted">
                          {x.compareAt && <s className="mr-1">{formatRupiah(x.compareAt)}</s>}
                          <span className={x.compareAt ? "font-bold text-terracotta" : ""}>{formatRupiah(x.price)}</span>
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
              <legend className="mb-1 text-sm font-bold text-ink">2. Isi {target.label.toLowerCase()}</legend>
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
                        className={`h-11 rounded-xl border bg-white px-3 text-sm text-ink tabular-nums focus:outline-none focus:ring-2 focus:ring-karyalo-green ${invalid ? "border-status-critical" : "border-border"}`}
                      />
                      {invalid && <span className="text-xs text-status-critical">Minimal {f.minLength} digit.</span>}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>

          {/* Summary */}
          <aside className="flex flex-col gap-3 self-start rounded-2xl border border-border bg-soft-sand/60 p-4 sm:sticky sm:top-4">
            <h3 className="text-sm font-bold text-ink">Ringkasan</h3>
            <dl className="flex flex-col gap-1.5 text-[13px]">
              <div className="flex justify-between gap-2"><dt className="text-muted">Produk</dt><dd className="text-right font-medium text-ink">{product.name}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-muted">Nominal</dt><dd className="text-right font-medium text-ink">{nominal?.label ?? "-"}</dd></div>
              <div className="flex justify-between gap-2 border-t border-border pt-2">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="text-right text-base font-extrabold tabular-nums text-ink">{nominal && nominal.price > 0 ? formatRupiah(nominal.price) : "Dicek dulu"}</dd>
              </div>
            </dl>
            <button type="submit" className="h-11 rounded-xl bg-karyalo-green text-sm font-bold text-white transition-colors hover:bg-deep-pine">
              {isBill ? "Cek tagihan" : "Lanjut ke pembayaran"}
            </button>
            {notice && (
              <p role="status" className="flex gap-2 rounded-xl border border-terracotta-soft bg-terracotta-soft/40 p-2.5 text-xs leading-relaxed text-ink">
                <Info size={14} className="mt-0.5 shrink-0 text-terracotta" /> {notice}
              </p>
            )}
            <p className="text-[11px] leading-relaxed text-muted">Harga dan nominal di halaman ini adalah data contoh.</p>
          </aside>
        </form>
      </div>
    </div>
  );
}
