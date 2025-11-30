# Reimaji – Design System: Tabs

Sumber utama: Figma frame `Tab` pada file `Design-System--Community-` (node `247:7995`).

Tabs digunakan untuk mengorganisir konten dalam beberapa panel yang saling eksklusif, diakses melalui bar tab di atas atau sekitar konten.

---

## 1. Konsep & Prinsip

- Hanya satu tab aktif pada satu waktu.  
- Tab label harus jelas dan singkat (1–2 kata).  
- Konten tiap tab masih berkaitan dalam konteks yang sama (mis. “Overview / Details / Activity”).

---

## 2. Variants

### 2.1 Tab Style

Kemungkinan style dari Figma (sesuaikan ketika membaca detail):

- `underline`:
  - Tabs sebagai teks dengan garis bawah untuk yang aktif.

- `pill`:
  - Tabs sebagai kapsul (rounded) dengan background berbeda untuk state aktif.

Untuk MVP, pilih satu style utama (mis. underline) dan gunakan konsisten.

### 2.2 Size

- Default:
  - Tinggi sebaris teks (mis. 32–40px).  
  - Padding horizontal: `px-3`–`px-4`.

---

## 3. Colors & States

Gunakan token dari `design-colors.md` dan `design-typography.md`:

- **Default (inactive)**:
  - Text: `muted-foreground`.  
  - Background: transparent.  
  - Underline: none (untuk style underline).

- **Hover**:
  - Text: `foreground`.  
  - Background: `muted` tipis (untuk pill style) atau underline halus.

- **Active**:
  - Text: `foreground` atau `primary`.  
  - Underline style:
    - Garis bawah `bg-primary` di bawah tab.  
  - Pill style:
    - Background: `accent`.  
    - Text: `accent-foreground`.

- **Disabled** (jika ada):
  - Text: `muted-foreground` dengan opacity diturunkan.  
  - Tidak ada hover.

---

## 4. Layout

- Tabs list:
  - `flex items-center gap-2 border-b border-border` (untuk underline style).  
  - Tabs diurutkan dari kiri ke kanan.

- Tab item:
  - `inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium`  
  - Active: kelas tambahan untuk warna/underline.

- Tab content:
  - Ditempatkan di bawah bar tab dengan padding (`pt-4`).

---

## 5. Mapping ke Komponen (React / shadcn)

Gunakan `Tabs` dari shadcn sebagai basis:

```ts
interface TabItem {
  value: string
  label: string
}

interface TabsProps {
  items: TabItem[]
  value: string
  onValueChange?: (value: string) => void
}
```

Base classes:
- List: `flex items-center gap-2 border-b border-border`.  
- Trigger: `inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground`  
  - Active: `data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary`.

---

## 6. Aturan Penggunaan

- Gunakan tabs ketika:
  - Konten dapat dibagi menjadi beberapa kategori, tetap dalam konteks halaman yang sama.  
  - User perlu beralih cepat antar kategori tanpa berpindah halaman.

- Jangan:
  - Menggunakan tabs untuk navigasi global (gunakan navbar).  
  - Menaruh terlalu banyak tab (>5) tanpa menu overflow.

