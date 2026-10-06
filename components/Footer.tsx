import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";

export function Footer() {
  return (
    <footer className="mt-16 bg-night px-4 py-12 text-sm text-white/70 sm:px-8">
      <div className="grid gap-8 sm:grid-cols-3">
        <div>
          <p className="text-base font-extrabold text-white">Karyalo <span className="text-accent-cyan">PPOB</span></p>
          <p className="mt-2 max-w-xs leading-relaxed">Top up game, pulsa & data, token PLN, tagihan, dan e-money dalam satu tempat. Bagian dari ekosistem Karyalo, PT Karsa Swakarya Loka.</p>
        </div>
        <nav aria-label="Kategori">
          <p className="mb-2 font-semibold text-white">Kategori</p>
          <ul className="grid grid-cols-2 gap-1.5">
            {CATEGORIES.map((c) => (
              <li key={c.slug}><Link href={`/kategori/${c.slug}`} className="hover:text-white">{c.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="mb-2 font-semibold text-white">Bantuan</p>
          <p>support@karyalo.com</p>
          <p className="mt-4 rounded-lg border border-white/15 p-3 text-xs leading-relaxed">
            Prototype tampilan. Harga, nominal, dan riwayat adalah data contoh; pembayaran belum aktif.
          </p>
        </div>
      </div>
      <p className="mt-10 text-xs text-white/50">© 2026 PT Karsa Swakarya Loka</p>
    </footer>
  );
}
