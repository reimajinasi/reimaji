# Reimaji – Design System: Toggle (Switch)

Sumber utama: Figma frame `Toggle` pada file `Design-System--Community-` (node `81:1216`).

Toggle (switch) digunakan untuk mengatur **status on/off** suatu fitur, terutama ketika perubahan berlaku langsung (mis. mengaktifkan notifikasi, dark mode, dsb).

---

## 1. Konsep & Prinsip

- Toggle adalah kontrol biner (ON/OFF) dengan representasi visual seperti saklar:  
  - Track (jalur) dengan bentuk pil.  
  - Thumb (lingkaran) yang bergerak dari kiri ke kanan.  
- Berbeda dengan checkbox:
  - Checkbox cocok untuk pilihan diskrit (setuju/tidak, pilih beberapa item).  
  - Toggle cocok untuk status setting yang langsung aktif/nonaktif.

---

## 2. State & Variants

### 2.1 State

- `off` – toggle dalam posisi kiri.  
- `on` – toggle dalam posisi kanan.  
- `disabled` – tidak dapat diinteraksi (untuk on/off).

### 2.2 Variants Visual

- Default:
  - Track:
    - Off: warna `muted` / `muted-foreground` dengan opacity.  
    - On: warna `primary`.
  - Thumb:
    - Off: `background`/`card` (putih) dengan border halus.  
    - On: `primary-foreground` atau putih, di atas track `primary`.

- Size (jika di Figma ada lebih dari satu):
  - `default` – lebar dan tinggi standar (mis. 40×24px).  
  - `small` (opsional) – lebih kecil untuk UI padat.

---

## 3. Layout & Spacing

- Toggle + label:
  - `inline-flex items-center gap-2`.  
  - Toggle di kiri, label di kanan.

- Track:
  - Bentuk pil (radius penuh).  
  - Lebar > tinggi (rasio ~2:1).

- Thumb:
  - Lingkaran dengan margin kecil dari tepi track ketika on/off.

- Label:
  - Typography: `typo-body-1`.  
  - Warna: `foreground` (default), `muted-foreground` jika disabled.

---

## 4. Colors per State

Gunakan referensi dari `design-colors.md`.

- **Off (enabled)**:
  - Track: `muted` atau `border` dengan opacity.  
  - Thumb: `background` (atau `card`) dengan border `border`.  

- **On (enabled)**:
  - Track: `primary`.  
  - Thumb: `primary-foreground` / putih.

- **Disabled**:
  - Track: `muted`.  
  - Thumb: `muted-foreground` atau `background` dengan opacity lebih rendah.  
  - Label: `muted-foreground`.  
  - Tidak ada hover/focus ring yang kuat.

---

## 5. Mapping ke Komponen (React / shadcn)

Target: gunakan pola `Switch` dari shadcn dan sesuaikan dengan tokens Reimaji.

### 5.1 API Komponen (usulan)

```ts
interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}
```

### 5.2 Base Classes (arah)

Wrapper toggle (switch):
- `inline-flex h-6 w-11 items-center rounded-full border border-transparent transition-colors`  
- Off:
  - `bg-muted`  
- On:
  - `data-[state=checked]:bg-primary`

Thumb:
- `pointer-events-none block h-4 w-4 rounded-full bg-background shadow-200 transition-transform`  
- Posisi:
  - Off: `translate-x-1`  
  - On: `data-[state=checked]:translate-x-5`

Disabled:
- Tambah kelas:
  - `data-[state=disabled]:opacity-50 data-[state=disabled]:cursor-not-allowed`

Wrapper dengan label:
- `flex items-center gap-2`  
- Label mengikuti aturan `design-typography.md` dan warna `design-colors.md`.

---

## 6. Aturan Penggunaan

- Gunakan toggle untuk:
  - Setting yang efeknya langsung (real-time), mis. aktif/nonaktif fitur.  
  - Status global yang selalu terlihat (mis. “Dark mode”).

- Jangan gunakan toggle untuk:
  - Aksi sekali jalan (mis. “Hapus akun” → lebih cocok button).  
  - Pilihan multi-opsi yang saling eksklusif (gunakan radio).

- Konsistensi:
  - Ikuti ikon/label yang jelas menjelaskan efek ON/OFF.  
  - Pastikan state awal (default) aman; ON sebaiknya berarti “fitur aktif” dengan konsekuensi jelas.

