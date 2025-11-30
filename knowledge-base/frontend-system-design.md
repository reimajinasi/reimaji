# Reimaji – Frontend System Design (MVP)

Dokumen ini menjelaskan desain sistem sisi frontend (Next.js) berdasarkan `reimaji-prd.md` dan `SPECS.md`. Fokus: struktur route, layout, komponen, pola data fetching, auth, dan integrasi AI.

---

## 1. Overview Arsitektur Frontend

- Framework: **Next.js 16 (App Router)**.
- Bahasa: **TypeScript**.
- UI: **shadcn/ui** + **Tailwind CSS**.
- Deployment: **Vercel**.
- Backend/data: **Convex** diakses dari frontend via:
  - React hooks Convex (untuk interaksi dinamis di client components).
  - Server components / server actions (untuk data awal dan operasi tertentu).
- Auth: **Clerk** (client dan server helpers).
- Integrasi eksternal:
  - **Xendit**: halaman checkout dan status pembayaran (via API route + UI notifikasi).
  - **Resend**: tidak langsung di UI (hanya feedback sukses/gagal).
  - **Vercel AI SDK**: komponen playground & admin summarize.

Prinsip: **block by block**, mulai dari skeleton → layout → komponen → UI → konten.

---

## 2. Routing & Layout

### 2.1 Peta Route Utama (App Router)

- Public:
  - `/` – Landing page.  
  - `/news` – Listing News (sebagian free, sebagian premium).  
  - `/news/[id]` – Detail News.  
  - `/research` – Listing Research.  
  - `/research/[id]` – Detail Research.  
  - `/playground` – AI Playground (akses minimal free user; detail gating mengikuti role).

- Protected (butuh login):
  - `/dashboard` – Ringkasan user (News ringkas + progress LMS).  
  - `/lms` – Overview course utama.  
  - `/lms/[moduleSlug]/[lessonSlug]` – Halaman lesson (video + quiz).  

- Admin (role `admin`):
  - `/admin` – Overview admin.  
  - `/admin/news` – CRUD News.  
  - `/admin/research` – CRUD Research.  
  - `/admin/courses` – CRUD courses/modules/lessons.  

- API:
  - `/api/xendit/webhook` – webhook pembayaran.  
  - (opsional) `/api/ai/summarize` – endpoint internal jika tidak langsung via Convex.

### 2.2 Layout Hirarki

- `app/layout.tsx`
  - Global layout:
    - Navbar (logo, link utama, user menu Clerk).  
    - Footer.  
  - Menyediakan theme wrapper (jika ada), dan styling utama.

- `app/(marketing)/layout.tsx`
  - Untuk halaman publik (landing, news, research, playground publik).  
  - Bisa punya layout berbeda dari dashboard (tanpa sidebar).

- `app/(app)/dashboard/layout.tsx`
  - Layout aplikasi setelah login:
    - Sidebar / top bar.  
    - Slot konten utama.  

- `app/admin/layout.tsx`
  - Layout khusus admin:
    - Sidebar menu admin (News, Research, Courses).  
    - Area konten CRUD.

### 2.3 Public vs Protected Route

- Gunakan Clerk:
  - `auth().userId` di server components / route handlers.  
  - `SignedIn`, `SignedOut` components di client.
- Guard:
  - Route public tidak membutuhkan auth.  
  - Route `/dashboard`, `/lms`, `/admin` divalidasi:
    - `proxy.ts` atau guard per-page (server-side) untuk cek:
      - login,  
      - role (`pro` untuk akses penuh konten premium, `admin` untuk panel admin).

Catatan: Next.js 16 mengganti `middleware` menjadi `proxy`. Referensi: https://nextjs.org/docs/messages/middleware-to-proxy

---

## 3. Komponen & Design System

### 3.1 Organisasi Komponen

- `components/ui/`
  - Wrapper shadcn/ui & komponen dasar:
    - `button`, `input`, `card`, `badge`, `dialog`, `tabs`, `toast`, dsb.

