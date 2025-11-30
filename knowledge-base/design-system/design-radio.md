# Reimaji – Design System: Radio

Sumber utama: Figma frame `Radio` pada file `Design-System--Community-` (node `80:1692`).

Radio digunakan untuk memilih **satu** opsi dari beberapa pilihan yang saling eksklusif.

---

## 1. Konsep & Prinsip

- Radio terdiri dari:
  - Lingkaran luar (border).  
  - Lingkaran dalam (dot) ketika dipilih.  
  - Label teks di sisi kanan.  
- Hanya **satu** radio dapat aktif dalam satu group.  
- Klik pada label juga harus mengubah state radio.

---

## 2. State & Variants

### 2.1 State

- `unchecked` – lingkaran kosong.  
- `checked` – lingkaran dengan dot di tengah.  
- `disabled` – tidak dapat diinteraksi, tampak pudar.

### 2.2 Variants (Visual)

- Default:
  - Border luar: warna `primary` / `border` ketika belum dipilih.  
  - Dot dalam: warna `primary` ketika dipilih.  
- Error (opsional):
  - Border/dot bisa menggunakan `destructive`.
- Size:
  - Diameter lingkaran: selaras dengan typografi label (`typo-body-1` atau `typo-small`), biasanya 16–20px (diambil dari Figma saat implementasi).

---

## 3. Layout & Spacing

- Radio + label:
  - `inline-flex items-center gap-2`.  
  - Lingkaran di kiri, label di kanan.

- Label:
  - Typography: `typo-body-1`.  
  - Warna:
    - Default: `foreground`.  
    - Disabled: `muted-foreground`.

- Group radio:
  - Disusun vertikal (`flex flex-col gap-2`) atau horizontal (`flex flex-row gap-4`) sesuai kebutuhan dan desain Figma.

---

## 4. Colors per State

Gunakan token dari `design-colors.md`.

- **Unchecked (enabled)**:
  - Background dalam: `background`.  
  - Border luar: `border` (atau `muted-foreground` tipis).  
  - Dot: tidak ada.

- **Checked (enabled)**:
  - Background dalam: `background`.  
  - Border luar: `primary`.  
  - Dot: `primary`.

- **Disabled**:
  - Background dalam & border: `muted`.  
  - Dot (jika checked): `muted-foreground`.  
  - Label: `muted-foreground`.  
  - Tidak ada efek hover/focus.

---

## 5. Mapping ke Komponen (shadcn / React)

Target: gunakan pola `Radio`/`RadioGroup` shadcn dan sesuaikan dengan tokens Reimaji.

### 5.1 API Komponen (usulan)

```ts
interface RadioGroupProps {
  name: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
}
```

### 5.2 Base Classes

Lingkaran (radio visual):
- `peer h-4 w-4 rounded-full border border-input`  
- `peer-checked:border-primary`  
- Pseudo-element untuk dot:
  - `peer-checked:after:block` dengan `after:h-2 after:w-2 after:rounded-full after:bg-primary after:mx-auto after:my-auto`.

Wrapper (Radio + Label):
- `flex items-center gap-2`  
- Label:
  - `text-body-1 text-foreground peer-disabled:text-muted-foreground`.

---

## 6. Aturan Penggunaan

- Gunakan radio ketika:
  - User harus memilih **tepat satu** opsi dari beberapa pilihan.  
  - Semua opsi terlihat sekaligus di layar (bukan di dropdown).

- Jangan:
  - Menggunakan radio untuk multi-select (gunakan checkbox).  
  - Menampilkan terlalu banyak radio dalam satu group tanpa pengelompokan (lebih baik bagi menjadi section).

- Konsistensi:
  - Typography label merujuk ke `design-typography.md`.  
  - Warna & border merujuk ke `design-colors.md`.  
  - Jika menggunakan icon di dalam label, ikuti `design-icons.md`.

