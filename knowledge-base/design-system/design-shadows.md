# Reimaji – Design System: Shadows

Bagian ini mendefinisikan token bayangan (shadow) untuk kedalaman dan hierarki elemen UI.

Sumber:
- Figma frame `Shadow` – node `118:1723` (children: 100, 200, ..., 800).

## 1. Prinsip Umum Shadows

- Gunakan **sedikit level shadow** agar tampilan tetap bersih.  
- Shadow digunakan untuk:
  - Membedakan elemen mengambang (modal, dropdown, popover).  
  - Memberi depth pada card penting (mis. highlight News/Research, panel utama).  
- Hindari shadow berlebihan pada semua elemen; kombinasi background + border + shadow tipis sudah cukup.

## 2. Token Shadow (100–800)

Diambil dari frame `Shadow` di Figma (children `100`, `200`, ..., `800`):

> Nilai teknis (offset X/Y, blur, spread, warna) **harus diambil dari Figma** saat implementasi. Di sini hanya didefinisikan nama token dan penggunaannya.

1. **`shadow-100`**
   - Sumber Figma: frame `100`.  
   - Nilai: **TODO – isi dari Figma**.  
   - Penggunaan:
     - Elevation paling rendah; hampir datar.  
     - Toolbar, section biasa, panel di background.

2. **`shadow-200`**
   - Sumber Figma: frame `200`.  
   - Nilai: **TODO – isi dari Figma**.  
   - Penggunaan:
     - Card standar yang ingin sedikit terangkat (NewsCard, ResearchCard default).

3. **`shadow-300`**
   - Sumber Figma: frame `300`.  
   - Nilai: **TODO – isi dari Figma**.  
   - Penggunaan:
     - Card yang lebih penting, atau state hover untuk card standar.

4. **`shadow-400`**
   - Sumber Figma: frame `400`.  
   - Nilai: **TODO – isi dari Figma**.  
   - Penggunaan:
     - Panel informasi penting, misalnya banner status subscription.

5. **`shadow-500`**
   - Sumber Figma: frame `500`.  
   - Nilai: **TODO – isi dari Figma**.  
   - Penggunaan:
     - Elemen yang tampil di atas card lain (mis. sticky panel kecil).

6. **`shadow-600`**
   - Sumber Figma: frame `600`.  
   - Nilai: **TODO – isi dari Figma**.  
   - Penggunaan:
     - Popover kecil, tooltip dengan depth jelas.

7. **`shadow-700`**
   - Sumber Figma: frame `700`.  
   - Nilai: **TODO – isi dari Figma**.  
   - Penggunaan:
     - Dropdown, menu konteks, sheet ringan.

8. **`shadow-800`**
   - Sumber Figma: frame `800`.  
   - Nilai: **TODO – isi dari Figma**.  
   - Penggunaan:
     - Elevation tertinggi: modal dialog, full-screen overlay panel.

## 3. Aturan Penggunaan Shadow di Komponen

- **Card**
  - Default: `shadow-200`.  
  - Hover: boleh naik ke `shadow-300` + sedikit transform `translate-y`/`scale` kecil jika sesuai desain.

- **Navbar / Header**
  - Biasanya `shadow-none` atau shadow sangat tipis hanya ketika scroll (optional).

- **Modal, Dropdown, Popover**
  - Popover: `shadow-600`.  
  - Dropdown/menu: `shadow-700`.  
  - Modal: `shadow-800`.

- **Button**
  - Default: tanpa shadow (`shadow-100` atau none).  
  - Jika style di Figma memang memakai shadow, gunakan level terendah yang masih konsisten dengan desain global.

## 4. Panduan Tailwind Config untuk Shadows

```ts
// tailwind.config.(ts|js)
theme: {
  extend: {
    boxShadow: {
      // TODO: isi nilai ini dari style Figma Shadow 100–800
      100: '0 0 0 0 rgba(0,0,0,0.00)',
      200: '0 1px 2px 0 rgba(0,0,0,0.05)',
      300: '0 2px 4px 0 rgba(0,0,0,0.06)',
      400: '0 4px 6px 0 rgba(0,0,0,0.08)',
      500: '0 6px 10px 0 rgba(0,0,0,0.10)',
      600: '0 8px 14px 0 rgba(0,0,0,0.12)',
      700: '0 12px 18px 0 rgba(0,0,0,0.14)',
      800: '0 16px 24px 0 rgba(0,0,0,0.16)',
    },
  },
}
```

Penggunaan di komponen:
- `shadow-200` untuk card standar.  
- `shadow-300` untuk state hover/active.  
- `shadow-600`/`shadow-700`/`shadow-800` untuk elemen mengambang (popover, dropdown, modal).

