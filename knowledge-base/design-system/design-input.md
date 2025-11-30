# Reimaji – Design System: Input

Sumber utama: Figma frame `Input` (file `Design-System--Community-`, node `57:892`).

Input di sini mencakup:
- Text field (single-line): email, password, search, dsb.  
- Textarea (multi-line) sebagai variasi dengan tinggi lebih besar.  
- Variasi dengan icon (leading/trailing), helper text, dan error/success state.

Dokumen ini mendefinisikan aturan visual & interaksi yang akan dipetakan ke komponen `Input`/`Textarea` (berbasis shadcn/ui) di kode.

---

## 1. Struktur Variants

### 1.1 Variant Dimension

- **Type**
  - `text` – generic text input.  
  - `password` – input dengan toggle visibility (optional).  
  - `search` – input dengan icon search.  
  - `textarea` – multi-line (height lebih tinggi).

- **State**
  - `default`  
  - `hover`  
  - `focus`  
  - `disabled`  
  - `error`  
  - (opsional) `success`, jika didefinisikan di Figma.

- **Decoration**
  - `with-leading-icon` – icon di sisi kiri dalam field.  
  - `with-trailing-icon` – icon di sisi kanan (mis. visibility toggle, clear, dropdown chevron).  
  - `with-label` – label di atas input.  
  - `with-helper` – helper text / hint di bawah input.  
  - `with-error-text` – pesan error di bawah input.

Implementasi di kode (usulan):
- Komponen `Input` menerima prop:
  - `state?: "default" | "error" | "success"` (untuk styling ring/warna).  
  - `disabled?: boolean` (HTML native).  
  - `leadingIcon?`, `trailingIcon?` (React nodes).  
  - Label/helper/error text diatur oleh wrapper `FormField`/`FormItem` di layer form.

---

## 2. Layout & Spacing

### 2.1 Text Field (Single-line)

Nilai spesifik (padding, radius) harus diambil dari Figma; di sini hanya prinsip:

- Tinggi default:
  - Single-line input: selaras dengan ukuran `Button` `medium`/`large` (lihat `design-button.md`).  
  - Gunakan minimal tinggi ~40–48px untuk keterbacaan.
- Padding:
  - Horizontal: cukup untuk teks + icon (mis. `px-3`–`px-4`).  
  - Vertical: memadai sehingga teks tidak menempel border.
- Radius:
  - Mengikuti radius global card/button (konsisten seluruh sistem).
- Typography:
  - Gunakan `typo-body-1` sebagai base text.  
  - Placeholder: `typo-body-1` dengan warna `muted-foreground`.

### 2.2 Textarea (Multi-line)

- Tinggi minimal lebih besar (mis. 80–120px).  
- Padding horizontal & vertical sama seperti input single-line.  
- Typography tetap `typo-body-1`.

---

## 3. Colors & Borders per State

Gunakan token dari `design-colors.md` dan `design-shadows.md`.

### 3.1 Default

- Background: `color-card` atau `background` (sesuai Figma).  
- Border: `color-border`.  
- Text: `color-foreground`.  
- Placeholder: `muted-foreground`.  
- Shadow: none.

### 3.2 Hover

- Border sedikit diperkuat (mis. warna lebih gelap/opaque).  
- Background bisa tetap sama atau sedikit lebih terang/gelap.  
- Tidak mengubah layout, hanya feedback visual ringan.

### 3.3 Focus

- Border tetap atau sedikit lebih kuat.  
- Tambah ring fokus:
  - Gunakan `ring` dengan warna `primary` (`focus-visible:ring-primary`).  
  - Pastikan kontras cukup tetapi tidak berlebihan.

### 3.4 Disabled

- Background: mendekati `muted`.  
- Text & placeholder: lebih pudar (`muted-foreground`).  
- Border: `border` namun dengan opacity lebih rendah.  
- Cursor: `not-allowed`.  
- Tidak ada ring/hover state.

### 3.5 Error / Success

- Error:
  - Border: `color-destructive`.  
  - Optional ring: `ring-destructive`.  
  - Error text (di bawah): juga menggunakan `color-destructive`.
- Success (jika digunakan):
  - Border: `color-success`.  
  - Optional ring: `ring-success`.

---

## 4. Label, Helper, dan Error Text

### 4.1 Label

- Typography: `typo-label`.  
- Posisi:
  - Di atas input dengan jarak kecil (mis. `mb-1`).
- Warna:
  - Default: `foreground`.  
  - Disabled: `muted-foreground`.  
  - Error: masih label warna normal, kecuali Figma mendefinisikan warna khusus.

### 4.2 Helper Text

- Typography: `typo-caption-1`.  
- Posisi:
  - Di bawah input, di atas error text jika keduanya muncul.  
  - Jarak kecil dari field (mis. `mt-1`).
- Warna:
  - Default: `muted-foreground`.

### 4.3 Error Text

- Typography: `typo-caption-2` atau `typo-caption-3` (lebih menonjol).  
- Warna: `color-destructive-foreground`.  
- Posisi:
  - Di bawah helper text jika ada, atau langsung di bawah input.

---

## 5. Ikon di Input

### 5.1 Leading Icon

- Ikon ditempatkan di sisi kiri dalam field:  
  - Gunakan `flex` wrapper (input + icon).  
  - Tambah padding-left pada input agar teks tidak menimpa icon.  
- Warna icon:
  - Default: `muted-foreground`.  
  - Hover/focus: bisa naik ke `foreground` atau `primary` jika sesuai Figma.

### 5.2 Trailing Icon

- Trailing icon untuk:
  - Toggle password visibility.  
  - Clear text.  
  - Dropdown chevron (untuk select-like input).
- Interaksi:
  - Klik icon memiliki efek aksi tanpa mengubah fokus field (kecuali seharusnya).

---

## 6. Mapping ke Komponen (shadcn/ui)

Target: gunakan base `Input`/`Textarea` shadcn, lalu sesuaikan dengan token Reimaji.

### 6.1 Input Base Classes

Contoh arah (detail di kode, bukan di dokumen ini):

- Base:
  - `flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-body-1 text-foreground`  
  - `placeholder:text-muted-foreground`  
  - `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`  
  - `disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:border-muted`

- Error:
  - Tambah kelas `border-destructive` dan `focus-visible:ring-destructive`.

### 6.2 Wrapper dengan Label & Helper

Gunakan pola `FormField`/`FormItem`:

- `FormLabel` → `typo-label`.  
- `FormDescription` → `typo-caption-1`.  
- `FormMessage` → `typo-caption-2` + warna `destructive`.

---

## 7. Catatan Implementasi

- Semua typography merujuk ke `design-typography.md`.  
- Warna dan ring merujuk ke `design-colors.md`.  
- Jika Figma mendefinisikan varian tambahan (mis. Input dengan icon di dalam border yang berbeda), update dokumen ini sebelum mengubah kode.  
- Pastikan state visual konsisten antara Input dan komponen form lain (Select, Combobox, dsb).

