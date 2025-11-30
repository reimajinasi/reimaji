# Reimaji – Design System: Alert

Sumber utama: Figma frame `Alert` pada file `Design-System--Community-` (node `88:1264`).

Alert digunakan untuk menampilkan pesan penting secara ringkas: keberhasilan, peringatan, error, atau informasi sistem.

---

## 1. Konsep & Prinsip

- Alert bersifat **inline** (bukan modal): muncul di dalam layout, biasanya di atas konten utama atau dekat konteksnya.  
- Setiap alert memiliki:
  - Icon status.  
  - Title (opsional tapi disarankan).  
  - Deskripsi singkat.  
  - (Opsional) aksi tambahan (link “Learn more”, tombol kecil).
- Alert harus:
  - Singkat dan jelas.  
  - Menggunakan warna sesuai status (info/success/warning/error).  

---

## 2. Variants (Status)

Empat status utama (mapping ke warna semantik di `design-colors.md`):

1. **Info**
   - Warna dasar: `color-info`.  
   - Icon: informasi (i).  
   - Penggunaan:
     - Menginformasikan hal non-kritis (tip, perubahan minor).

2. **Success**
   - Warna dasar: `color-success`.  
   - Icon: check/circle.  
   - Penggunaan:
     - Konfirmasi keberhasilan (berhasil menyimpan, pembayaran sukses).

3. **Warning**
   - Warna dasar: `color-warning`.  
   - Icon: alert triangle.  
   - Penggunaan:
     - Peringatan: butuh perhatian, tapi belum error fatal.

4. **Error / Destructive**
   - Warna dasar: `color-destructive`.  
   - Icon: error/stop.  
   - Penggunaan:
     - Kesalahan yang mencegah user melanjutkan atau memproses.

Alert netral (tanpa warna semantik kuat) dapat menggunakan kombinasi `muted` + `foreground`.

---

## 3. Layout & Typography

### 3.1 Struktur

Layout dasar (horizontal):

- Kolom kiri: icon status.  
- Kolom tengah:
  - Title (typography `typo-body-1` semi bold / `typo-large` kecil).  
  - Deskripsi (typography `typo-body-1` atau `typo-caption-1` untuk teks tambahan).  
- Kolom kanan (opsional): tombol/link kecil.

### 3.2 Spacing & Radius

- Padding:
  - Sekitar `px-4 py-3` (sesuai Figma).  
- Spacing internal:
  - Jarak icon ↔ teks: `gap-3` (mis.).  
  - Jarak title ↔ deskripsi: kecil (`mt-1`).
- Radius:
  - Mengikuti radius card (konsisten dengan `card` & button).

---

## 4. Colors & Background

Gunakan kombinasi warna:

- Background:
  - Info: tint dari `color-info` + `muted`.  
  - Success: tint dari `color-success`.  
  - Warning: tint dari `color-warning`.  
  - Error: tint dari `color-destructive`.
- Border:
  - Gunakan warna semantik lebih kuat (mis. `border-info`, `border-success`, dll).  
  - Atau gunakan garis tipis dengan warna mendekati background namun sedikit lebih pekat.
- Text:
  - Title: semantik foreground (`success`/`warning`/`destructive`) atau `foreground` kuat.  
  - Deskripsi: `muted-foreground` atau semantik foreground yang lebih lembut.
- Icon:
  - Ikuti warna status (info/success/warning/error).

---

## 5. Mapping ke Komponen (shadcn Alert)

Target: gunakan pola `Alert` dari shadcn dan sesuaikan dengan tokens Reimaji.

### 5.1 API Komponen (usulan)

```ts
type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
  icon?: React.ReactNode
}
```

### 5.2 Base Classes

Contoh arah (bukan final):

- Container:
  - `relative w-full rounded-md border px-4 py-3 flex gap-3`  
  - Variant mengubah `bg-*`, `border-*`, `text-*` sesuai warna semantik.

- Title:
  - `font-semibold text-body-1` atau `text-large`.  

- Description:
  - `text-body-1 text-muted-foreground` atau `text-caption-1`.

- Icon wrapper:
  - `mt-0.5 flex-shrink-0 text-status-color` (color per variant).

---

## 6. Aturan Penggunaan

- Gunakan alert:
  - Dekat dengan konteks masalah/aksi (mis. di dekat form yang error).  
  - Di atas konten utama untuk pesan global (mis. maintenance).

- Jangan:
  - Menggunakan alert untuk konten panjang; lebih cocok card atau modal.  
  - Menggunakan warna error untuk peringatan ringan (pilih warning/info).

- Konsistensi:
  - Pastikan ikon & warna mengikuti `design-icons.md` dan `design-colors.md`.  
  - Typography mengikuti `design-typography.md` (title/deskripsi).

