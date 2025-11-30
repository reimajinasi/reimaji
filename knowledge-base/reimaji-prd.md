# Reimaji – PRD v0.1 (MVP)

## 1. Visi & Tujuan

- **Visi**  
  Platform bagi non-teknikal untuk memahami dan memanfaatkan Generative AI secara bijak, sambil tetap update terhadap perkembangan tools dan riset.

- **Tujuan MVP (6–12 bulan)**  
  - Menjadi “tempat belajar AI pertama” untuk pekerja non-teknis/solopreneur Indonesia.  
  - Mendapatkan ≥50 user berbayar pertama untuk langganan pelatihan.  
  - Membangun habit kunjungan ulang melalui konten News/Research yang ringkas.

## 2. Target User & Persona

- **Persona utama MVP**:  
  Knowledge worker non-teknis (marketing, HR, ops, owner UMKM), usia 25–40, literasi digital oke, belum paham teknis AI tapi ingin:
  - Pakai AI untuk produktivitas kerja.  
  - Menghindari kesalahan penggunaan (privasi, bias, halusinasi).

- **Kebutuhan utama**  
  - Bahasa sederhana, contoh praktis.  
  - Kurasi berita/rilis tool AI yang relevan dengan pekerjaan.  
  - Struktur belajar jelas: dari nol → bisa pakai AI dengan aman.

## 3. Lingkup Fitur MVP

### 3.1 News

- Feed kartu “inti kabar” 1 paragraf (gaya X) + tombol **More**.  
- Kategori utama:
  - `Tools/Produk`
  - `Use Case`
  - `Regulasi & Risiko`
- Highlight 1–3 “produk unggulan minggu ini”.  
- Sebagian konten bisa di-gate (butuh login / Pro).

### 3.2 Research

- Ringkasan 1 paragraf per paper/riset penting + 1–2 kalimat “implikasi praktis”.  
- Frekuensi: 3–5 kartu per minggu.  
- Tag/kategori untuk memudahkan filter (mis. `LLM`, `Multimodal`, `Regulasi`).

### 3.3 LMS (Fokus utama MVP)

- **Learning path awal**:  
  “Fundamental Generative AI untuk Non-Teknis”.

- **Level**  
  - Hanya `Dasar` untuk MVP.  
  - Level `Menengah` dan `Mahir` = post-MVP.

- **Struktur konten**  
  - ±4–6 modul video pendek (5–10 menit per modul).  
  - Setiap modul berisi:
    - Tujuan belajar.  
    - Ringkasan materi (teks singkat).  
    - 1–3 latihan praktis (prompt/template).

- **Fitur LMS MVP**  
  - Progress tracking per modul.  
  - Quiz sederhana (multiple-choice) per modul.  
  - Badge/sertifikat sederhana (PDF) setelah menyelesaikan path Dasar.

### 3.4 Playground

- Satu halaman playground dengan:
  - Beberapa preset prompt (mis. email profesional, ide konten, ringkasan dokumen).  
  - Penjelasan singkat *risiko & keterbatasan* AI di sisi kanan (educational).  
- Fokus edukasi cara prompt yang baik dan aman, bukan sekadar “chat AI generik”.

### 3.5 Monetisasi

- **Model subscription**  
  - **Free**:
    - Akses sebagian feed News & Research (mis. ~30–40% konten).  
    - Akses modul intro (1–2 video pertama).  
  - **Pro (berbayar, Xendit)**:
    - Akses full learning path Dasar.  
    - Akses penuh arsip News/Research.  
    - Sertifikat kelulusan.

- **MVP billing**  
  - Subscription bulanan sederhana.  
  - Perpanjangan bisa manual dulu (auto-renew = post-MVP).

### 3.6 Admin / Konten

- Panel admin (internal) minimal:
  - CRUD News (judul, ringkasan, kategori, link sumber, status publish).  
  - CRUD Research (judul, ringkasan, implikasi, link paper, tag).  
  - CRUD Course/Module/Video/Quiz.  
- Untuk MVP:
  - Data disimpan di Convex.  
  - Halaman admin protected (role `admin`).

## 4. User Flow Utama

### 4.1 Guest → Reader → Learner → Subscriber

1. **Guest**  
   - Mengunjungi landing page.  
   - Melihat sebagian feed News/Research (beberapa konten full, sebagian di-blur/teaser).  
   - Klik kartu → halaman detail (beberapa mengharuskan login).

2. **Register/Login (Clerk)**  
   - Registrasi via email/password atau Google.  
   - Setelah login: diarahkan ke dashboard (News + LMS overview).

3. **Free user**  
   - Akses modul intro di LMS.  
   - Akses konten News/Research terbatas.  
   - CTA jelas “Upgrade ke Pro” di halaman LMS & konten yang di-lock.

