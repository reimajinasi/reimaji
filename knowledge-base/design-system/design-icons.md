# Reimaji – Design System: Icons

Sumber utama:
- Figma frame `Icons` – file `Design-System--Community-` (node `34:801`).  
- Figma frame tambahan terkait penggunaan icons (node `36:1311`).  
- Icon set: **Iconoir** – https://iconoir.com/

Ikon dipakai untuk:
- Menguatkan makna aksi (delete, edit, search, dsb).  
- Memperjelas status (success, warning, error).  
- Menambah konteks di komponen (button, input, badge, chip, menu).

Dokumen ini mendefinisikan aturan umum ukuran, warna, dan penggunaan ikon yang akan dipetakan ke komponen React.

---

## 1. Prinsip Umum Icons

- Gunakan **satu set icon konsisten**: **Iconoir** (sesuai yang dipakai di Figma).  
- Ikon harus:
  - Jelas dibaca di ukuran kecil.  
  - Tidak terlalu detail (hindari noise pada 16–20px).  
  - Selaras dengan ketebalan stroke yang sama di seluruh app.
- Jangan mencampur icon style berbeda (mis. outline vs filled) secara acak; ikuti style utama Figma (umumnya outline).

---

## 2. Ukuran Icon (Size Tokens)

Ikon harus disejajarkan dengan skala typography dan komponen (Button, Input, Chip).

Tokens usulan (nilai px perlu disesuaikan dengan Figma saat implementasi):

1. **`icon-xs`**
   - Ukuran: **TODO – ambil dari Figma** (mis. 12px).  
   - Penggunaan:
     - Icon kecil di dalam badge/caption.

2. **`icon-sm`**
   - Ukuran: **TODO – ambil dari Figma** (mis. 16px).  
   - Penggunaan:
     - Icon di `button small` / chip kecil / helper ikon.

3. **`icon-md`**
   - Ukuran: **TODO – ambil dari Figma** (mis. 20px).  
   - Penggunaan:
     - Icon default di button medium/large, input dengan icon.

4. **`icon-lg`**
   - Ukuran: **TODO – ambil dari Figma** (mis. 24px).  
   - Penggunaan:
     - Icon di hero/section, empty states, ilustrasi ringan.

Mapping umum:
- Button Giant/Large: `icon-md` atau `icon-lg`.  
- Button Medium/Small: `icon-sm` atau `icon-md`.  
- Badge/Caption: `icon-xs` atau `icon-sm`.

---

## 3. Warna & Stroke

### 3.1 Warna Default

Gunakan token warna dari `design-colors.md`:

- Icon utama di teks normal:
  - `color-foreground`.  
- Icon di state muted/secondary:
  - `muted-foreground`.  
- Icon di atas background primary:
  - `primary-foreground`.  
- Icon status:
  - Success: `success` atau `success-foreground`.  
  - Warning: `warning`.  
  - Error: `destructive` atau `destructive-foreground`.

### 3.2 Stroke & Style

- Ketebalan stroke ikon harus konsisten dengan set di Figma (mis. 1.5px atau 2px).  
- Di React (SVG), pastikan:
  - `strokeWidth` sesuai set Figma.  
  - `stroke="currentColor"` agar warna mengikuti `color` CSS (kelas Tailwind).

---

## 4. Penggunaan Icons di Komponen

### 4.1 Button (lihat `design-button.md`)

- Icon + Text:
  - Icon sebelum teks (leading) untuk aksi (Add, Edit, Download).  
  - Ukuran icon disesuaikan dengan size button (lihat section 2).  
  - Jarak antara icon dan teks: kecil tapi konsisten (mis. `gap-2`).

- Icon-only:
  - Gunakan `aria-label` untuk aksesibilitas (`title`/`sr-only` text).  
  - Pastikan touch target minimal (40–44px).

### 4.2 Input (lihat `design-input.md`)

- Leading icon:
  - Icon search, email, user, dsb.  
  - Warna default: `muted-foreground`.  

- Trailing icon:
  - Clear, toggle password, dropdown.  
  - Ikon harus memiliki affordance aksi (contoh: `X`, eye icon).

### 4.3 Badge & Chip (lihat `design-badge-chip.md`)

- Badge:
  - Icon kecil di kiri teks untuk status (check, alert, info).  
  - Gunakan `icon-xs` atau `icon-sm`.

- Chip:
  - Leading icon (kategori/tipe).  
  - Trailing icon (close/remove).

---

## 5. Organisasi & Naming Icons di Kode

### 5.1 Sumber Icons (React)

- Disarankan memakai satu library icon React yang:
  - Mirip style-nya dengan Figma (outline filled).  
  - Mudah di-tree-shake (import per-icon).

Contoh pola (tanpa mengikat ke library tertentu):

```ts
// components/icons.tsx
export { Search, X, Plus, Edit, Trash, Info } from 'some-icon-library'
```

Penggunaan:

```tsx
import { Search } from '@/components/icons'
```

### 5.2 Naming

- Ikuti nama yang deskriptif:
  - `IconSearch`, `IconUser`, `IconSettings`, dsb, jika dibungkus sendiri.  
  - Hindari nama generik seperti `Icon1`, `Icon2`.

---

## 6. Aksesibilitas

- Icon-only button:
  - Tambahkan `aria-label` pada `<button>` untuk menjelaskan fungsinya.  
  - Jika memakai teks sr-only:
    - Gunakan elemen `<span className="sr-only">Deskripsi aksi</span>`.

- Icon dekoratif (tidak menambah informasi):
  - Tambahkan `aria-hidden="true"` pada ikon.  
  - Jangan tambahkan teks alternatif redundan.
