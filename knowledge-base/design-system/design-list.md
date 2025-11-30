# Reimaji – Design System: List

Sumber utama: Figma frame `List` pada file `Design-System--Community-` (node `230:3580`).

List digunakan untuk menampilkan kumpulan item dengan struktur berulang, misalnya:
- Daftar berita/research.  
- Daftar course/module/lesson.  
- Daftar pengaturan atau menu.

---

## 1. Konsep & Prinsip

- Setiap item list memiliki struktur yang konsisten (icon/thumbnail, title, meta, action).  
- List harus mudah discan:
  - Kontras yang cukup antar item (spacing/border).  
  - Hierarki teks jelas (title vs meta).  
- Hindari informasi berlebih di satu item; simpan detail ke halaman detail atau pop-up.

---

## 2. Variants

### 2.1 Layout

- **List basic (single line)**:
  - Item: icon/avatar + title + optional meta singkat.  
  - Dipakai untuk menu atau daftar sederhana.

- **List with description**:
  - Title (baris pertama) + deskripsi pendek (baris kedua).  
  - Meta info tambahan (badge, timestamp) di kanan.

- **List with thumbnail**:
  - Thumbnail kecil di kiri (image/icon besar).  
  - Title + meta + deskripsi di kanan.

### 2.2 Density

- `comfortable` – spacing lebih lega (`py-3`–`py-4`).  
- `compact` – spacing lebih rapat (`py-2`) untuk daftar panjang.

---

## 3. Layout & Spacing

- Container list:
  - `flex flex-col divide-y divide-border` (opsional) atau `gap-2`.  
  - Background bisa `transparent` atau `card` tergantung konteks.

- Item:
  - `flex items-center gap-3 py-2` (basic).  
  - Untuk layout dengan deskripsi: gunakan `flex flex-col` di bagian teks.

- Typography:
  - Title: `typo-body-1` atau `typo-medium`.  
  - Deskripsi: `typo-caption-1` / `typo-body-2`.  
  - Meta (timestamp, badge): `typo-caption-3`.

---

## 4. Colors & States

- Background:
  - Default: `background` atau `card`.  
  - Hover: `muted` halus (untuk item clickable).

- Text:
  - Title: `foreground`.  
  - Deskripsi/meta: `muted-foreground`.

- Selected (opsional):
  - Background: sedikit lebih kuat (`accent`).  
  - Border kiri kecil dengan `primary`.

---

## 5. Mapping ke Komponen (React)

### 5.1 API List & ListItem (usulan)

```ts
interface ListProps {
  children: React.ReactNode
}

interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean
  leading?: React.ReactNode // icon/avatar/thumbnail
  trailing?: React.ReactNode // badge, meta, action icon
  title: React.ReactNode
  description?: React.ReactNode
}
```

### 5.2 Base Classes

- `List`:
  - `flex flex-col divide-y divide-border` atau `flex flex-col gap-2`.

- `ListItem`:
  - Wrapper: `flex items-center gap-3 py-2 px-3 rounded-md hover:bg-muted transition-colors`.  
  - Selected state: `data-[selected=true]:bg-accent data-[selected=true]:border-l-2 data-[selected=true]:border-primary`.

---

## 6. Aturan Penggunaan

- Gunakan list:
  - Untuk menampilkan kumpulan item yang sejenis.  
  - Ketika user perlu memilih/klik item untuk melihat detail.

- Konsistensi:
  - Ikuti typography & color tokens (`design-typography.md`, `design-colors.md`).  
  - Gunakan `design-icons.md` untuk icon/thumbnail kecil yang konsisten.

