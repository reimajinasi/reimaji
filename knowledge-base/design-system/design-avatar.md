# Reimaji – Design System: Avatar

Sumber utama: Figma frame `Avatar` pada file `Design-System--Community-` (node `104:2206`).

Avatar digunakan untuk menampilkan representasi user atau entitas:
- Foto profil (image).  
- Inisial nama (fallback).  
- Ikon generik ketika tidak ada data user.

---

## 1. Konsep & Prinsip

- Avatar harus:
  - Jelas pada ukuran kecil.  
  - Konsisten bentuk (round/rounded) di seluruh aplikasi.  
  - Menampilkan fallback yang rapi jika gambar gagal dimuat.
- Avatar sering dipakai:
  - Di top navbar (profile).  
  - Di list user, komentar, atau kartu profil.

---

## 2. Size & Shape

Ukuran spesifik mengacu ke Figma; di sini definisi token:

- `avatar-sm`
  - Ukuran: **TODO – ambil dari Figma** (mis. 24×24px).  
  - Penggunaan: daftar padat, chip user.

- `avatar-md`
  - Ukuran: **TODO – ambil dari Figma** (mis. 32×32px).  
  - Penggunaan: navbar top, card user kecil.

- `avatar-lg`
  - Ukuran: **TODO – ambil dari Figma** (mis. 40–48px).  
  - Penggunaan: halaman profil, header section.

Shape:
- Bentuk: `rounded-full` (lingkaran) atau radius sesuai Figma (jika tidak full circle).  
- Gambar selalu di-`object-cover` agar proporsi wajah tetap baik.

---

## 3. Variants (Content)

### 3.1 Image Avatar

- Menampilkan foto user (URL).  
- Jika gambar berhasil dimuat:
  - Background: gambar.  
  - Border (opsional): `border` tipis untuk kontras di background terang.

### 3.2 Initials Avatar

- Jika gambar tidak tersedia:
  - Tampilkan inisial (1–2 huruf, mis. “RS”).  
  - Typography: `typo-medium` atau `typo-large` sesuai size avatar.  
  - Background: `muted` atau warna brand lembut.  
  - Text: `foreground` atau `primary-foreground` (kontras tinggi).

### 3.3 Icon Avatar

- Jika user anonim/guest:
  - Tampilkan icon user generik (Iconoir).  
  - Gunakan warna `muted-foreground` di atas background `muted`.

---

## 4. Badge Status (Opsional)

Jika Figma menyertakan status (online/offline, notif kecil):

- Status dot:
  - Posisi: sudut kanan bawah avatar.  
  - Ukuran: kecil (mis. 8–10px) dengan border putih tipis agar jelas.  
  - Warna:
    - Online: `success`.  
    - Away: `warning`.  
    - Offline: `muted`.

Implementasi:
- Wrapper `relative`.  
- Status dot: `absolute bottom-0 right-0 rounded-full bg-success border-2 border-background`.

---

## 5. Mapping ke Komponen (shadcn / React)

Target: gunakan pola `Avatar` dari shadcn dan sesuaikan dengan tokens Reimaji.

### 5.1 API Komponen (usulan)

```ts
type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  src?: string
  alt?: string
  name?: string // untuk inisial
  size?: AvatarSize
  status?: 'online' | 'offline' | 'away'
}
```

### 5.2 Base Classes

- Wrapper:
  - `relative inline-flex items-center justify-center rounded-full bg-muted overflow-hidden`  
  - Size mapping:
    - `sm`: `h-6 w-6`  
    - `md`: `h-8 w-8`  
    - `lg`: `h-10 w-10` (sesuaikan dengan Figma).

- Image:
  - `h-full w-full object-cover`.

- Fallback (initials/icon):
  - `flex h-full w-full items-center justify-center text-medium text-foreground`.

- Status dot (jika `status` diberikan):

```tsx
<span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-success" />
```

(warna dan ukuran disesuaikan dengan status & Figma).

---

## 6. Aturan Penggunaan

- Jika tersedia `src` valid:
  - Selalu tampilkan image avatar.  
  - Pastikan `alt` diisi (untuk aksesibilitas).

- Jika `src` tidak ada / gagal:
  - Gunakan inisial dari `name`.  
  - Jika `name` juga tidak tersedia, gunakan icon user generik.

- Konsistensi:
  - Size avatar sesuai konteks: navbar (md), daftar padat (sm), profil (lg).  
  - Jangan mencampur shape (some circle, some square) tanpa alasan jelas — ikuti desain global Figma.

