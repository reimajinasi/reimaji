# Reimaji – Technical Specs (MVP)

Dokumen ini menjabarkan *bagaimana* sistem dibangun berdasarkan `reimaji-prd.md`. Ditujukan untuk agent AI coding dan developer manusia.

---

## 1. Arsitektur Sistem

- **Frontend**
  - Framework: `Next.js 16` (App Router).
  - UI: `shadcn/ui` + `Tailwind CSS`.
  - Deployment: `Vercel`.

- **Backend / Data**
  - `Convex` sebagai backend utama (data store + server functions).
  - Webhook Xendit dan Resend dapat di-handle lewat:
    - Route API Next.js (server actions) **atau**
    - Convex HTTP endpoint (pilih salah satu dan konsisten).

- **Auth**
  - `Clerk` untuk auth & session.
  - Next.js proxy untuk proteksi route (public vs protected vs admin).
  - Referensi: https://nextjs.org/docs/messages/middleware-to-proxy

### Rasional penggantian middleware → proxy
- “Middleware” membingungkan (sering dianggap sama dengan Express.js middleware).
- Next.js mendorong API yang lebih ergonomis, middleware dijadikan opsi terakhir.
- “Proxy” merefleksikan posisi di depan app dan Edge Runtime default.

- **Payment**
  - `Xendit` untuk subscription manual (invoice bulanan).
  - Webhook Xendit untuk update status subscription.

- **AI**
  - `Vercel AI SDK` untuk:
    - Admin summarize News/Research.
    - Penjelasan di halaman playground.

- **Email**
  - `Resend` untuk welcome email & konfirmasi pembayaran.

---

## 2. Struktur Folder (Draft)

Di root Next.js app:

