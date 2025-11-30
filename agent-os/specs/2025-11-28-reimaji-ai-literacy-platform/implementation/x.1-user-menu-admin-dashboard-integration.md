# Integrasi Admin/Dashboard ke Dropdown User Menu

## Ringkasan
- Integrasi tautan `/dashboard` dan `/admin` ke dropdown user menu di header dengan komponen custom.
- Mengganti penggunaan `UserButton` bawaan Clerk menjadi tombol avatar+nama dengan dropdown role-aware.

## Lokasi Kode
- Header: `src/components/layout/auth-header.tsx`
- User menu: `src/components/layout/user-menu.tsx`
- Provider konteks: `src/app/layout.tsx` (membungkus seluruh body dengan `ConvexClientProvider`)

## Detail Implementasi
- Data & Auth:
  - Clerk: `useAuth`, `useUser`, `SignInButton`, `SignOutButton`.
  - Convex: `useQuery(api.users.getByClerkId, { clerkUserId })` untuk membaca role user agar dropdown menampilkan `Admin` hanya untuk `admin/superadmin`.
- UI & Interaksi:
  - Tombol berisi avatar (Clerk `imageUrl`), display name (prioritas `fullName` → `username` → email), dan chevron (up/down) sebagai indikator state.
  - Dropdown item:
    - Signed-in: `Dashboard`, `Admin` (hanya jika role `admin/superadmin`), `Sign Out`.
    - Signed-out: `Sign In`.
  - Klik di luar area dropdown akan menutup menu (listener `mousedown` dengan `ref` container).
  - Atribut `aria-haspopup` dan `aria-expanded` dipakai untuk aksesibilitas dasar.
- Konteks Convex:
  - `ConvexClientProvider` dipindah untuk membungkus seluruh isi `<body>` sehingga komponen header (termasuk user menu) berada di bawah context provider.

## Alasan Pemakaian Komponen Custom
- Butuh kontrol penuh atas isi dropdown (tautan `Dashboard/Admin`, `Sign Out`) dan indikator UI (chevron) yang tidak tersedia langsung di `UserButton` default.
- Integrasi role-aware berdasarkan data Convex agar konsisten dengan RBAC di backend.

## Perubahan File
- `src/components/layout/auth-header.tsx`: mengganti render saat signed-in menjadi `<UserMenu />` dan mempertahankan `SignInButton` untuk signed-out.
- `src/components/layout/user-menu.tsx`: komponen client dropdown yang menggabungkan avatar, nama, role-aware links, dan klik-luar auto-close.
- `src/app/layout.tsx`: `ConvexClientProvider` membungkus `AuthHeader`, `MainNav`, dan `{children}`.

## Verifikasi
- Functional:
  - Signed-in non-admin: tombol avatar+nama menampilkan dropdown berisi `Dashboard` dan `Sign Out`.
  - Signed-in admin/superadmin: dropdown juga menampilkan `Admin`.
  - Signed-out: hanya `Sign In`.
  - Klik di luar dropdown menutup menu; chevron berubah sesuai state.
- Build & kualitas:
  - `npm run type-check` OK
  - `npm run lint` OK
  - `npm run build` OK

## Risiko & Follow-up
- Aksesibilitas: tambah keyboard navigation (Escape untuk close, fokus pertama saat open).
- UI polish: transisi/animasi dropdown, ganti chevron ke ikon dari design system bila tersedia.
- Keandalan: fallback avatar placeholder bila `imageUrl` gagal dimuat; guard jika `user` belum tersedia (loading state lebih eksplisit).

## Catatan Keamanan
- RBAC tetap ditegakkan di server (Convex) pada rute/aksi admin; dropdown hanya indikator UI dan tidak menjadi satu-satunya proteksi.
