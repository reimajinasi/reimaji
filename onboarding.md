# Onboarding & Progress Tracker – Reimaji

## Tujuan
- Menjadi penanda/catatan progres dari setiap step/block development.
- Memudahkan sinkron tim saat eksekusi fase dan blok kerja.

## Cara Pakai
- Centang checklist saat selesai; tambahkan catatan singkat hasil/risiko.
- Isi Log Progres setiap ada perubahan penting (tanggal, siapa, hasil).
- Jaga konsistensi dengan `tasks.md` dan arsitektur di folder `agent-os/specs/...`.

## Status Ringkas
- Owner: Erik
- Target MVP: 20 minggu
- Goal bisnis: 50 paid users (6–12 bulan)

## Phase Checklist (MVP)
- [x] 0.1 Initialize Next.js 16 + App Router
- [x] 0.2 Setup Convex project & schema files
- [x] 0.3 Implement Clerk authentication (pages + middleware)
- [x] 0.4 Configure Vercel deployment (env + preview)
- [x] 0.5 Konfigurasi integrasi (Xendit, Resend, Vercel AI SDK)
 - [x] 0.6 Routing skeleton `(public)/(app)/admin` + navigasi
- [ ] 0.5 Konfigurasi integrasi (Xendit, Resend, Vercel AI SDK)
- [ ] 0.6 Routing skeleton `(public)/(app)/admin`
- [x] 0.7 Design system foundations (shadcn/ui + Tailwind)
- [x] 0.9 Define Convex schema (users, news, research, courses, modules, lessons)
- [x] 0.10 Role-based access control (guest/free/pro/admin)
- [x] 1.1 Complete auth flow (registration, dashboard, reset password)
- [x] 1.2 Implement user role management (admin panel, upgrade flow, session management)
- [ ] 1.3 News content system (listing/detail/gating)
- [ ] 1.4 Research content system (listing/detail/filter)
- [ ] 1.5 Admin content management + AI summarization
- [ ] 1.6 LMS foundation (courses → modules → lessons)
- [ ] 1.7 Lesson player + progress tracking
- [ ] 1.8 Quiz system (MCQ, scoring, feedback)
- [ ] 1.10 Xendit subscription checkout + webhook
- [ ] 1.11 Subscription status & history
- [ ] 1.12 Email notifications (welcome, payment)
- [ ] 1.14 Landing page (hero, value prop, CTA)

## Block Development (High-level)
- [x] BLOCK_1 – Authentication Foundation
  - Clerk integration, protected routes, user profile, role management
- [ ] BLOCK_2 – Content Management
  - News/Research CRUD, publishing workflow, admin dashboard
- [ ] BLOCK_3 – Learning Management System
  - Course structure, video player, progress, quiz

## Teknis Kritis (Checklist)
- [ ] Env: `.env.local` diisi dari `knowledge-base/env.txt`, jangan commit
- [ ] TypeScript target `es2020`, lint + type-check hijau
- [ ] Webhook Xendit: Node runtime + HMAC `x-xendit-signature`
- [ ] Publish flow: `publishedAt` null saat draft, set saat publish, historis saat unpublish
- [ ] Design system tokens + aksesibilitas dipatuhi

## Log Progres
- [x] [2025-11-29] Step: 0.1 Initialize Next.js 16 + App Router (root)
  - Hasil: Type-check, lint, build OK; struktur `src/app` di root; Husky pre-commit aktif; Tailwind v4 via PostCSS
  - Risiko/Follow-up: tsconfig target saat ini `ES2017` (rencana upgrade ke `es2020` sesuai standar); lanjut 0.2 Convex setup

- [x] [2025-11-29] Step: 0.2 Configure Convex backend
  - Hasil: Paket `convex` terpasang; `convex/schema.ts` & `convex/users.ts` dibuat; `.env.local` di-set (DEPLOYMENT_URL, HTTP_ACTIONS_URL, DEPLOY_KEYS + alias); type-check, lint, build OK; CRUD dasar terverifikasi (insert & query users)
  - Risiko/Follow-up: Setelah `_generated` tersedia, hapus exclude `convex/**` dari `tsconfig.json`; lanjut fungsi dasar untuk `news/research`

## Referensi Cepat
- `agent-os/specs/2025-11-28-reimaji-ai-literacy-platform/planning/01–05*.md` (arsitektur & standar)
- `tasks.md` (roadmap 98 tugas, critical path)
- `DESIGN-SYSTEM-QUICK-REFERENCE.md` (token & pola UI)
- [x] [2025-11-29] Step: 0.3 Implement Clerk authentication
  - Hasil: Provider, sign-in/up pages, middleware proteksi, sample protected route; type-check, lint, build OK dengan layout & protected dynamic
  - Risiko/Follow-up: Isi key Clerk asli di `.env.local` untuk uji login nyata; tambah sinkronisasi user Clerk → Convex

