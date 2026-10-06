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
- **Flash Sale** — sesi harian (00.00 / 12.00 / 18.00) dengan hitung mundur, harga
  coret, dan bar kuota terjual. Harga flash dipakai juga di panel detail.
- **Banner promo** — kartu iklan 2:1 (pola banner DeliaStore: teks kiri, susunan
  gambar game kanan), digambar dengan kode sehingga tetap tajam dan mudah diubah.
- **Baris geser** — *Beli lagi*, *Top Up Game*, *Top 10 hari ini* (angka besar),
  *Game baru*, satu baris per kategori lain, dan *Promo minggu ini*.
- **Panel detail** — pilihan nominal, isian target sesuai jenis produk (User ID +
  Zone ID, nomor HP, nomor meter, nomor pelanggan) dengan validasi, ringkasan,
  perkiraan poin member (1% · 1 poin = Rp1 · berlaku 45 hari), dan kolom voucher
  member — konsep yang sama dengan DeliaStore.
- **Halaman kategori** — `/kategori/[slug]`, pola yang sama dengan beranda.

Gambar produk ada di `public/products/`: key art game (dari folder `picture/` dan
aset DeliaStore) serta logo operator, PLN, dan e-wallet. Produk tanpa gambar
(Valorant, voucher, sebagian tagihan) memakai sampul gradasi + ikon kategori.

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
