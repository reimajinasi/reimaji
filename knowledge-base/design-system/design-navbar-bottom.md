# Reimaji – Design System: Bottom Navbar

Sumber utama: Figma frame `Navbar - Bottom` pada file `Design-System--Community-` (node `116:1271`).

Bottom navbar digunakan untuk navigasi utama pada tampilan mobile (dan opsional tablet), menampilkan 3–5 menu utama aplikasi.

---

## 1. Konsep & Prinsip

- Bottom navbar selalu menempel di bagian bawah viewport pada layout mobile.  
- Setiap item navbar terdiri dari:
  - Icon (utama).  
  - Label singkat (opsional pada breakpoint tertentu, tergantung desain Figma).  
- Hanya satu item yang aktif pada satu waktu (halaman saat ini).  
- Jumlah item ideal: 3–5; lebih dari itu akan mengurangi keterbacaan.

---

## 2. Struktur & Variants

### 2.1 Struktur Dasar

- Container:
  - Lebar penuh (`w-full`).  
  - Tinggi tetap (cukup untuk icon + label).  
  - Background: `color-card` atau `background` sesuai desain.  
  - Border-top: tipis (`border-border`) untuk memisahkan dari konten.

- Item:
  - `flex flex-col items-center justify-center` (icon di atas, label di bawah).  
  - Area klik cukup besar (minimal ~48px tinggi).

### 2.2 Variants Item

- `inactive`:
  - Icon warna `muted-foreground`.  
  - Label warna `muted-foreground`, typography `typo-caption-2` atau `typo-small`.

- `active`:
  - Icon warna `primary` (atau `foreground` kuat, sesuai Figma).  
  - Label warna `primary`/`foreground` dan/atau weight lebih tebal.  
  - (Opsional) indicator bar kecil di atas item atau perubahan background.

---

## 3. Layout & Spacing

- Navbar:
  - Padding horizontal: kecil (`px-2`–`px-4`).  
  - Padding vertical: `py-1`–`py-2` agar icon & label tidak terlalu rapat.

- Item:
  - `flex-1` untuk membagi lebar merata antar item.  
  - Gap kecil antara icon dan label (mis. `gap-0.5`–`gap-1`).

- Typography:
  - Label: gunakan `typo-caption-2` atau `typo-small` untuk menjaga kerapihan.

---

## 4. Colors & States

Gunakan token dari `design-colors.md` dan `design-icons.md`.

- Background navbar:
  - Default: `background` atau `card`.  
  - Border-top: `border`.

- Item inactive:
  - Icon: `muted-foreground`.  
  - Label: `muted-foreground`.

- Item active:
  - Icon: `primary`.  
  - Label: `primary` atau `foreground`.  
  - Optional indicator: garis kecil `bg-primary` di atas/bawah icon.

- States:
  - `hover` (di desktop/simulasi): sedikit mengubah background item (mis. `bg-muted`).  
  - `pressed`: bisa gunakan state `active` CSS dengan perubahan kecil pada opacity.

---

## 5. Mapping ke Komponen (React)

### 5.1 API Komponen Navbar

```ts
type NavItem = {
  key: string
  label: string
  icon: React.ReactNode
  href: string
}

interface BottomNavbarProps {
  items: NavItem[]
  activeKey?: string
  onItemClick?: (key: string) => void
}
```

### 5.2 Struktur Komponen

- `BottomNavbar`:
  - Wrapper: `nav` dengan kelas:
    - `fixed bottom-0 left-0 right-0 z-40 border-t bg-background` (atau `bg-card`).  
    - `flex flex-row items-center`.
  - Setiap `NavItem` dirender sebagai `<button>` atau `<a>`:
    - `flex-1 flex flex-col items-center justify-center gap-1 py-2`.

- Penentuan aktif:
  - Jika `activeKey` sama dengan `item.key`, tambahkan kelas `text-primary` untuk icon & label dan optional indicator.

---

## 6. Aturan Penggunaan

- Gunakan Bottom Navbar:
  - Di layout mobile sebagai navigasi utama (Home, Explore, LMS, Profile, dsb).  
  - Hindari menaruh aksi destruktif (Delete) di bottom navbar.

- Jangan:
  - Menyimpan terlalu banyak item (maksimal 5).  
  - Mencampur item navigasi dengan tombol aksi besar (mis. CTA utama; gunakan FAB / button lain).

- Konsistensi:
  - Ikon mengacu ke `design-icons.md` (Iconoir).  
  - Typography label mengacu ke `design-typography.md`.  
  - Warna dan state mengacu ke `design-colors.md`.

