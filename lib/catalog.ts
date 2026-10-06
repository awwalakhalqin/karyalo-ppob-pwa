/**
 * Katalog CONTOH untuk prototype UI. Harga, nominal, dan riwayat di sini bukan
 * price list sungguhan — di produksi diganti price list Digiflazz (+ margin)
 * seperti pada DeliaStore. Nama produk dipakai sebagai teks saja; tidak ada
 * logo merek pihak lain di aplikasi ini.
 */

export type CategorySlug = "game" | "pulsa-data" | "pln-tagihan" | "e-money" | "voucher";

export interface Category {
  slug: CategorySlug;
  label: string;
  tagline: string;
}

export const CATEGORIES: Category[] = [
  { slug: "game", label: "Game", tagline: "Diamond, UC, dan kredit game masuk otomatis setelah bayar." },
  { slug: "pulsa-data", label: "Pulsa & Data", tagline: "Pulsa dan paket data semua operator, langsung aktif." },
  { slug: "pln-tagihan", label: "PLN & Tagihan", tagline: "Token listrik dan tagihan bulanan tanpa antre." },
  { slug: "e-money", label: "E-Money", tagline: "Isi saldo dompet digital tanpa biaya admin tersembunyi." },
  { slug: "voucher", label: "Voucher", tagline: "Kode voucher digital dikirim setelah pembayaran." },
];

export type TargetKind = "game-id-zone" | "game-id" | "phone" | "meter" | "customer-id";

export const TARGET_FIELDS: Record<TargetKind, { label: string; placeholder: string; hint: string; fields: { key: string; label: string; inputMode: "numeric" | "text"; minLength: number }[] }> = {
  "game-id-zone": {
    label: "Akun game",
    placeholder: "",
    hint: "User ID dan Zone ID ada di profil akun game Anda.",
    fields: [
      { key: "userId", label: "User ID", inputMode: "numeric", minLength: 5 },
      { key: "zoneId", label: "Zone ID", inputMode: "numeric", minLength: 2 },
    ],
  },
  "game-id": {
    label: "Akun game",
    placeholder: "",
    hint: "Player ID ada di halaman profil game.",
    fields: [{ key: "userId", label: "Player ID", inputMode: "numeric", minLength: 5 }],
  },
  phone: {
    label: "Nomor HP",
    placeholder: "08xxxxxxxxxx",
    hint: "Pastikan nomor sesuai operator yang dipilih.",
    fields: [{ key: "phone", label: "Nomor HP", inputMode: "numeric", minLength: 10 }],
  },
  meter: {
    label: "Nomor meter / ID pelanggan",
    placeholder: "",
    hint: "Ada di kartu meter atau struk pembelian token sebelumnya.",
    fields: [{ key: "meter", label: "Nomor meter / ID pelanggan", inputMode: "numeric", minLength: 11 }],
  },
  "customer-id": {
    label: "Nomor pelanggan",
    placeholder: "",
    hint: "Tertera di tagihan bulanan Anda.",
    fields: [{ key: "customerId", label: "Nomor pelanggan", inputMode: "numeric", minLength: 6 }],
  },
};

export type ArtIcon = "game" | "phone" | "zap" | "receipt" | "wallet" | "ticket";

export interface Nominal {
  id: string;
  label: string;
  price: number;
  /** Harga coret saat promo. */
  compareAt?: number;
}

export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  tagline: string;
  description: string;
  processTime: string;
  target: TargetKind;
  nominals: Nominal[];
  art: { from: string; to: string; icon: ArtIcon };
  badge?: "Promo" | "Baru" | "Terlaris";
  /** Peringkat penjualan hari ini (1 = paling laris). */
  rank?: number;
}

const n = (id: string, label: string, price: number, compareAt?: number): Nominal => ({ id, label, price, compareAt });