4. **Upgrade ke Pro (Xendit)**  
   - User klik “Upgrade” → halaman checkout.  
   - Backend membuat invoice Xendit.  
   - User membayar (VA / e-wallet).  
   - Xendit mengirim webhook → backend update `subscription_status = active` + role `pro`.

5. **Pro user**  
   - Akses semua modul & quiz.  
   - Akses semua konten News/Research.  
   - Setelah menyelesaikan path Dasar: dapat sertifikat (download).

## 5. Spesifikasi Fitur per Komponen

### 5.1 Auth – Clerk

- Email/password + Google login (minimal).  
- Session handling dan UI auth memakai komponen bawaan Clerk.  
- Role/metadata user:
  - `role`: `free`, `pro`, `admin`.  
  - `subscription_status`: `none`, `active`, `expired`.
- Protected routes:
  - Dashboard user.  
  - Halaman LMS (full akses untuk Pro).  
  - Panel admin (role `admin`).

### 5.2 Payment – Xendit

- Tipe: subscription manual (repeat payment bulanan).  
- Flow teknis:
  - API server-side membuat invoice Xendit.  
  - Redirect / tampilkan link pembayaran ke user.  
  - Webhook Xendit:
    - `PAID` → update `subscription_status = active`, set tanggal mulai & akhir.  
    - `EXPIRED` → tidak ada perubahan role (tetap free/none).  
- Riwayat transaksi disimpan di Convex untuk audit.

### 5.3 Backend – Convex

Data utama (draft skema high-level):

- `users`  
  - `id`, `clerk_user_id`, `email`  
  - `role` (`free`, `pro`, `admin`)  
  - `subscription_status` (`none`, `active`, `expired`)  
  - `subscription_expiry` (optional)

- `news`  
  - `id`, `title`, `summary`, `type` (tool/use-case/regulasi)  
  - `tags` (array)  
  - `source_url`, `published_at`, `is_premium`

- `research`  
  - `id`, `title`, `summary`, `implication`, `tags`  
  - `paper_url`, `published_at`, `is_premium`

- `courses` / `modules` / `lessons` / `quizzes`  
  - Struktur dasar untuk 1 learning path Dasar.  

- `user_progress`  
  - `user_id`, `lesson_id`, `status`, `score` (jika ada quiz).

- `transactions`  
  - `user_id`, `xendit_invoice_id`, `amount`, `status`, `created_at`.

### 5.4 AI – Vercel AISDK

- Use case utama MVP:
  - Membantu admin membuat draft ringkasan News/Research:
    - Input: teks berita/paper atau link (di-input manual).  
    - Output: ringkasan 1 paragraf + poin implikasi/risiko.  
  - Membantu menjelaskan output di Playground (penjelasan kenapa jawaban perlu diverifikasi).

- Endpoint internal:
  - `POST /api/admin/summarize` (protected admin) menggunakan AISDK.

### 5.5 Email – Resend

- Minimal MVP:
  - Welcome email setelah registrasi.  
  - Email konfirmasi setelah pembayaran sukses.  
- Post-MVP:
  - Weekly digest News/Research (khusus Pro).

## 6. Non-Functional & KPI

### 6.1 Non-Functional

- SEO-friendly untuk halaman publik (landing, beberapa konten News/Research).  
- Performance:
  - Time-to-first-byte rendah (Next.js 16 + deployment Vercel).  
  - Lazy load hanya komponen berat (video, AI playground).
- Keamanan:
  - Semua aksi admin dan update subscription hanya lewat server-side dan role-checked.  
  - Validasi webhook Xendit.

### 6.2 KPI Utama

- Registrasi:
  - Jumlah user terdaftar total.  
- Aktivasi:
  - % user yang menyelesaikan ≥1 modul.  
- Monetisasi:
  - Jumlah subscriber Pro aktif.  
- Retensi:
  - % user yang kembali ≥1x per minggu (trafik News/Research / LMS).

## 7. Out of Scope (MVP)

- Learning path level Menengah & Mahir (konten lengkap).  
- Auto-renew subscription dan integrasi pajak kompleks.  
- Community (forum, komentar, diskusi user).  
- Native mobile app (iOS/Android).

## 8. Tech Stack & Dokumentasi Resmi

- **Frontend – Next.js 16**  
  - Docs: https://nextjs.org/docs

- **Backend – Convex**  
  - Docs: https://docs.convex.dev/home

- **AI – Vercel AI SDK + AI Elements**  
  - Docs: https://ai-sdk.dev/docs/introduction

- **UI – shadcn/ui**  
  - Docs: https://ui.shadcn.com/docs

- **Styling – Tailwind CSS**  
  - Docs: https://tailwindcss.com/docs

- **Auth – Clerk**  
  - Docs: https://clerk.com/docs

- **Payment – Xendit**  
  - Docs: https://docs.xendit.co

- **Email – Resend**  
  - Docs: https://resend.com/docs/introduction

- **Deployment – Vercel**  
  - Docs: https://vercel.com/docs

