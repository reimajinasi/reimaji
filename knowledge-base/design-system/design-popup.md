# Reimaji – Design System: Pop-Up (Modal/Dialog)

Sumber utama: Figma frame `Pop-Up` pada file `Design-System--Community-` (node `221:1504`).

Pop-up digunakan untuk menampilkan konten penting di atas halaman saat ini, biasanya untuk:
- Konfirmasi aksi penting (delete, submit besar).  
- Form singkat (input data cepat).  
- Informasi yang membutuhkan fokus penuh user.

---

## 1. Konsep & Prinsip

- Pop-up bersifat **modal**:
  - Mengunci interaksi ke dalam pop-up sampai user menutup atau menyelesaikan aksi.  
  - Background halaman utama biasanya di-blur atau di-dim dengan overlay.
- Hindari penggunaan berlebihan; gunakan pop-up hanya ketika:
  - Perlu menghentikan alur user untuk keputusan penting.  
  - Konten tidak cocok ditampilkan inline tanpa mengganggu layout.

---

## 2. Struktur & Layout

Struktur umum:

- Overlay:
  - Layer semi-transparan menutupi seluruh viewport.  
  - Warna: `bg-background/70` atau `bg-black/50` sesuai Figma.

- Dialog:
  - Container yang berada di tengah viewport (vertikal/horizontal).  
  - Elemen di dalam:
    - Header: title + optional subtitle.  
    - Body: konten utama (teks, form, pilihan).  
    - Footer: tombol aksi (primary + secondary).

Layout:
- Padding: generik `p-4`–`p-6` (lihat Figma).  
- Radius: mengikuti card radius (`rounded-lg`/`rounded-xl`).  
- Max width: medium (mis. `max-w-md` atau `max-w-lg`) untuk keterbacaan.

---

## 3. Typography

- Title:
  - Typography: `typo-h5` atau `typo-giant` (semi-bold).  
  - Warna: `foreground`.

- Subtitle / Description:
  - Typography: `typo-body-1` atau `typo-caption-1`.  
  - Warna: `muted-foreground`.

- Buttons:
  - Menggunakan aturan `design-button.md` (primary/secondary/destructive).

---

## 4. Colors & Shadow

Gunakan token dari `design-colors.md` dan `design-shadows.md`:

- Dialog:
  - Background: `card`.  
  - Border (opsional): `border`.  
  - Shadow: `shadow-500` atau `shadow-600` untuk memberi depth yang jelas.

- Overlay:
  - `bg-background/70` atau `bg-black/50` (transparansi yang cukup agar konten bawah masih tampak samar).

---

## 5. Actions & Button Layout

- Footer:
  - Minimal dua tombol:
    - Primary (aksi utama, mis. “Simpan”, “Hapus”).  
    - Secondary (batal/tutup).  
  - Urutan: mengikuti konvensi Figma (biasanya primary di kanan).

- Align:
  - Tombol disejajarkan kanan (`justify-end`) atau sesuai Figma.

---

## 6. Mapping ke Komponen (React / shadcn)

Gunakan pola `Dialog` dari shadcn dan sesuaikan dengan design system Reimaji.

### 6.1 API Komponen (usulan)

```ts
interface PopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children: React.ReactNode // body content
  footer?: React.ReactNode // buttons/extra actions
}
```

### 6.2 Base Classes

- Overlay:
  - `fixed inset-0 z-40 bg-background/70 backdrop-blur-sm`.

- Dialog:
  - `fixed inset-0 z-50 flex items-center justify-center`  
  - Inner:
    - `w-full max-w-md rounded-lg bg-card p-6 shadow-500 border border-border`.

---

## 7. Aturan Penggunaan

- Jangan gunakan pop-up untuk:
  - Konten panjang yang seharusnya jadi halaman terpisah.  
  - Informasi non-kritis yang dapat tampil sebagai Alert/Toast.

- Pastikan:
  - Ada cara jelas untuk menutup (X, tombol Batal, klik overlay jika diizinkan).  
  - Fokus keyboard berpindah ke dalam dialog ketika terbuka, dan kembali ke trigger ketika tertutup.  
  - `Escape` menutup dialog jika sesuai UX dan tidak berbahaya.