export const PRODUCTS: Product[] = [
  // --- Game ---
  {
    slug: "mobile-legends", name: "Mobile Legends", category: "game", rank: 1, badge: "Terlaris",
    tagline: "Diamond masuk ±1 menit setelah bayar.",
    description: "Top up diamond Mobile Legends: Bang Bang memakai User ID dan Zone ID. Tidak perlu login akun.",
    processTime: "± 1 menit", target: "game-id-zone",
    nominals: [n("ml-86", "86 Diamond", 23500), n("ml-172", "172 Diamond", 46500), n("ml-257", "257 Diamond", 69000, 72000), n("ml-344", "344 Diamond", 92000), n("ml-706", "706 Diamond", 185000), n("ml-wdp", "Weekly Diamond Pass", 27500)],
    art: { from: "#1e5aa8", to: "#111b36", icon: "game" },
  },
  {
    slug: "free-fire", name: "Free Fire", category: "game", rank: 2,
    tagline: "Diamond Free Fire, cukup Player ID.",
    description: "Top up diamond Free Fire dengan Player ID. Diamond masuk otomatis ke akun.",
    processTime: "± 1 menit", target: "game-id",
    nominals: [n("ff-70", "70 Diamond", 10500), n("ff-140", "140 Diamond", 21000), n("ff-355", "355 Diamond", 52000), n("ff-720", "720 Diamond", 103000), n("ff-mm", "Member Mingguan", 30000)],
    art: { from: "#a5482d", to: "#1e2f5c", icon: "game" },
  },
  {
    slug: "pubg-mobile", name: "PUBG Mobile", category: "game", rank: 5,
    tagline: "UC PUBG Mobile untuk Royale Pass dan skin.",
    description: "Top up UC PUBG Mobile dengan Player ID.",
    processTime: "± 2 menit", target: "game-id",
    nominals: [n("pm-60", "60 UC", 15000), n("pm-325", "325 UC", 75000), n("pm-660", "660 UC", 150000), n("pm-1800", "1.800 UC", 375000)],
    art: { from: "#2a6f64", to: "#111b36", icon: "game" },
  },
  {
    slug: "genshin-impact", name: "Genshin Impact", category: "game", badge: "Promo",
    tagline: "Genesis Crystal dan Blessing of the Welkin Moon.",
    description: "Top up Genesis Crystal Genshin Impact dengan UID dan server.",
    processTime: "± 3 menit", target: "game-id-zone",
    nominals: [n("gi-60", "60 Genesis Crystal", 15500, 16500), n("gi-330", "330 Genesis Crystal", 77000, 81000), n("gi-1090", "1.090 Genesis Crystal", 239000, 249000), n("gi-welkin", "Welkin Moon", 72000, 79000)],
    art: { from: "#2fc1d6", to: "#1e2f5c", icon: "game" },
  },
  {
    slug: "valorant", name: "Valorant", category: "game",
    tagline: "Valorant Points untuk agent dan skin.",
    description: "Top up Valorant Points (VP) memakai Riot ID.",
    processTime: "± 2 menit", target: "game-id",
    nominals: [n("vl-300", "300 VP", 45000), n("vl-625", "625 VP", 90000), n("vl-1125", "1.125 VP", 150000)],
    art: { from: "#b3261e", to: "#111b36", icon: "game" },
  },
  {
    slug: "honor-of-kings", name: "Honor of Kings", category: "game", badge: "Baru",
    tagline: "Token Honor of Kings, proses otomatis.",
    description: "Top up token Honor of Kings dengan Player ID.",
    processTime: "± 2 menit", target: "game-id",
    nominals: [n("hok-80", "80 Token", 15000), n("hok-240", "240 Token", 45000), n("hok-400", "400 Token", 75000)],
    art: { from: "#7a5a1e", to: "#1e2f5c", icon: "game" },
  },
  {
    slug: "call-of-duty-mobile", name: "Call of Duty Mobile", category: "game",
    tagline: "CP untuk Battle Pass dan bundle.",
    description: "Top up CP Call of Duty Mobile memakai Player ID.",
    processTime: "± 2 menit", target: "game-id",
    nominals: [n("cod-63", "63 CP", 10000), n("cod-321", "321 CP", 50000), n("cod-645", "645 CP", 100000)],
    art: { from: "#4b5563", to: "#111b36", icon: "game" },
  },

  // --- Pulsa & data ---
  {
    slug: "telkomsel", name: "Telkomsel", category: "pulsa-data", rank: 3,
    tagline: "Pulsa dan paket data Telkomsel.",
    description: "Isi pulsa reguler dan paket data Telkomsel. Pulsa masuk dalam hitungan detik.",
    processTime: "± 10 detik", target: "phone",
    nominals: [n("tsel-10", "Pulsa 10.000", 11000), n("tsel-25", "Pulsa 25.000", 25500), n("tsel-50", "Pulsa 50.000", 50000), n("tsel-d15", "Data 15 GB / 30 hari", 89000)],
    art: { from: "#b3261e", to: "#5c1414", icon: "phone" },
  },
  {
    slug: "indosat", name: "Indosat", category: "pulsa-data", rank: 6,
    tagline: "Pulsa dan paket data IM3.",
    description: "Isi pulsa dan paket data Indosat Ooredoo (IM3).",
    processTime: "± 10 detik", target: "phone",
    nominals: [n("isat-10", "Pulsa 10.000", 11200), n("isat-25", "Pulsa 25.000", 25300), n("isat-d12", "Data 12 GB / 30 hari", 65000)],
    art: { from: "#c99a1a", to: "#5a3d00", icon: "phone" },
  },
  {
    slug: "xl", name: "XL Axiata", category: "pulsa-data",
    tagline: "Pulsa dan paket data XL.",
    description: "Isi pulsa dan paket data XL.",
    processTime: "± 10 detik", target: "phone",
    nominals: [n("xl-10", "Pulsa 10.000", 11000), n("xl-25", "Pulsa 25.000", 25200), n("xl-d10", "Data 10 GB / 30 hari", 55000)],
    art: { from: "#1e5aa8", to: "#0b2d5c", icon: "phone" },
  },
  {
    slug: "tri", name: "Tri", category: "pulsa-data",
    tagline: "Pulsa dan kuota Tri.",
    description: "Isi pulsa dan paket data Tri (3).",
    processTime: "± 10 detik", target: "phone",
    nominals: [n("tri-10", "Pulsa 10.000", 10800), n("tri-d20", "Data 20 GB / 30 hari", 70000)],
    art: { from: "#6b2d7a", to: "#2a0f33", icon: "phone" },
  },
  {
    slug: "smartfren", name: "Smartfren", category: "pulsa-data",
    tagline: "Pulsa dan kuota Smartfren.",
    description: "Isi pulsa dan paket data Smartfren.",
    processTime: "± 10 detik", target: "phone",
    nominals: [n("sf-10", "Pulsa 10.000", 10900), n("sf-d15", "Data 15 GB / 28 hari", 60000)],
    art: { from: "#a5482d", to: "#4a1d10", icon: "phone" },
  },

  // --- PLN & tagihan ---
  {
    slug: "token-pln", name: "Token PLN", category: "pln-tagihan", rank: 4, badge: "Terlaris",
    tagline: "Token listrik prabayar, kode langsung tampil.",
    description: "Beli token listrik PLN prabayar dengan nomor meter. Kode token 20 digit tampil setelah bayar.",
    processTime: "± 30 detik", target: "meter",
    nominals: [n("pln-20", "Token 20.000", 21500), n("pln-50", "Token 50.000", 51500), n("pln-100", "Token 100.000", 101500), n("pln-200", "Token 200.000", 201500)],
    art: { from: "#c99a1a", to: "#1e2f5c", icon: "zap" },
  },
  {
    slug: "tagihan-pln", name: "Tagihan PLN", category: "pln-tagihan",
    tagline: "Bayar listrik pascabayar tanpa antre.",
    description: "Cek dan bayar tagihan listrik PLN pascabayar dengan ID pelanggan.",
    processTime: "Instan", target: "meter",
    nominals: [n("plnpasca", "Cek tagihan bulan ini", 0)],
    art: { from: "#1e2f5c", to: "#111b36", icon: "receipt" },
  },
  {
    slug: "bpjs-kesehatan", name: "BPJS Kesehatan", category: "pln-tagihan", rank: 8,
    tagline: "Iuran BPJS Kesehatan per bulan.",
    description: "Bayar iuran BPJS Kesehatan dengan nomor VA keluarga.",
    processTime: "Instan", target: "customer-id",
    nominals: [n("bpjs-1", "Iuran 1 bulan", 0), n("bpjs-3", "Iuran 3 bulan", 0)],
    art: { from: "#1c7a4d", to: "#0d3a25", icon: "receipt" },
  },
  {
    slug: "pdam", name: "PDAM", category: "pln-tagihan",
    tagline: "Tagihan air PDAM berbagai kota.",
    description: "Bayar tagihan air PDAM dengan nomor pelanggan.",
    processTime: "Instan", target: "customer-id",
    nominals: [n("pdam", "Cek tagihan bulan ini", 0)],
    art: { from: "#2fc1d6", to: "#0b4a55", icon: "receipt" },
  },
  {
    slug: "internet-rumah", name: "Internet Rumah", category: "pln-tagihan",
    tagline: "Tagihan internet rumah bulanan.",
    description: "Bayar tagihan internet rumah dengan nomor pelanggan.",
    processTime: "Instan", target: "customer-id",
    nominals: [n("inet", "Cek tagihan bulan ini", 0)],
    art: { from: "#b3261e", to: "#1e2f5c", icon: "receipt" },
  },

  // --- E-money ---
  {
    slug: "gopay", name: "GoPay", category: "e-money", rank: 7,
    tagline: "Isi saldo GoPay ke nomor HP.",
    description: "Top up saldo GoPay ke nomor HP yang terdaftar.",
    processTime: "± 1 menit", target: "phone",
    nominals: [n("gp-20", "Saldo 20.000", 21000), n("gp-50", "Saldo 50.000", 51000), n("gp-100", "Saldo 100.000", 101000)],
    art: { from: "#0f8a8a", to: "#0b3d3d", icon: "wallet" },
  },
  {
    slug: "ovo", name: "OVO", category: "e-money",
    tagline: "Isi saldo OVO Cash.",
    description: "Top up OVO Cash ke nomor HP yang terdaftar.",
    processTime: "± 1 menit", target: "phone",
    nominals: [n("ovo-20", "Saldo 20.000", 21000), n("ovo-50", "Saldo 50.000", 51000), n("ovo-100", "Saldo 100.000", 101000)],
    art: { from: "#4c2a85", to: "#1f0f3d", icon: "wallet" },
  },
  {
    slug: "dana", name: "DANA", category: "e-money", rank: 9,
    tagline: "Isi saldo DANA tanpa ribet.",
    description: "Top up saldo DANA ke nomor HP yang terdaftar.",
    processTime: "± 1 menit", target: "phone",
    nominals: [n("dana-20", "Saldo 20.000", 20800), n("dana-50", "Saldo 50.000", 50800), n("dana-100", "Saldo 100.000", 100800)],
    art: { from: "#1e5aa8", to: "#0b2d5c", icon: "wallet" },
  },
  {
    slug: "shopeepay", name: "ShopeePay", category: "e-money",
    tagline: "Isi saldo ShopeePay.",
    description: "Top up ShopeePay ke nomor HP yang terdaftar.",
    processTime: "± 1 menit", target: "phone",
    nominals: [n("spay-20", "Saldo 20.000", 21000), n("spay-50", "Saldo 50.000", 51000)],
    art: { from: "#a5482d", to: "#3d1608", icon: "wallet" },
  },

  // --- Voucher ---
  {
    slug: "google-play", name: "Google Play", category: "voucher", rank: 10,
    tagline: "Voucher saldo Google Play.",
    description: "Kode voucher Google Play dikirim setelah pembayaran berhasil.",
    processTime: "± 1 menit", target: "phone",
    nominals: [n("gpl-20", "Voucher 20.000", 21500), n("gpl-50", "Voucher 50.000", 52500), n("gpl-100", "Voucher 100.000", 104000)],
    art: { from: "#1c7a4d", to: "#1e2f5c", icon: "ticket" },
  },
  {
    slug: "steam-wallet", name: "Steam Wallet", category: "voucher", badge: "Promo",
    tagline: "Kode Steam Wallet IDR.",
    description: "Kode Steam Wallet IDR dikirim setelah pembayaran berhasil.",
    processTime: "± 1 menit", target: "phone",
    nominals: [n("stm-45", "Steam Wallet 45.000", 47000, 49000), n("stm-90", "Steam Wallet 90.000", 93000, 97000), n("stm-250", "Steam Wallet 250.000", 255000, 262000)],
    art: { from: "#1e2f5c", to: "#0a1022", icon: "ticket" },
  },
];

