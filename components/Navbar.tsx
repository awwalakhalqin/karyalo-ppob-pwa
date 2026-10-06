"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, Search, User, X } from "lucide-react";
import { CATEGORIES, PRODUCTS, startingPrice, formatRupiah } from "@/lib/catalog";
import { useProductModal } from "@/components/ProductModal";
import { ProductArt } from "@/components/ProductArt";

const LINKS = [{ href: "/", label: "Beranda" }, ...CATEGORIES.map((c) => ({ href: `/kategori/${c.slug}`, label: c.label }))];

/**
 * Top bar in the streaming-catalogue pattern: brand and sections on the left,
 * search / notifications / profile on the right; clear over the billboard,
 * solid once the page scrolls.
 */
export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [bellOpen, setBellOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sentinel = useRef<HTMLSpanElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const { open } = useProductModal();

  // Solid once the top 24px of the page has scrolled away.
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    setScrolled(window.scrollY > 24); // pages opened mid-way, e.g. /#flash-sale
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The notification panel closes on an outside click or Escape.
  useEffect(() => {
    if (!bellOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!bellRef.current?.contains(e.target as Node)) setBellOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setBellOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [bellOpen]);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter((p) => [p.name, p.tagline, p.category].some((v) => v.toLowerCase().includes(q))).slice(0, 8);
  }, [query]);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  const solid = scrolled || searchOpen || pathname !== "/";

  return (
    <>
    <span ref={sentinel} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-6 w-px" />
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${solid ? "bg-night shadow-lg shadow-night/20" : "bg-gradient-to-b from-night/80 to-transparent"}`}>
      <div className="flex h-16 items-center gap-6 px-4 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Karyalo PPOB, beranda">
          <Image src="/logo.png" alt="" width={114} height={160} priority className="h-8 w-auto" />
          <span className="text-[15px] font-extrabold tracking-tight text-white">Karyalo <span className="text-accent-cyan">PPOB</span></span>
        </Link>

        <nav aria-label="Kategori" className="hidden items-center gap-5 lg:flex">
          {LINKS.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} aria-current={active ? "page" : undefined} className={`text-sm transition-colors ${active ? "font-bold text-white" : "text-white/75 hover:text-white"}`}>
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {searchOpen ? (
            <div className="flex h-10 items-center gap-2 rounded-lg border border-white/30 bg-night/90 px-3">
              <Search size={17} className="shrink-0 text-white/80" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && closeSearch()}
                placeholder="Cari game atau operator"
                aria-label="Cari produk"
                className="w-36 bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none sm:w-60"
              />
              <button type="button" onClick={closeSearch} aria-label="Tutup pencarian" className="text-white/70 hover:text-white">
                <X size={16} />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setSearchOpen(true)} aria-label="Cari produk" className="flex size-10 items-center justify-center rounded-full text-white hover:bg-white/10">
              <Search size={19} />
            </button>
          )}
          <div ref={bellRef} className="relative">
            <button
              type="button"
              onClick={() => setBellOpen((o) => !o)}
              aria-expanded={bellOpen}
              aria-label="Notifikasi"
              className="flex size-10 items-center justify-center rounded-full text-white hover:bg-white/10"
            >
              <Bell size={19} />
            </button>
            {bellOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/10 bg-night p-4 text-sm text-white/80 shadow-xl">
                Belum ada notifikasi. Status top up akan muncul di sini.
              </div>
            )}
          </div>
          <Link href="/#beli-lagi" aria-label="Riwayat transaksi" title="Riwayat transaksi" className="ml-1 flex size-9 items-center justify-center rounded-lg bg-karyalo-green text-white">
            <User size={17} />
          </Link>
        </div>
      </div>

      {/* Phones: sections as a swipeable chip row */}
      <nav aria-label="Kategori" className="row-scroller flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
        {LINKS.map((l) => {
          const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
          return (
            <Link key={l.href} href={l.href} className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${active ? "border-white bg-white text-night" : "border-white/40 text-white"}`}>
              {l.label}
            </Link>
          );
        })}
      </nav>

      {/* Live search results */}
      {searchOpen && query.trim() && (
        <div className="border-t border-white/10 bg-night px-4 pb-6 pt-4 sm:px-8">
          <div>
            {results.length === 0 ? (
              <p className="text-sm text-white/70">Tidak ada produk untuk “{query.trim()}”.</p>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
                {results.map((p) => {
                  const from = startingPrice(p);
                  return (
                    <li key={p.slug}>
                      <button type="button" onClick={() => { closeSearch(); open(p.slug); }} className="block w-full overflow-hidden rounded-lg text-left">
                        <ProductArt product={p} className="aspect-video rounded-lg" />
                        <span className="mt-1 block text-xs text-white/75">{from ? `Mulai ${formatRupiah(from)}` : "Bayar tagihan"}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </header>
    </>
  );
}
