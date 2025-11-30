# Reimaji – Design System: Badge & Chip

Sumber utama: Figma frame `Badge & Chip` pada file `Design-System--Community-` (node `94:1632`).

Badge & Chip dipakai untuk menandai status, kategori, atau filter ringan dengan elemen kecil berbentuk pil/rectangular.

---

## 1. Konsep & Perbedaan

- **Badge**
  - Kecil, padat, biasanya hanya teks (kadang icon kecil).  
  - Dipakai untuk status (Active, Draft, Error), label kategori kecil, counter ringan.

- **Chip**
  - Sedikit lebih besar dari badge, terasa seperti kontrol interaktif.  
  - Bisa berisi teks + icon (leading/trailing, mis. x untuk remove).  
  - Dipakai untuk filter multi-select, tags, atau pilihan ringan.

Keduanya mengacu ke token typography (`typo-small`/`typo-caption-*`) dan warna (`design-colors.md`).

---

## 2. Variants & States

### 2.1 Variants (Style)

Untuk **Badge** dan **Chip**, style umum:

- `filled`  
  - Background solid (brand/semantic).  
  - Teks kontras (foreground).

- `outline`  
  - Border berwarna, background transparan atau sangat tipis.  
  - Teks berwarna mengikuti border.

- `soft` / `subtle`  
  - Background `muted` dengan tint warna semantic/brand.  
  - Teks menggunakan warna semantic/brand.

Semantic variants (untuk status):
- `neutral` (default) – menggunakan warna base/foreground.  
- `primary` – warna utama brand.  
- `success`, `warning`, `danger` – warna semantik (status).

### 2.2 States (khusus Chip interaktif)

- `default`  
- `hover` – background/border sedikit berubah (lebih kuat).  
- `selected` (untuk chip filter) – style lebih menonjol (mis. filled).  
- `disabled` – kontras menurun, tanpa hover/selected.

Badge biasanya non-interaktif (hanya default/disabled).

---

## 3. Layout & Spacing

### 3.1 Badge

- Typography:
  - Gunakan `typo-caption-2` atau `typo-small` (semi bold).  
- Height:
  - Lebih kecil dari button `small` (mis. 20–24px).  
- Padding:
  - Horizontal: kecil (mis. `px-2`–`px-2.5`).  
  - Vertical: sangat tipis (mis. `py-0.5`–`py-1`).  
- Radius:
  - Pil atau rounded kecil (sesuai Figma: konsisten dengan radius global).

### 3.2 Chip

- Typography:
  - `typo-small` untuk teks.  
- Height:
  - Selevel atau sedikit di bawah button `small` (mis. 28–32px).  
- Padding:
  - Horizontal lebih besar dibanding badge (menampung icon + teks).  
- Icon:
  - Leading icon (kategori) atau trailing icon (close/remove).  
  - Ikon rata tengah secara vertikal.

---

## 4. Colors per Variant

Gunakan token dari `design-colors.md`.

### 4.1 Badge

- Neutral Filled:
  - Background: `muted`.  
  - Text: `muted-foreground`.

- Primary Filled:
  - Background: `primary`.  
  - Text: `primary-foreground`.

- Success/Warning/Danger:
  - Background: `success` / `warning` / `destructive`.  
  - Text: `foreground` atau varian semantik khusus jika ada.

Outline:
- Border: warna semantic/primary.  
- Text: sama dengan border.  
- Background: `transparent`.

### 4.2 Chip

- Default (unselected):
  - Background: `muted`.  
  - Text: `muted-foreground` atau `foreground`.  
  - Border: `transparent` atau `border`.

- Hover:
  - Background sedikit lebih kuat daripada default (tint).  
  - Border bisa sedikit diperkuat.

- Selected:
  - Background: `primary` (atau semantic lain).  
  - Text: `primary-foreground`.  
  - Border: `none` atau `primary`.

---

## 5. Mapping ke Komponen (React / shadcn)

### 5.1 Badge

Target: komponen ringan, mis. `Badge` di `components/ui/badge.tsx`.

Props usulan:

```ts
type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'outline'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}
```

Base classes (arah, bukan final):
- `inline-flex items-center rounded-full border px-2 py-0.5 text-caption-2`  
- Variant mengubah `bg-*`, `text-*`, `border-*` sesuai token warna.

### 5.2 Chip

Chip bisa diimplementasikan sebagai wrapper di atas `Button` atau komponen terpisah:

Props usulan:

```ts
type ChipVariant = 'default' | 'outline' | 'primary' | 'success' | 'warning' | 'danger'

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ChipVariant
  selected?: boolean
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
}
```

Base classes:
- `inline-flex items-center rounded-full border px-3 h-8 text-small`  
- `hover:` dan `data-selected` states untuk mengatur background & border.

---

## 6. Aturan Penggunaan

- Gunakan **Badge** untuk:
  - Status (Draft, Published, Error).  
  - Kategori kecil di card (mis. “News”, “Research”, “LMS”).

- Gunakan **Chip** untuk:
  - Filter multi-select (mis. pilihan topik).  
  - Tag yang bisa dihapus (chip dengan icon close).

- Konsistensi:
  - Jangan mencampur style `filled`/`outline`/`soft` sembarangan untuk jenis status yang sama.  
  - Selalu gunakan typography & warna dari token global agar mudah diubah via design system.