- `app/`
  - `(public)/`
    - `page.tsx` – landing page.
    - `news/` – listing & detail news (bagian public + gated).
    - `research/` – listing & detail research (bagian public + gated).
  - `dashboard/`
    - `page.tsx` – dashboard user (news ringkas + progress LMS).
  - `lms/`
    - `page.tsx` – overview course.
    - `[moduleId]/[lessonId]/page.tsx` – detail lesson (video + quiz).
  - `playground/`
    - `page.tsx` – AI playground.
  - `admin/`
    - `news/` – CRUD news (basic).
    - `research/` – CRUD research (basic).
    - `courses/` – CRUD courses/module/lesson.
  - `api/` (bila perlu untuk:
    - `xendit/webhook/route.ts` – webhook payment.
    - `resend/test` (opsional).

- `components/`
  - UI components generik (cards, layout, navbar, footer, buttons).
  - `news/` – komponen khusus News (card, list).
  - `research/` – komponen khusus Research.
  - `lms/` – komponen khusus LMS (sidebar, progress bar, quiz, video player wrapper).

- `convex/`
  - `schema.ts` – definisi schema (tables / indexes).
  - `news.ts` – query & mutation news.
  - `research.ts`
  - `courses.ts` – course/module/lesson.
  - `progress.ts` – user progress.
  - `billing.ts` – subscription + transaksi.
  - `users.ts` – user profile (link ke Clerk).

- `lib/`
  - `auth.ts` – helper integrasi Clerk (get current user, role).
  - `xendit.ts` – helper panggilan API Xendit (create invoice, verify signature).
  - `resend.ts` – helper kirim email.
  - `ai.ts` – helper untuk Vercel AI SDK (summarize, explain).
  - `roles.ts` – enum/konstanta role & guard.

---

## 3. Role & Authorization Model

- **Role utama**
  - `guest` – tidak login.
  - `free` – user login tanpa subscription aktif.
  - `pro` – user dengan subscription aktif.
  - `admin` – internal, akses panel admin.

- **Penyimpanan role**
  - Sumber utama: tabel `users` di Convex.
  - Clerk hanya sebagai identity (user id, email, basic profile).
  - Mapping: `clerk_user_id` → user record di Convex.

- **Aturan akses (ringkas)**
  - `guest`
    - Lihat landing + subset News/Research.
  - `free`
    - Lihat konten Free + modul intro LMS.
  - `pro`
    - Lihat semua konten + LMS full + sertifikat.
  - `admin`
    - Akses semua + panel admin CRUD.

Auth check dilakukan:
- Di **Next.js** (middleware / server components) untuk routing dan UI.
- Di **Convex** (functions) untuk keamanan data (server-side).

---

## 4. Data Model (Convex – Draft)

Prinsip umum:
- Optimalkan untuk pola baca utama (landing, feed News/Research, LMS, dashboard user), bukan normalisasi maksimal.  
- Boleh ada sedikit denormalisasi (duplikasi field seperti `courseTitle` di module) untuk mengurangi kebutuhan “join” berantai.  
- Tambahkan index seperlunya (misal: `by_clerkUserId`, `by_publishedAt`, `by_userId_lessonId`).

### 4.1 Tabel `users`

- `id` (Convex document id)  
- `clerkUserId: string`  
- `email: string`  
- `role: "free" | "pro" | "admin"`  
- `createdAt: Date`

### 4.2 Tabel `news`

- `title: string`  
- `summary: string` (1 paragraf inti kabar)  
- `type: "tool" | "use_case" | "regulation"`  
- `tags: string[]`  
- `sourceUrl?: string`  
- `publishedAt: Date`  
- `isPremium: boolean` (true = hanya Pro / gated)  
- `createdBy: Id<"users">`

### 4.3 Tabel `research`

- `title: string`  
- `summary: string` (1 paragraf ringkasan paper)  
- `implication: string` (implikasi praktis singkat)  
- `tags: string[]`  
- `paperUrl?: string`  
- `publishedAt: Date`  
- `isPremium: boolean`  
- `createdBy: Id<"users">`

### 4.4 Tabel `courses`, `modules`, `lessons`

**courses**
- `title: string` (contoh: “Fundamental Generative AI untuk Non-Teknis”)  
- `slug: string`  
- `level: "basic" | "intermediate" | "advanced"`  
- `isActive: boolean`

**modules**
- `courseId: Id<"courses">`  
- `title: string`  
- `courseTitleCached?: string` (opsional, denormalisasi untuk tampilan)  
- `order: number`

**lessons**
- `moduleId: Id<"modules">`  
- `title: string`  
- `moduleTitleCached?: string` (opsional)  
- `slug: string`  
- `videoUrl: string`  
- `summary: string`  
- `order: number`  
- `isFreePreview: boolean` (true = bisa diakses user Free)

### 4.5 Tabel `quizzes` & `userProgress`

**quizzes**
- `lessonId: Id<"lessons">`  
- `question: string`  
- `options: string[]`  
- `correctIndex: number`

**userProgress**
- `userId: Id<"users">`  
- `lessonId: Id<"lessons">`  
- `completed: boolean`  
- `score?: number`  
- `completedAt?: Date`

### 4.6 Tabel `transactions`

- `userId: Id<"users">`  
- `xenditInvoiceId: string`  
- `amount: number`  
- `currency: string` (mis. `"IDR"`)  
- `status: "PENDING" | "PAID" | "EXPIRED" | "FAILED"`  
- `createdAt: Date`  
- `paidAt?: Date`  

Catatan: `transactions` bersifat log/append-only (tidak menghapus record).

### 4.7 Tabel `subscriptions`

- `userId: Id<"users">`  
- `status: "active" | "expired"`  
- `plan: "pro_monthly"` (untuk MVP, bisa diperluas)  
- `startedAt: Date`  
- `expiresAt: Date`  
- `createdAt: Date`

---

## 5. API & Integrasi Eksternal

### 5.1 Payment – Xendit

**Create Invoice (server-side helper – bukan public API):**

- Input:
  - `userId: Id<"users">`  
  - `amount: number`  
  - `description: string`
- Behavior:
  - Panggil API Xendit `POST /v2/invoices` dengan:
    - External ID = kombinasi `userId` + timestamp.  
  - Simpan record di `transactions` dengan status `PENDING`.  
  - Return URL invoice ke frontend.

**Webhook Xendit** (contoh via route Next.js `app/api/xendit/webhook/route.ts`):

- Menerima event status invoice (`PAID`, `EXPIRED`, dsb).  
- Verifikasi signature header dari Xendit.  
- Jika `PAID`:
  - Update `transactions.status = "PAID"` + `paidAt`.  
  - Buat atau perbarui record di `subscriptions`:
    - `status = "active"`, `startedAt = now`, `expiresAt = now + 30 hari` (untuk plan bulanan).  
  - Set `users.role = "pro"` (jika sebelumnya `free`).  
  - Trigger email konfirmasi via Resend.  
- Jika `EXPIRED`:
  - Update `transactions.status = "EXPIRED"`.  
  - Jika terkait subscription, set `subscriptions.status = "expired"` dan boleh menurunkan `users.role` ke `free` setelah masa aktif habis.

### 5.2 AI – Vercel AI SDK

**Endpoint internal Summarize** (admin only, mis. `convex/ai.ts` atau `app/api/admin/summarize`):

- Input:
  - `type: "news" | "research"`  
  - `rawText: string`
- Output:
  - `summary: string` (1 paragraf)  
  - `implication?: string` (untuk `research`)  
- Behavior:
  - Memanggil model LLM (via `Vercel AI SDK`) dengan prompt template yang konsisten.

**Playground Explain** (dipanggil dari halaman `playground`):

- Input:
  - `userPrompt: string`  
  - `modelResponse: string`
- Output:
  - Penjelasan risiko, bias potensial, dan tips verifikasi.

### 5.3 Email – Resend

- **Welcome Email**
  - Trigger: user baru terdaftar (setelah user record dibuat di Convex).  
  - Konten: sambutan + link ke LMS dasar.

- **Payment Success Email**
  - Trigger: webhook Xendit dengan status `PAID`.  
  - Konten: konfirmasi pembayaran + info masa aktif subscription + CTA ke LMS.

---

## 6. UI / UX High-Level

- **Landing Page**
  - Hero: masalah yang diselesaikan + CTA “Mulai Gratis”.  
  - Section: manfaat LMS, contoh konten News/Research, testimoni (dummy dulu).

- **News & Research Listing**
  - Layout kartu (X-style) dengan:
    - Tag/kategori.  
    - 1 paragraf ringkasan.  
    - Badge “Premium” jika isPremium.  
  - Filter sederhana (by kategori/tag).

- **LMS**
  - Sidebar module/lesson.  
  - Area utama: video player + summary + quiz di bawah.  
  - Indicator progress per modul.

- **Playground**
  - Kolom input prompt + output model.  
  - Panel kanan: tips prompt & risiko.

- **Admin**
  - CRUD form sederhana (table + modal/form) untuk News, Research, Course.

---

## 7. Konvensi & Catatan untuk Agent

- Bahasa antar muka: **Bahasa Indonesia** (minimal untuk copy utama).  
- Code style:
  - TypeScript di semua file Next.js & Convex.  
  - Komponen React function component dengan arrow function.  
- Naming:
  - Gunakan nama jelas (hindari satu huruf) untuk variabel dan fungsi.  
  - Konsisten dengan nama field di Convex schema.  
- Komponen & UI:
  - Desain komponen dan styling sebisa mungkin **reusable** (mis. card, layout section, tombol, form), bukan hard-coded untuk satu halaman saja.  
  - Ekstrak pola UI berulang menjadi komponen bersama di `components/` ketika digunakan di ≥2 tempat.
- Keamanan:
  - Jangan expose secret di client.  
  - Semua operasi yang menyentuh Xendit/Resend dilakukan server-side.  
  - Selalu cek role & auth di Convex functions yang sensitif.

### 7.1 Pola Development yang Diinginkan

- **1. Block by Block**  
  - Kembangkan fitur secara bertahap per “blok” kecil (mis. satu halaman, satu komponen besar, atau satu alur API), bukan sekaligus banyak area.  
  - Selesaikan blok sampai stabil (build OK, tidak ada error jelas) sebelum pindah ke blok berikutnya.

- **2. Skeleton → Layout → Component → UI → Content**  
  - Mulai dari skeleton: struktur folder, routes, dan file kosong.  
  - Lanjutkan ke layout: kerangka halaman (header, sidebar, content area) tanpa detail UI.  
  - Baru kemudian definisikan komponen fungsional (logic & props).  
  - Setelah itu, rapikan UI: gunakan shadcn/ui + Tailwind untuk styling.  
  - Terakhir, isi konten (copy, label, teks, placeholder) sesuai PRD.

- **3. Plan → Analyze → Penyempurnaan → Implementation → Review → Test**  
  - **Plan**: jelaskan singkat rencana langkah yang akan dikerjakan (di level blok).  
  - **Analyze**: baca PRD + SPECS yang relevan, pastikan tidak bertentangan.  
  - **Penyempurnaan**: jika butuh penyesuaian (mis. nama field, struktur data), sesuaikan plan sebelum implementasi.  
  - **Implementation**: tulis kode minimal yang benar dan konsisten dengan konvensi.  
  - **Review**: cek ulang struktur, naming, dan keterbacaan; pastikan tidak ada kode mati atau duplikasi tidak perlu.  
  - **Test**: jalankan build/lint/test yang relevan (atau minimal build dev) untuk memastikan tidak ada error runtime/kompilasi pada blok yang baru dibuat.
