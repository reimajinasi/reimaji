# Reimaji – Design System: Breadcrumbs

Sumber utama: Figma frame `Breadcrumbs` pada file `Design-System--Community-` (node `101:1830`).

Breadcrumbs digunakan untuk menampilkan posisi halaman saat ini di dalam hierarki navigasi, dan memudahkan user kembali ke level sebelumnya.

---

## 1. Konsep & Prinsip

- Struktur dasar: `Root / Section / Sub-section / Current`.  
- Semua item kecuali yang terakhir biasanya klikable (link).  
- Separator (mis. `/` atau `>` icon) digunakan di antara item.
- Prinsip:
  - Tampilkan hanya level yang relevan (tidak terlalu panjang).  
  - Jangan gunakan breadcrumbs jika struktur halaman datar (tidak bertingkat).

---

## 2. Struktur & Typografi

- Container:
  - `inline-flex items-center gap-1` atau `gap-1.5`.  
  - Ditempatkan di bagian atas halaman, di bawah top navbar.

- Item:
  - Typography:
    - Default/parent: `typo-caption-2` atau `typo-body-2`.  
    - Current page: bisa sedikit lebih kuat (`typo-caption-2` semi bold).  
  - Warna:
    - Link (parent): `muted-foreground` dengan hover `foreground`.  
    - Current page: `foreground` (tidak klikable).

- Separator:
  - Bisa berupa karakter `/` atau icon kecil (chevron-right).  
  - Warna: `muted-foreground`.

---

## 3. Colors & States

- Background:
  - Biasanya transparan, di atas `background`/`card`.  
  - Jika ditempatkan di dalam blok dengan background khusus, pastikan kontras teks tetap baik.

- Link item (parent):
  - Default: `muted-foreground`.  
  - Hover: `foreground` atau `primary` (opsional underline).

- Current item:
  - `foreground` dan tidak menampilkan hover/underline.

---

## 4. Mapping ke Komponen (React)

### 4.1 API Komponen (usulan)

```ts
type BreadcrumbItem = {
  label: string
  href?: string // jika tidak ada href → dianggap current
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}
```

### 4.2 Struktur Komponen

- Wrapper:
  - `nav` dengan `aria-label="Breadcrumb"`.  
  - `ol`/`ul` sebagai list utama.

- Item:
  - Render sebagai `<li>` dengan isi:
    - Jika punya `href`: link (`<a>`/`Link`) dengan styling link.  
    - Jika tidak: span teks current.

- Accessibility:
  - Tambahkan `aria-current="page"` pada item terakhir (current).

Contoh layout classes:
- Wrapper: `flex items-center gap-1 text-caption-2 text-muted-foreground`.  
- Link: `hover:text-foreground`.  
- Current: `text-foreground font-medium`.

---

## 5. Aturan Penggunaan

- Gunakan breadcrumbs:
  - Pada halaman dengan kedalaman navigasi ≥ 2 level (mis. `Home / LMS / Course / Lesson`).  
  - Untuk halaman detail di dalam section (detail course, detail artikel).

- Jangan:
  - Menampilkan breadcrumbs jika user selalu datang dari satu jalur sederhana dan struktur datar.  
  - Menggunakan label terlalu panjang; ringkas judul di breadcrumbs.

- Konsistensi:
  - Ikon separator mengacu ke `design-icons.md` (Iconoir chevron/right).  
  - Typography dan warna mengikuti `design-typography.md` dan `design-colors.md`.