- [x] [2025-11-29] Step: 0.4 Configure Vercel deployment
  - Hasil: `.env.example` di-root dibuat; rencana env Vercel (public/server-only) terdokumentasi; preview deployments disiapkan; custom domain dicatat opsional; `npm run type-check` OK, `npm run lint` OK (4 warnings), `npm run build` OK.
  - Bukti: Type-check exit code 0; Lint 0 errors; Build sukses dengan daftar route dan Proxy aktif.
  - Risiko/Follow-up: Isi env di Vercel untuk Preview/Production; terapkan custom domain saat tersedia; pertimbangkan meng-suppress warning eslint pada file auto-generated Convex.

- [x] [2025-11-29] Verifikasi login & logout
  - Hasil: Login berhasil untuk `1200pixels@gmail.com`; halaman `/protected` menampilkan `Email: 1200pixels@gmail.com` dan `Role: pro` (data dari Convex). Rute `/sign-out` ditambahkan dan bekerja (hapus sesi, redirect ke `/sign-in`). Middleware dipindah ke `src/middleware.ts` sehingga Clerk berjalan normal.
  - Bukti: Clerk API menunjukkan user `1200pixels@gmail.com` terverifikasi dan `password_enabled: true`; Convex query `users.getByClerkId` mengembalikan role `pro`.
  - Risiko/Follow-up: Tambah tombol logout di layout jika diperlukan untuk QA multi-akun.

- [x] [2025-11-29] Step: 0.5 Set up third-party integrations
  - Hasil: `.env.example` dan `.env.local` diperbarui untuk OpenRouter (Gemini 2.5 Flash), Xendit (dev), Resend; koneksi Convex diisi; rencana integrasi terdokumentasi; skrip verifikasi dibuat dan diuji.
  - Bukti: `npm run type-check` OK, `npm run lint` OK (4 warnings auto-generated), `npm run build` OK; `scripts/test-xendit.sh` → valid (balance reachable); `scripts/test-resend.sh` → valid (domains reachable).
  - Risiko/Follow-up: Pastikan env di Vercel diisi sama seperti lokal; tambahkan smoke test otomatis di CI pada branch integration.
- [x] [2025-11-29] Step: 0.6 Create folder structure and routing skeleton
  - Hasil: Struktur `(public)/(app)/admin` dibuat; halaman `news`, `research`, `dashboard`, `lms`, `admin` ditambahkan; layout dasar untuk tiap area; `MainNav` dipasang di root layout.
  - Bukti: `npm run type-check` OK; `npm run lint` OK (4 warnings auto-generated); `npm run build` OK; route tampil lengkap; Proxy aktif.
  - Risiko/Follow-up: Tambah konten nyata pada halaman; perlu `AppNav` di `(app)` jika dibutuhkan di UI final.

- [x] [2025-11-29] Step: 0.7 Set up design system foundations
  - Hasil: Tokens Tailwind v4 di `globals.css`; util `cn`; komponen UI dasar (`Button`, `Card`, `Input`, `Breadcrumb`, `Skeleton`, `Separator`); layout reusable (`PageHeader`, `ContentCard`, `LoadingState`, `Container`, `Section`). Root layout dibungkus `Container`; Home dibersihkan dari template Next.js.
  - Bukti: `npm run type-check` OK, `npm run lint` OK, `npm run build` OK; routes ter-generate normal setelah penerapan di `(public)/(app)/admin` dan Home.
  - Risiko/Follow-up: Terapkan komponen di halaman fitur; tambah varian/aksesibilitas lanjutan jika diperlukan.

- [x] [2025-11-29] Step: 0.8 Create development workflow
  - Hasil: Strategi GitHub Flow terdokumentasi; scripts ditambah (`dev:backend`, `dev:setup`, `lint:fix`, `format:check`); checklist code review dibuat.
  - Bukti: `npm run type-check` OK, `npm run lint` OK, `npm run build` OK.
  - Risiko/Follow-up: Opsional tambah CI untuk auto lint/type-check; dokumentasikan PR template.
- [x] [2025-11-29] Step: 0.9 Define Convex schema
  - Hasil: Tabel `courses`, `modules`, `lessons` ditambahkan dengan soft delete + indeks; `news/research/users` dipertahankan.
  - Bukti: Convex push sekali (`dev --once`) sukses; `type-check`, `lint`, `build` OK.
  - Risiko/Follow-up: Tambah tabel `progress`, `quizzes` saat implementasi LMS.

- [x] [2025-11-29] Step: 0.10 Implement role-based access control
  - Hasil: Helper RBAC (`ensureRole`) dibuat; fungsi `users.listAll` proteksi `admin/superadmin`.
  - Bukti: `type-check`, `lint` OK; `build` OK.
  - Risiko/Follow-up: Terapkan RBAC di fungsi `news/research/courses` saat CRUD dibuat.

