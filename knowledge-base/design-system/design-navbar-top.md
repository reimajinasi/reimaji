# Reimaji – Design System: Top Navbar

Sumber utama: Figma frame `Navbar - Top` pada file `Design-System--Community-` (node `116:2139`).

Top navbar digunakan sebagai header utama aplikasi di desktop dan mobile: branding, navigasi tingkat tinggi, dan akses cepat ke aksi global (search, profile, notifications, dsb).

---

## 1. Konsep & Prinsip

- Menjadi elemen pertama yang dilihat user saat membuka aplikasi.  
- Berisi:
  - Logo/brand.  
  - Navigasi utama (link ke section penting).  
  - Aksi sekunder (search, notifications, profile/avatar, auth).  
- Pada mobile, top navbar biasanya lebih sederhana (logo + 1–2 ikon + toggle menu).

---

## 2. Struktur & Variants

### 2.1 Struktur Dasar (Desktop)

- Container:
  - `w-full` dengan tinggi tetap (mis. 64–72px, mengikuti Figma).  
  - Background: `color-background` atau `color-card`.  
  - Border-bottom tipis: `border-border`.

- Isi (horizontal, 3 zona):
  - Kiri: logo/brand + optional title.  
  - Tengah: nav links (Home, News, Research, LMS, dsb).  
  - Kanan: actions (search, notifications, profile/avatar, auth button).

### 2.2 Variants

- `default`:
  - Background solid.  
  - Border-bottom halus.

- `transparent` (opsional, untuk landing hero):
  - Background transparan di atas hero; berubah menjadi solid saat scroll.

- `scrolled`:
  - Background solid + shadow ringan (`shadow-200`/`shadow-300`).  
  - Memberi depth ketika konten di-scroll.

---

## 3. Layout & Spacing

- Padding:
  - Horizontal: `px-4`–`px-8` (tergantung breakpoint).  
  - Vertical: sehingga total tinggi sesuai desain (mis. `h-16`).

- Nav links:
  - Ditata dengan `flex gap-4` atau sesuai jarak Figma.  
  - Typography: `typo-body-1` atau `typo-medium` untuk penekanan.

- Actions (kanan):
  - Group icon dan button dengan `flex items-center gap-2`–`gap-3`.  
  - Avatar/profile menggunakan komponen avatar (bisa diatur kemudian).

---

## 4. Colors & States

Gunakan token dari `design-colors.md`.

- Background:
  - Default: `background` atau `card`.  
  - Scrolled: sama, tapi boleh ditambah shadow kecil (`shadow-100`/`shadow-200`).

- Nav link:
  - Default: `muted-foreground`.  
  - Hover: `foreground` atau `primary` (underline optional).  
  - Active: `primary` atau `foreground` dengan weight sedikit lebih besar atau indicator kecil di bawah link.

- Icons:
  - Default: `muted-foreground`.  
  - Hover: `foreground`/`primary`.

---

## 5. Responsif (Mobile vs Desktop)

### 5.1 Mobile

- Konten utama:
  - Logo/brand di kiri.  
  - Icon penting di kanan (mis. search, menu/hamburger, profile).

- Nav links:
  - Tidak ditampilkan penuh di top bar; gunakan:
    - Drawer / sheet / menu yang muncul ketika user klik icon menu.  
    - Atau bottom navbar (`design-navbar-bottom.md`) untuk navigasi utama.

### 5.2 Desktop

- Tampilkan nav links secara penuh di tengah atau kiri.  
- Aksi profile/search tetap di kanan.

---

## 6. Mapping ke Komponen (React)

### 6.1 API Komponen Navbar Top

```ts
type TopNavItem = {
  key: string
  label: string
  href: string
}

interface TopNavbarProps {
  items: TopNavItem[]
  activeKey?: string
  onItemClick?: (key: string) => void
  showAuthButtons?: boolean
}
```

### 6.2 Struktur Komponen

- Wrapper:
  - `header` dengan kelas:
    - `sticky top-0 z-40 w-full border-b bg-background`  
    - Optional: `shadow-200` saat scrolled (bisa diatur via state).

- Isi:
  - `div` inner container dengan `mx-auto flex h-16 items-center justify-between px-4 lg:px-8`.
  - Kiri: logo/brand.  
  - Tengah (desktop): nav links (disembunyikan di mobile dengan `hidden md:flex`).  
  - Kanan: icon actions dan auth/profile.

---

## 7. Aturan Penggunaan

- Top navbar selalu hadir di semua halaman utama aplikasi (kecuali layar khusus seperti auth full-screen jika desain menghendaki).  
- Jangan membanjiri top navbar dengan terlalu banyak link; gunakan dropdown/mega-menu jika struktur navigasi kompleks.  
- Ikon dan warna mengacu ke:
  - `design-icons.md` (Iconoir).  
  - `design-colors.md`.  
  - Typography dari `design-typography.md`.

