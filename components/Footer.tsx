import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/lib/catalog";

export function Footer() {
  return (
    <footer className="mt-12 bg-night px-4 pb-8 pt-10 text-sm text-white/70 sm:px-8">
      <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Karyalo PPOB, beranda">
            <Image src="/logo.png" alt="" width={114} height={160} className="h-9 w-auto" />
            <span className="text-base font-extrabold text-white">Karyalo <span className="text-accent-cyan">PPOB</span></span>
          </Link>
          <p className="mt-3 max-w-sm leading-relaxed">
            Top up game, pulsa, token PLN, tagihan, dan e-wallet dalam satu tempat. Bagian dari ekosistem Karyalo, PT Karsa Swakarya Loka.
          </p>
        </div>
        <nav aria-label="Kategori">
          <p className="mb-2 font-semibold text-white">Kategori</p>
          <ul className="grid gap-1.5">
            {CATEGORIES.map((c) => (
              <li key={c.slug}><Link href={`/kategori/${c.slug}`} className="hover:text-white">{c.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="mb-2 font-semibold text-white">Bantuan</p>
          <a href="mailto:support@karyalo.com" className="hover:text-white">support@karyalo.com</a>
          <p className="mt-4 rounded-lg border border-white/15 p-3 text-xs leading-relaxed">
            Prototype tampilan. Harga, nominal, dan riwayat adalah data contoh. Pembayaran belum aktif.
          </p>
        </div>
      </div>
      <p className="mt-8 border-t border-white/10 pt-6 text-xs text-white/50">© 2026 PT Karsa Swakarya Loka</p>
    </footer>
  );
}
