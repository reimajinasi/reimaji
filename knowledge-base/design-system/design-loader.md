# Reimaji – Design System: Loader (Spinner / Loading State)

Sumber utama: Figma frame `Loader` pada file `Design-System--Community-` (node `104:1634`).

Loader digunakan untuk menunjukkan bahwa sistem sedang memproses sesuatu ketika progress tidak diketahui atau sangat singkat (indeterminate loading).

---

## 1. Konsep & Prinsip

- Loader bersifat **indeterminate** (tidak menampilkan %), misalnya:
  - Spinner (lingkaran berputar).  
  - Bar animasi yang bergerak terus.  
- Fungsi utama:
  - Memberi feedback bahwa sistem sedang bekerja.  
  - Mencegah user mengira UI “freeze”.

Gunakan loader sesingkat mungkin; jika proses punya progress jelas, lebih baik gunakan Progress Bar (`design-progress-bar.md`).

---

## 2. Variants & Size

### 2.1 Variants

Mengacu ke Figma:

- **Spinner default**:
  - Lingkaran dengan bagian hilang/warna berbeda yang berputar.  
  - Warna utama `primary`.

- (Opsional) **Inline loader**:
  - Loader kecil yang muncul di dalam button (loading button).  

### 2.2 Size Tokens

Ukuran disesuaikan dengan konteks:

- `loader-sm`
  - Ukuran: **TODO – ambil dari Figma** (mis. 16px).  
  - Penggunaan: di dalam teks atau di samping label kecil.

- `loader-md`
  - Ukuran: **TODO – ambil dari Figma** (mis. 20–24px).  
  - Penggunaan: status halaman/section, di tengah card.

- `loader-lg`
  - Ukuran: **TODO – ambil dari Figma** (mis. 32px+).  
  - Penggunaan: loading screen penuh, state kosong ketika menunggu data besar.

---

## 3. Colors & Background

Gunakan token dari `design-colors.md`:

- Spinner stroke:
  - Bagian aktif: `primary`.  
  - Bagian pasif: `muted` atau `muted-foreground` dengan opacity lebih rendah.

- Background:
  - Loader standalone biasanya tanpa background khusus.  
  - Jika loader berada di overlay:
    - Gunakan overlay semi-transparan di atas konten (`bg-background/70`).

---

## 4. Loading di Dalam Komponen

### 4.1 Button Loading

- Saat button melakukan aksi async:
  - Tampilkan loader kecil (`loader-sm`) di kiri/kanan teks.  
  - Nonaktifkan button (`disabled` = true) untuk mencegah double submit.  
  - Teks bisa berubah menjadi “Loading…” atau tetap (sesuai UX).

### 4.2 Page / Section Loading

- Gunakan `loader-md` atau `loader-lg` di:
  - Tengah kontainer (card, section).  
  - Tengah viewport untuk full-page loading.

- Pertimbangkan menambahkan teks kecil:
  - “Memuat data…” (typography `typo-caption-1` / `typo-body-1`).

---

## 5. Mapping ke Komponen (React)

### 5.1 API Komponen Loader

```ts
type LoaderSize = 'sm' | 'md' | 'lg'

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: LoaderSize
}
```

### 5.2 Base Classes (Spinner)

Contoh arah:

- Wrapper:
  - `inline-flex items-center justify-center`

- Spinner element:
  - `animate-spin rounded-full border-2 border-muted border-t-primary`
  - Size mapping:
    - `sm`: `h-4 w-4`  
    - `md`: `h-5 w-5`  
    - `lg`: `h-8 w-8`

---

## 6. Aturan Penggunaan

- Jangan:
  - Menampilkan loader terlalu lama tanpa konteks; pertimbangkan menambahkan teks penjelas.  
  - Menggunakan beberapa loader berbeda style di satu layar (pilih satu style utama dari Figma).

- Konsistensi:
  - Typography untuk pesan loading mengikuti `design-typography.md`.  
  - Warna spinner mengikuti `design-colors.md` (`primary` + `muted`).  
  - Loader di dalam komponen (Button, Card) harus selaras dengan ukuran dan layout komponen tersebut.

