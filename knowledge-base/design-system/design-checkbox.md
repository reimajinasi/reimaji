# Reimaji – Design System: Checkbox

Sumber utama: Figma frame `Checkbox` pada file `Design-System--Community-` (node `77:1203`).

Checkbox digunakan untuk:
- Memilih beberapa opsi (multi-select).  
- Mengaktifkan/menonaktifkan fitur tertentu.  
- Menandai persetujuan atau konfirmasi.

---

## 1. Konsep & Prinsip

- Checkbox terdiri dari:
  - Kotak (box) dengan border.  
  - Tanda centang (check) ketika aktif.  
  - Label teks di sisi kanan.  
- Klik pada label juga harus mengubah state checkbox (bukan hanya kotaknya).
- State visual harus jelas meskipun tanpa warna penuh (kontras bentuk + border).

---

## 2. State & Variants

### 2.1 State

- `unchecked` – kotak kosong.  
- `checked` – kotak berisi centang.  
- `indeterminate` (opsional) – kotak berisi garis horizontal (untuk “sebagian terpilih”).  
- `disabled` – tidak dapat diinteraksi, tampak pudar.

### 2.2 Variants (Visual)

- Default:
  - Border dan centang mengikuti warna `primary`.  
  - Background kotak kosong: `background` atau `card`.  
- Error (opsional):
  - Border dan centang bisa memakai `destructive` (jika definisi di Figma demikian).  
- Size:
  - Ukuran kotak: selaras dengan typography label (`typo-body-1` atau `typo-small`).  
  - Nilai px spesifik diambil dari Figma; umumnya 16–20px.

---

## 3. Layout & Spacing

- Checkbox + label:
  - `inline-flex items-center gap-2`.  
  - Kotak di kiri, label di kanan.

- Label:
  - Typography: `typo-body-1` untuk teks utama; `typo-caption-1` untuk teks kecil.  
  - Warna:
    - Default: `foreground`.  
    - Disabled: `muted-foreground`.

- Grup checkbox:
  - Ditata vertikal dengan `flex flex-col gap-2` atau sesuai Figma.

---

## 4. Colors per State

Gunakan token dari `design-colors.md`.

- **Unchecked (enabled)**:
  - Background kotak: `background`/`card`.  
  - Border: `border`.  
  - Icon: none.

- **Checked (enabled)**:
  - Background kotak: `primary`.  
  - Border: `primary`.  
  - Icon (centang): `primary-foreground`.

- **Indeterminate**:
  - Mirip checked, tetapi icon garis horizontal.  

- **Disabled**:
  - Background & border: `muted`.  
  - Icon: `muted-foreground`.  
  - Label: `muted-foreground`.  
  - Tidak ada efek hover/focus.

---

## 5. Mapping ke Komponen (shadcn / React)

Target: gunakan pola `Checkbox` shadcn dan sesuaikan dengan tokens Reimaji.

### 5.1 API Komponen (usulan)

```ts
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Controlled checked state */
  checked?: boolean
  /** Indeterminate state */
  indeterminate?: boolean
}
```

### 5.2 Base Classes

Kotak:
- `peer h-4 w-4 shrink-0 rounded border border-input bg-background`  
- `peer-checked:bg-primary peer-checked:border-primary`  
- `peer-disabled:cursor-not-allowed peer-disabled:opacity-50`

Icon (centang / indeterminate):
- `text-primary-foreground`  
- Ditampilkan hanya ketika `checked` atau `indeterminate`.

Wrapper (Checkbox + Label):
- `flex items-center gap-2`  
- Label: `text-body-1 text-foreground peer-disabled:text-muted-foreground`.

---

## 6. Aturan Penggunaan

- Gunakan checkbox untuk:
  - Daftar opsi yang independen (bisa memilih lebih dari satu).  
  - “Saya setuju dengan syarat & ketentuan” (single checkbox).

- Jangan:
  - Menggunakan checkbox jika hanya satu opsi yang boleh dipilih (lebih cocok radio button).  
  - Menjadikan checkbox sebagai pengganti switch untuk setting on/off yang butuh feedback langsung; gunakan switch jika lebih sesuai (bila ada di design system).

- Konsistensi:
  - Typography label merujuk ke `design-typography.md`.  
  - Warna & border merujuk ke `design-colors.md`.  
  - Ikon centang mengikuti gaya Iconoir (`design-icons.md`).

