# Reimaji – Design System: Dropdown

Sumber utama: Figma frame `Dropdown` pada file `Design-System--Community-` (node `255:8891`).

Dropdown digunakan untuk menampilkan daftar pilihan ketika user berinteraksi dengan trigger (input, button, atau icon).

---

## 1. Konsep & Prinsip

- Dropdown muncul dekat dengan trigger (di bawah/atas), selaras secara horizontal.  
- Cocok untuk:
  - Memilih satu opsi dari daftar (select-style).  
  - Menampilkan opsi terkait input (autocomplete, suggestions).
- Jangan gunakan dropdown jika jumlah opsi sangat sedikit (bisa pakai radio/segmented) atau sangat banyak tanpa pencarian (lebih baik pattern lain).

---

## 2. Struktur & Layout

- Trigger:
  - Bisa berupa:
    - Input (select field).  
    - Button (combobox-style).  
  - Menampilkan nilai terpilih atau placeholder.

- Panel dropdown:
  - Kontainer:
    - Background: `card`.  
    - Border: `border`.  
    - Shadow: `shadow-400` atau `shadow-500`.  
    - Radius: `rounded-md`.
  - Isi:
    - Daftar item (lihat `design-list.md` untuk pola layout).  
    - Optional search field di atas untuk filtering.

---

## 3. Item & States

- Item dasar:
  - `flex items-center gap-2 px-3 py-1.5 text-body-1`.  
  - Icon optional di kiri.  
  - Bisa memiliki label & sublabel (description) jika desain Figma mendukung.

- States:
  - Default: `text-foreground`.  
  - Hover: background `muted`, text `foreground`.  
  - Selected:
    - Background `accent` atau border kiri kecil `primary`.  
    - Icon check di kanan (menggunakan Iconoir).
  - Disabled:
    - `text-muted-foreground opacity-50`, tidak ada hover.

---

## 4. Colors & Typography

- Colors:
  - Panel: `bg-card`, `border-border`.  
  - Divider (jika ada grouping): `bg-border`.  
  - Destructive option (jika ada): `text-destructive`.

- Typography:
  - Label utama: `typo-body-1`.  
  - Sublabel/description: `typo-caption-1` `text-muted-foreground`.

---

## 5. Mapping ke Komponen (React / shadcn)

Gunakan pola `Popover` + `Command` / `Select` dari shadcn, disesuaikan dengan design system.

### 5.1 API (usulan generik)

```ts
type DropdownOption = {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
  disabled?: boolean
}

interface DropdownProps {
  options: DropdownOption[]
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
  searchable?: boolean
}
```

### 5.2 Base Classes

- Trigger:
  - Mirip input/button (`design-input.md` / `design-button.md`), dengan icon chevron.  
- Panel:
  - `min-w-[200px] rounded-md border bg-card p-1 shadow-400`.
- Item:
  - `flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-foreground hover:bg-muted`  
  - Selected: tambahkan icon check + gaya `bg-accent`.

---

## 6. Aturan Penggunaan

- Ideal untuk:
  - Pilihan yang tidak terlalu banyak (mis. 5–20).  
  - Form pengaturan, filter, pilihan kategori.
- Konsistensi:
  - Ikuti typography/warna dari `design-typography.md` dan `design-colors.md`.  
  - Ikon dari `design-icons.md`.