- `components/layout/`
  - Layout reusable:
    - `PageShell` – wrapper halaman dengan judul, description, dan container.  
    - `DashboardLayout`, `AdminLayout` (bisa juga di `app` layout).  
    - `Section` – blok konten dengan padding/judul standar.

- `components/features/news/`
  - `NewsCard`, `NewsList`, `NewsFilters`.

- `components/features/research/`
  - `ResearchCard`, `ResearchList`, `ResearchFilters`.

- `components/features/lms/`
  - `CourseOverview`, `ModuleList`, `LessonCard`, `LessonPlayer` (video + summary), `QuizForm`, `ProgressBar`.

- `components/features/playground/`
  - `PlaygroundPromptForm`, `PlaygroundOutput`, `RiskExplanationPanel`.

- `components/features/admin/`
  - Form & table untuk CRUD News, Research, Course.

Prinsip: **reusable**; komponennya dirancang agar bisa dipakai di beberapa halaman dengan props yang jelas, bukan hard-coded untuk satu halaman.

### 3.2 Pola Design System

- Warna, spacing, dan typography diatur via Tailwind config + shadcn theme.
- Penggunaan `className` menggunakan util seperti `clsx`/`cn`.
- Komponen kompleks (mis. form) memakai pattern:
  - `Form` dari shadcn/ui  
  - React Hook Form (opsional, jika ingin konsistensi).

---

## 4. Data Fetching & State Management

### 4.1 Server Components vs Client Components

- **Server Components**:
  - Dipakai untuk halaman yang:
    - Membaca data awal (SSR) dari Convex (via server actions / HTTP).  
    - Butuh SEO (landing, news detail, research detail).  
  - Contoh: `app/news/page.tsx`, `app/research/[id]/page.tsx`.

- **Client Components**:
  - Untuk interaksi dinamis:
    - Quiz, progress update.  
    - Playground AI (streaming response).  
    - Admin form CRUD.  
  - Menggunakan React hooks dari Convex (`useQuery`, `useMutation`) di sisi client.

### 4.2 Pola Akses Data Convex

- Untuk data yang SEO critical:
  - Bisa gunakan server-side query (Convex HTTP function atau server action) di Server Component.
- Untuk data yang interaktif:
  - Gunakan Convex React hooks langsung di client component.
- Hindari state global berat:
  - State global minimal (mis. state UI ringan atau user profile ringan jika perlu).  
  - Sebagian besar state di-drive oleh data dari Convex dan props.

### 4.3 Contoh Alur Data

- **Dashboard user**:
  - Server component:
    - Mendapat userId via Clerk.  
    - Memanggil query Convex untuk:
      - progress kursus,  
      - berita/research rekomendasi.  
  - Client component:
    - Menangani interaksi kecil (mis. filter, expand/collapse).

- **Halaman lesson**:
  - Server component:
    - Ambil `lesson` berdasarkan slug.  
    - Ambil `module`, `course` bila perlu.  
  - Client component:
    - Menangani quiz submission (mutation Convex).  
    - Update progress (mutation).

---

## 5. Auth & Authorization di Frontend

### 5.1 Integrasi Clerk

- Global:
  - Provider Clerk di `app/layout.tsx`.  
  - `UserButton` di navbar untuk akses profil/sign out.

- Server:
  - Gunakan helper `auth()` untuk mendapatkan `userId` dalam Server Components / route handlers.

- Client:
  - Gunakan `useUser()` atau `SignedIn` / `SignedOut` untuk conditional render.

### 5.2 Guard Halaman & Komponen

- Komponen helper (mis. di `components/auth/`):
  - `ProtectedPage`:
    - Cek login; jika tidak login → redirect ke halaman sign-in / landing.  
  - `RequirePro`:
    - Cek role `pro`; jika tidak → tampilkan CTA upgrade.
  - `RequireAdmin`:
    - Hanya render children jika role `admin`.

