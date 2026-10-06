# Karyalo PPOB (PWA)

Top up game, pulsa & paket data, token PLN, tagihan bulanan, dan saldo e-money —
bagian dari ekosistem Karyalo (PT Karsa Swakarya Loka).

**Status: prototype tampilan.** Katalog, harga, dan riwayat adalah data contoh
(`lib/catalog.ts`). Pembayaran dan pengiriman produk belum tersambung; tombol bayar
menyatakan hal itu dan tidak membuat transaksi.

## Struktur halaman

Mengadopsi *penataan* halaman katalog streaming (bukan warna atau identitasnya —
palet dan token mengikuti Karyalo Design System):

- **Navbar** — transparan di atas billboard, solid saat di-scroll; kategori di kiri,
  pencarian langsung, notifikasi, dan akun di kanan. Di ponsel kategori menjadi chip.
- **Billboard** — satu produk unggulan dengan aksi *Top up sekarang* / *Info lengkap*.
- **Baris geser** — *Beli lagi*, *Top 10 hari ini* (angka besar), satu baris per
  kategori, dan *Promo minggu ini*.
- **Panel detail** — pilihan nominal, isian target sesuai jenis produk (User ID +
  Zone ID, nomor HP, nomor meter, nomor pelanggan) dengan validasi, dan ringkasan.
- **Halaman kategori** — `/kategori/[slug]`, pola yang sama dengan beranda.

Tidak ada logo merek pihak lain; sampul produk dibuat dari gradasi, ikon kategori,
dan nama produk.

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3020
npm run build && npm start
```

Port 3020 dipilih agar tidak bentrok dengan ERP HIJ (3001) dan Karyalo Manage.

## Tumpukan

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · lucide-react. Tanpa backend.

## Langkah berikutnya

- Ganti `lib/catalog.ts` dengan price list Digiflazz (+ margin), seperti DeliaStore.
- Pembayaran DOKU (QRIS/VA) dan pengiriman otomatis ke Digiflazz setelah lunas.
- Login member (nomor WhatsApp) dan riwayat transaksi sungguhan untuk baris *Beli lagi*.
- Service worker untuk mode offline PWA.
