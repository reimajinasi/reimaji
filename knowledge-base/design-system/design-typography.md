# Reimaji – Design System: Typography

Typography diambil langsung dari frame `Typography` di Figma:

- File: `Design-System--Community-`  
- Node: `7:4 (Typography)`  
- Terdiri dari: H1–H5, Giant–Tiny, B1–B4, C1–C3, Label.

Semua text style di kode harus mengacu ke token di bawah ini (jangan membuat style bebas).

## 1. Font Family

- Font family utama: **Inter** (sesuai frame `Font`, node `27:2530`).  
  - Inter adalah variable font family yang dirancang untuk layar komputer, dengan x-height tinggi untuk keterbacaan teks campuran huruf besar–kecil, serta fitur OpenType seperti slashed zero dan tabular numbers.  
  - Implementasi Tailwind:
    - Tambahkan `Inter` sebagai `font-sans`.  
    - Semua style typography di bawah diasumsikan menggunakan `font-sans` (Inter).

## 2. Prinsip Umum Typography

- Hirarki jelas: H1–H5 → Giant–Tiny → Body → Caption/Label.  
- Konsistensi: satu jenis informasi → satu style tetap.  
- Boleh ada penyesuaian kecil di breakpoint besar, tetapi nilai dasar mengikuti Figma.

## 3. Heading Scale (H1 – H5)

Diambil dari section `H1 - H5`:

1. **`typo-h1`**
   - Figma: `H1. Headline`  
   - Size: **48px**  
   - Line height: **58px**  
   - Weight: **Semi Bold**  
   - Spacing: **0**  
   - Penggunaan:
     - Hero title landing page.  
     - Judul halaman utama.

2. **`typo-h2`**
   - Figma: `H2. Headline`  
   - Size: **40px**  
   - Line height: **48px**  
   - Weight: **Semi Bold**  
   - Spacing: **0**  
   - Penggunaan:
     - Judul section besar (News, LMS, dsb).

3. **`typo-h3`**
   - Figma: `H3. Headline`  
   - Size: **32px**  
   - Line height: **38px**  
   - Weight: **Semi Bold**  
   - Spacing: **0**  
   - Penggunaan:
     - Subsection penting di dalam halaman.

4. **`typo-h4`**
   - Figma: `H4. Headline`  
   - Size: **28px**  
   - Line height: **34px**  
   - Weight: **Semi Bold**  
   - Spacing: **0**  
   - Penggunaan:
     - Judul card besar, judul course.

5. **`typo-h5`**
   - Figma: `H5. Headline`  
   - Size: **24px**  
   - Line height: **28px**  
   - Weight: **Semi Bold**  
   - Spacing: **0**  
   - Penggunaan:
     - Judul card medium (mis. News/Research detail).  
     - Heading di dashboard.

## 4. Display / Button Font (Giant – Tiny)

Diambil dari section `Giant - Tiny` (Button Font):

1. **`typo-giant`**
   - Figma: `Giant`  
   - Size: **18px**  
   - Line height: **24px**  
   - Weight: **Semi Bold**  
   - Spacing: **0**  
   - Penggunaan:
     - Headline kecil di card/panel.  
     - Bisa untuk CTA besar.

2. **`typo-large`**
   - Figma: `Large`  
   - Size: **16px**  
   - Line height: **20px**  
   - Weight: **Semi Bold**  
   - Spacing: **0**  
   - Penggunaan:
     - Teks utama button (primary).  
     - Judul list item.

3. **`typo-medium`**
   - Figma: `Medium`  
   - Size: **14px**  
   - Line height: **16px**  
   - Weight: **Semi Bold**  
   - Spacing: **0**  
   - Penggunaan:
     - Label sekunder, badge, tab text.

4. **`typo-small`**
   - Figma: `Small`  
   - Size: **12px**  
   - Line height: **16px**  
   - Weight: **Semi Bold**  
   - Spacing: **0**  
   - Penggunaan:
     - Label kecil di UI, sub-label.

5. **`typo-tiny`**
   - Figma: `Tiny`  
   - Size: **10px**  
   - Line height: **12px**  
   - Weight: **Semi Bold**  
   - Spacing: **0**  
   - Penggunaan:
     - Info sangat kecil (timestamp mini, dsb).  
     - Gunakan hemat agar tetap terbaca.