- Role di UI harus sinkron dengan data di Convex:
  - Server-side: role diambil dari record `users` (Convex).  
  - Client-side: bisa di-fetch via Convex query ringan (`currentUserProfile`).

### 5.3 Rasional penggantian middleware → proxy
- Istilah “middleware” sering disalahpahami (diasosiasikan ke Express.js).
- Next.js mengarahkan developer ke API yang lebih ergonomis; middleware hanya last resort.
- “Proxy” menegaskan boundary jaringan dan default Edge Runtime.
- Perubahan ini memperjelas tujuan, mengurangi misuse. Referensi: https://nextjs.org/docs/messages/middleware-to-proxy
---

## 6. Integrasi AI di UI

### 6.1 Playground

- Layout:
  - Kolom kiri: form prompt + opsi model (optional).  
  - Kolom tengah: output AI (streaming text).  
  - Kolom kanan: panel penjelasan risiko & tips.

- Flow:
  - User input prompt → panggil endpoint AI (Vercel AI SDK).  
  - Tampilkan output secara streaming (jika diaktifkan).  
  - Setelah respon selesai, panggil endpoint explain (opsional) untuk menjelaskan risiko/halusinasi.

### 6.2 Admin Summarize

- Komponen:
  - Textarea input `rawText` (berita/paper).  
  - Tombol “Generate Summary”.  
  - Hasil: `summary` dan (untuk research) `implication`.

- Flow:
  - Panggil endpoint internal (Convex / API Next.js) yang menggunakan Vercel AI SDK.  
  - Admin bisa edit hasil sebelum disimpan ke `news` atau `research`.

---

## 7. Error, Loading, dan UX States

### 7.1 Loading / Error Files Next.js

- Gunakan:
  - `loading.tsx` di folder halaman utama (mis. `app/news/loading.tsx`, `app/lms/loading.tsx`).  
  - `error.tsx` untuk menangani error pada segment tertentu.

### 7.2 Empty & Edge States

- Contoh:
  - News/Research kosong: tampilkan pesan “belum ada konten” + CTA ke admin (kalau admin).  
  - LMS belum ada progress: tampilkan ajakan “mulai dari modul 1”.  
  - Error koneksi: berikan opsi retry.

### 7.3 Notifikasi

- Gunakan toast (dari shadcn/ui) untuk:
  - Sukses/failed pada action: save konten, submit quiz, pembayaran.

---

## 8. Performance & SEO

### 8.1 Halaman SEO-Penting

- Landing (`/`), `news` listing & detail, `research` listing & detail:
  - Pakai Server Components untuk data awal.  
  - Gunakan `generateMetadata` untuk: title, description, Open Graph, dan URL canonical.

### 8.2 Optimasi

- Lazy load:
  - Video player LMS.  
  - Komponen Playground (AI).
- Hindari over-fetch:
  - Gunakan query Convex yang fokus pada kebutuhan UI.  
  - Paginate listing News/Research bila sudah besar.

---

## 9. Konvensi Teknis Frontend

- File:
  - Gunakan penamaan folder kebab-case (`news-list`, `lesson-player`).  
  - Komponen React dengan PascalCase (`NewsCard`, `LessonPlayer`).
- `use client`:
  - Hanya di file yang butuh interaktivitas (hooks, event handler, state).  
  - Hindari menandai seluruh pohon sebagai client component tanpa perlu.
- TypeScript:
  - Hindari `any` sebisa mungkin; gunakan tipe eksplisit untuk props dan response.
- Reusability:
  - Jika pola UI digunakan ≥2 kali, ekstrak ke `components/` dengan props yang jelas.  
  - Jangan men-duplikasi markup kompleks antar halaman tanpa alasan kuat.

Dokumen ini adalah kerangka; detail implementasi (mis. daftar props per komponen) bisa dipecah per-feature ketika development berjalan block-by-block.