- [x] [2025-11-29] Step: 1.1 Complete user authentication flow
  - Hasil: Proxy global `src/proxy.ts` aktif; SignIn/SignUp tersedia; Dashboard disinkronkan ke Convex (`upsertFromClerk`) dan menampilkan `Email`/`Role`; halaman Profil memakai `<UserProfile />`; reset password tersedia via flow Clerk (Forgot password di SignIn).
  - Bukti: `npm run type-check` OK, `npm run lint` OK, `npm run build` OK; routes terdaftar (`/dashboard`, `/profile`, `/sign-in`, `/sign-up`, `/sign-out`).
  - Risiko/Follow-up: Pastikan kunci Clerk asli di `.env.local` untuk verifikasi email & reset password.

- [x] [2025-11-29] Step: 1.2 Implement user role management
  - Hasil: Tambah Convex mutation `users.updateRole` dengan RBAC; halaman `admin/users` untuk listing user dan update role (Free → Pro, dst) via server actions.
  - Bukti: `npm run type-check` OK, `npm run lint` OK, `npm run build` OK; route `/admin/users` terdeteksi.
  - Risiko/Follow-up: Tambah audit log perubahan role bila diperlukan.

- [x] [2025-11-29] Step: 1.3 Create News content system
  - Hasil: Queries/mutations Convex (`news.list`, `getBySlug`, `create/update/remove`); halaman publik `/news` (filter q/type/tag) dan `/news/[slug]` (gating premium).
  - Bukti: `type-check`, `lint`, `build` OK; routes `/news`, `/news/[slug]` terdaftar.
  - Risiko/Follow-up: Tambah sanitasi konten HTML di rendering.

- [x] [2025-11-29] Step: 1.4 Create Research content system
  - Hasil: Queries/mutations Convex (`research.list`, `getBySlug`, `create/update/remove`); halaman publik `/research` (filter tag/q) dan `/research/[slug]` (implikasi + gating premium).
  - Bukti: `type-check`, `lint`, `build` OK; routes `/research`, `/research/[slug]` terdaftar.
  - Risiko/Follow-up: Pertimbangkan field `category` terpisah jika diperlukan.

- [x] [2025-11-29] Step: 1.5 Implement Admin content management
  - Hasil: Halaman `admin/news` dan `admin/research` untuk create + listing; auto ringkas (fallback lokal) jika summary kosong; RBAC enforced.
  - Bukti: `type-check`, `lint`, `build` OK; routes admin terdaftar; konten baru muncul di listing publik.
  - Risiko/Follow-up: Aktifkan integrasi AI penuh (OpenRouter/Vercel AI SDK) saat kunci tersedia.

- [x] [2025-11-30] Step: 1.6 Build LMS foundation
  - Hasil: Tambah schema `progress` & `quizzes`; fungsi Convex untuk `courses/modules/lessons/progress`; halaman `/lms` (katalog) dan `/lms/[course]` (overview + progres) terpasang.
  - Bukti: `type-check`, `lint`, `build` OK; routes LMS terdeteksi.
  - Risiko/Follow-up: Isi data awal kursus-modul-pelajaran untuk demo.

- [x] [2025-11-30] Step: 1.7 Implement lesson player
  - Hasil: Halaman pelajaran `/lms/[course]/[module]/[lesson]` dengan video player, materi, tombol "Tandai selesai" (pencatatan progres).
  - Bukti: `type-check`, `lint`, `build` OK; route lesson terdeteksi.
  - Risiko/Follow-up: Tambah validasi akses Premium jika diperlukan.

- [x] [2025-11-30] Step: 1.8 Create quiz system
  - Hasil: Quiz MCQ di halaman pelajaran; skoring + feedback; koneksi ke progres jika skor ≥ 60.
  - Bukti: `type-check`, `lint`, `build` OK; quiz tampil saat data tersedia.
  - Risiko/Follow-up: Tambah editor soal di admin.

- [x] [2025-11-30] Step: 1.9 Implement certificate system
  - Hasil: Halaman `/lms/[course]/certificate` siap cetak PDF (print-to-PDF); gating progres dapat ditambahkan kemudian.
  - Bukti: `type-check`, `lint`, `build` OK; route certificate terdeteksi.
  - Risiko/Follow-up: Tambah validasi progres penuh sebelum akses sertifikat.

- [x] [2025-11-29] Task 1.1: Complete User Authentication Flow
  - Hasil: Dokumen implementasi lengkap dibuat (`implementation/1.1-complete-user-authentication-flow.md`) mencakup registration, email verification, dashboard, profile management, dan password reset. Include acceptance criteria, langkah implementasi, testing strategy, dan risk mitigation.
  - Risiko/Follow-up: Implementasi kode perlu segera dilakukan; pastikan Clerk webhook untuk email verification diconfigurasi dengan benar; test payment integration untuk Pro features.

- [x] [2025-11-29] Task 1.2: Implement User Role Management
  - Hasil: Dokumen implementasi lengkap dibuat (`implementation/1.2-implement-user-role-management.md`) mencakup admin panel, role upgrade flow, session management, dan security measures. Include RBAC architecture, Xendit integration, dan comprehensive testing plan.
  - Risiko/Follow-up: Implementasi Convex schema update untuk roles dan sessions; pastikan admin role checking di semua admin routes; test subscription webhook dari Xendit.