export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const productsIn = (category: CategorySlug) => PRODUCTS.filter((p) => p.category === category);
export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const topToday = () => PRODUCTS.filter((p) => p.rank).sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99)).slice(0, 10);
export const onPromo = () => PRODUCTS.filter((p) => p.badge === "Promo" || p.nominals.some((x) => x.compareAt));

/** Lowest payable price, or null for bills whose amount is checked first. */
export const startingPrice = (p: Product) => {
  const prices = p.nominals.map((x) => x.price).filter((x) => x > 0);
  return prices.length ? Math.min(...prices) : null;
};

export const formatRupiah = (v: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

/** Riwayat contoh untuk baris "Beli lagi" (padanan "Lanjutkan menonton"). */
export const RECENT_PURCHASES: { slug: string; nominalId: string; target: string; whenLabel: string }[] = [
  { slug: "mobile-legends", nominalId: "ml-172", target: "ID 1234****89 (2012)", whenLabel: "Kemarin" },
  { slug: "token-pln", nominalId: "pln-100", target: "Meter 5321****7781", whenLabel: "3 hari lalu" },
  { slug: "telkomsel", nominalId: "tsel-d15", target: "0812****4471", whenLabel: "Minggu lalu" },
  { slug: "dana", nominalId: "dana-50", target: "0857****1290", whenLabel: "2 minggu lalu" },
];

/** Produk unggulan di billboard beranda. */
export const FEATURED_SLUG = "mobile-legends";
