# Reimaji – Design System: Button Group

Sumber utama: Figma frame `Button Group` (file `Design-System--Community-`, node `48:712`).

Button Group digunakan untuk mengelompokkan beberapa tombol yang saling terkait (mis. pilihan mode, filter, atau aksi berurutan) sehingga terlihat sebagai satu kesatuan visual.

---

## 1. Konsep & Prinsip

- Button Group adalah **kumpulan Button** (`design-button.md`) yang:
  - Berbagi konteks yang sama (mis. beberapa filter dalam satu kategori).  
  - Disusun berjajar (horizontal atau vertical) dengan jarak konsisten.  
  - Dalam beberapa kasus, berbentuk **segmented control** (tampak seperti satu kapsul dengan beberapa segmen).
- Prinsip:
  - Satu group = satu fokus aksi atau pilihan.  
  - Hindari mencampur aksi yang tidak sejenis ke dalam satu group.

---

## 2. Tipe Button Group

Secara umum, Button Group dapat diklasifikasikan menjadi:

1. **Inline Group (Button berjarak)**  
   - Kumpulan button berdampingan dengan jarak kecil (gap), masing-masing masih tampak sebagai button individual.  
   - Cocok untuk: toolbar, aksi sekunder yang related.

2. **Segmented Control**  
   - Beberapa opsi yang saling eksklusif (seperti tab kecil), tampak menyatu dengan border bersama.  
   - Hanya satu opsi aktif pada satu waktu.  
   - Cocok untuk: mode tampilan (List/Grid), filter sederhana (Hari ini / Minggu ini / Bulan ini).

3. **Icon Button Group**  
   - Versi icon-only untuk aksi kecil berderet (mis. alignment, sort, dsb).  
   - Biasanya style `outline` atau `clear`.

---

## 3. Layout & Spacing

### 3.1 Orientation

- **Default**: horizontal (row).  
- Vertical (column) bisa digunakan untuk menu/stack aksi, tapi harus konsisten dengan konteks UI (jarang).

### 3.2 Spacing

- Inline Group:
  - Gunakan gap konsisten (mis. `gap-2` atau `gap-1.5` tergantung desain Figma).  
  - Setiap button tetap dengan radius normal (lihat `design-button.md`).

- Segmented Control:
  - Button tampak menyatu:
    - Tombol pertama: radius hanya di sisi kiri.  
    - Tombol terakhir: radius hanya di sisi kanan.  
    - Tombol tengah: tidak ada radius; garis pemisah halus.
  - Hilangkan gap visual di antara button (border saling berbagi).

---

## 4. States & Interaksi

### 4.1 State Per Button

- Setiap button di dalam group mewarisi state dari definisi Button:
  - `default`, `hover`, `focus`, `press`, `disabled` (lihat `design-button.md`).  
- Focus ring tetap terlihat di level button (bukan seluruh group).

### 4.2 Aktif/Selected

- **Inline Group**:
  - Bisa memiliki satu atau lebih button aktif, tergantung konteks (mis. multi-filter).  
  - Button aktif menggunakan variant berbeda (mis. filled) atau outline yang lebih kuat.

- **Segmented Control**:
  - Hanya satu button yang boleh aktif pada satu waktu.  
  - Button aktif: style yang lebih menonjol (Filled) dibanding yang tidak aktif (Outline/Clear).

---

## 5. Mapping ke Komponen (React)

Tujuan: komponen `ButtonGroup` yang membungkus beberapa `Button`.

### 5.1 API Komponen (usulan)

```ts
type ButtonGroupVariant = 'inline' | 'segmented'
type ButtonGroupOrientation = 'horizontal' | 'vertical'

interface ButtonGroupProps {
  variant?: ButtonGroupVariant
  orientation?: ButtonGroupOrientation
  /** Jika true, hanya satu button yang bisa aktif (segmented-style) */
  exclusive?: boolean
  /** Optional: value untuk button yang aktif ketika exclusive = true */
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}
```

### 5.2 Layout Classes

- `inline` (default):
  - `flex flex-row gap-2` (gap disesuaikan desain).  
  - Setiap child adalah `Button` biasa.

- `segmented`:
  - `inline-flex` tanpa gap visual:
    - `Button` pertama: tambah kelas `rounded-r-none`.  
    - `Button` terakhir: tambah kelas `rounded-l-none`.  
    - `Button` tengah: `rounded-none border-l-0` (agar border di tengah tidak double).  
  - Warna aktif vs tidak aktif mengikuti variant (`filled` untuk aktif, `outline/clear` untuk tidak aktif).

### 5.3 Integrasi dengan Button

- ButtonGroup **tidak** mengatur variant/size individual; itu tetap di prop `Button`.  
- Untuk segmented control:
  - Button di dalam group bisa dipaksa:
    - `variant="filled"` untuk option aktif.  
    - `variant="outline"` atau `clear` untuk option tidak aktif.  
  - Pemilihan aktif dapat diatur lewat prop `value`/`onValueChange` atau dibiarkan ke parent.

---

## 6. Aturan Penggunaan

- Gunakan Button Group ketika:
  - Beberapa aksi/opsi berada dalam konteks yang sama dan tampil berdekatan.  
  - User perlu membandingkan opsi secara visual.

- Jangan gunakan Button Group:
  - Untuk aksi yang tidak terkait (mis. gabungan “Save” dan “Delete Permanently” dalam satu segmented control).  
  - Jika jumlah opsi terlalu banyak (lebih baik gunakan dropdown/tabs).

- Konsistensi:
  - Ikuti typography `design-typography.md` untuk label.  
  - Ikuti warna dari `design-colors.md` (primary/muted, dsb).  
  - Ikuti shadow dari `design-shadows.md` jika perlu depth pada group.

