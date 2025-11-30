# Reimaji – Design System: Pagination

Sumber utama: Figma frame `Pagination` pada file `Design-System--Community-` (node `235:6281`).

Pagination digunakan untuk menavigasi halaman-halaman data yang panjang (list item, tabel, dsb.).

---

## 1. Konsep & Prinsip

- Menunjukkan:
  - Halaman aktif saat ini.  
  - Aksi untuk berpindah ke halaman berikut/sebelumnya, dan (opsional) ke awal/akhir.  
- Konsisten: style pagination harus sama di semua list yang dipaginasi.

---

## 2. Variants

### 2.1 Basic Pagination

Struktur umum:

- Tombol:
  - `Prev` (ikon chevron-left).  
  - Nomor halaman (1, 2, 3, ...).  
  - `Next` (ikon chevron-right).

- Current page:
  - Ditandai dengan style aktif (background/text berbeda).

### 2.2 Compact Pagination

- Digunakan ketika banyak halaman:
  - Tampilkan rentang kecil (mis. `1 ... 4 5 6 ... 10`).  
  - Gunakan ellipsis (`…`) sebagai item non-klik.

---

## 3. Layout & Typography

- Container:
  - `inline-flex items-center gap-1` atau `gap-2`.  
  - Biasanya ditempatkan di bawah list/tabel, kanan atau tengah.

- Item (page button):
  - `inline-flex h-8 min-w-[32px] items-center justify-center rounded-md px-2 text-caption-2`.  
  - Current: font lebih tebal atau background berbeda.

---

## 4. Colors & States

Gunakan `design-colors.md`:

- Default:
  - Text: `muted-foreground`.  
  - Background: `transparent`.

- Hover:
  - Background: `muted`.  
  - Text: `foreground`.

- Active (current page):
  - Background: `primary`.  
  - Text: `primary-foreground`.

- Disabled (Prev/Next di ujung):
  - Text: `muted-foreground` dengan `opacity-50`.  
  - Tidak ada hover.

---

## 5. Mapping ke Komponen (React)

### 5.1 API (usulan)

```ts
interface PaginationProps {
  page: number
  pageCount: number
  onPageChange?: (page: number) => void
}
```

### 5.2 Base Classes

- Wrapper:
  - `flex items-center gap-1`

- Page button:
  - Base: `inline-flex h-8 min-w-[32px] items-center justify-center rounded-md px-2 text-caption-2 text-muted-foreground hover:bg-muted hover:text-foreground`  
  - Active: `bg-primary text-primary-foreground`  
  - Disabled: `opacity-50 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground`.

---

## 6. Aturan Penggunaan

- Tampilkan pagination hanya jika:
  - Data lebih dari 1 halaman.  
  - User perlu berpindah secara eksplisit antar halaman.

- Hindari:
  - Menampilkan terlalu banyak nomor halaman; gunakan ellipsis.  
  - Menyembunyikan informasi aktu al halaman (mis. “Page 2 of 10” sebagai teks tambahan jika perlu).