## 5. Body Text (B1 – B4)

Diambil dari section `B1 - B4`:

1. **`typo-body-1`**
   - Figma: `B1. Body`  
   - Size: **16px**  
   - Line height: **24px**  
   - Weight: **Regular**  
   - Spacing: **0**  
   - Penggunaan:
     - Body text utama (paragraf di News/Research/LMS).

2. **`typo-body-2`**
   - Figma: `B2. Body`  
   - Size / Line / Weight: **TODO – ambil dari tabel B2 di Figma**.  
   - Penggunaan:
     - Body text di area lebih padat (card kecil, sidebar).

3. **`typo-body-3`**
   - Figma: `B3. Body`  
   - Size / Line / Weight: **TODO – ambil dari tabel B3 di Figma**.  
   - Penggunaan:
     - Body text lebih kecil untuk info tambahan.

4. **`typo-body-4`**
   - Figma: `B4. Body`  
   - Size / Line / Weight: **TODO – ambil dari tabel B4 di Figma**.  
   - Penggunaan:
     - Body text terkecil sebelum kategori caption.

## 6. Caption & Label (C1 – C3, Label)

Diambil dari section `C1 - C2` + `C3` dan `LABEL`:

1. **`typo-caption-1`**
   - Figma: `C1. Caption`  
   - Size: **12px**  
   - Line height: **16px**  
   - Weight: **Regular**  
   - Spacing: **0**  
   - Penggunaan:
     - Caption di bawah gambar atau teks tambahan kecil.

2. **`typo-caption-2`**
   - Figma: `C2. Caption`  
   - Size: **12px**  
   - Line height: **16px**  
   - Weight: **Medium**  
   - Spacing: **0**  
   - Penggunaan:
     - Caption dengan sedikit penekanan (lebih tebal).

3. **`typo-caption-3`**
   - Figma: `C3. Caption`  
   - Size: **10px**  
   - Line height: **14px**  
   - Weight: **Medium**  
   - Spacing: **0**  
   - Penggunaan:
     - Timestamp kecil, disclaimer, catatan mini.

4. **`typo-label`**
   - Figma: `Label`  
   - Size: **12px**  
   - Line height: **16px**  
   - Weight: **Medium**  
   - Spacing: **0**  
   - Penggunaan:
     - Label form dan control (input, select, toggle).

## 7. Aturan Penggunaan Typography di UI

- **Heading vs Body**
  - Halaman/section title: `typo-h1`–`typo-h3`.  
  - Judul card/panel: `typo-h4`/`typo-h5` atau `typo-giant`.  
  - Body text: `typo-body-1` sebagai default.

- **Button & UI**
  - Button utama: `typo-large`.  
  - Button kecil / badge / tab: `typo-medium` atau `typo-small`.

- **Caption & Meta**
  - Caption: `typo-caption-1`/`typo-caption-2`.  
  - Meta info/timestamp: `typo-caption-3` atau `typo-tiny`.

- **Konsistensi**
  - Satu tipe informasi → satu style fixed, tidak bercampur.

## 8. Panduan Tailwind Config untuk Typography

```ts
fontSize: {
  h1: ['48px', { lineHeight: '58px' }],
  h2: ['40px', { lineHeight: '48px' }],
  h3: ['32px', { lineHeight: '38px' }],
  h4: ['28px', { lineHeight: '34px' }],
  h5: ['24px', { lineHeight: '28px' }],

  giant: ['18px', { lineHeight: '24px' }],
  large: ['16px', { lineHeight: '20px' }],
  medium: ['14px', { lineHeight: '16px' }],
  small: ['12px', { lineHeight: '16px' }],
  tiny: ['10px', { lineHeight: '12px' }],

  'body-1': ['16px', { lineHeight: '24px' }],
  // TODO: isi body-2, body-3, body-4 dari Figma
  'caption-1': ['12px', { lineHeight: '16px' }],
  'caption-2': ['12px', { lineHeight: '16px' }],
  'caption-3': ['10px', { lineHeight: '14px' }],
  label: ['12px', { lineHeight: '16px' }],
}
```

Penggunaan di komponen:
- `text-h1`–`text-h5` untuk heading.  
- `text-giant`/`text-large` untuk judul kecil & button.  
- `text-body-1` untuk paragraf.  
- `text-caption-*` dan `text-label` untuk caption/label/meta.

