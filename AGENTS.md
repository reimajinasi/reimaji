# Repository Guidelines

## Project Structure & Module Organization
- Application code lives under `app/`, `components/`, `convex/`, and `lib/` as described in `README-DEVELOPMENT.md: Project Structure`.
- Shared documentation is in `docs/` and `knowledge-base/`; platform-wide standards live in `agent-os/standards/`.
- Use feature-oriented organization: group routes, components, Convex functions, and hooks by domain (e.g., news, courses, playground).

## Build, Test, and Development Commands
- First-time setup (recommended): `chmod +x scripts/setup-dev.sh && ./scripts/setup-dev.sh`.
- Local development: `npm run dev` (Next.js frontend) and `npx convex dev` (Convex backend).
- Production checks: `npm run lint`, `npm run type-check`, `npm run test`, then `npm run build`.
- Additional testing: `npm run test:watch`, `npm run test:coverage`, `npm run test:e2e`.

## Coding Style & Naming Conventions
- Follow `agent-os/standards/global/coding-style.md` plus frontend/backend standards.
- Use TypeScript with 2-space indentation; keep functions small and descriptive.
- Components: `PascalCase` file and export names; hooks: `useXyz`; route files: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`.
- Run `npm run lint` before opening a PR; rely on editor format-on-save where possible.

## Testing Guidelines
- Use Jest + Testing Library for unit/component tests and Playwright for E2E, as documented in `README-DEVELOPMENT.md`.
- Name tests descriptively; prefer `*.test.ts` / `*.test.tsx` colocated with the code under test.
- Follow `agent-os/standards/testing/test-writing.md`: prioritize core user flows over exhaustive edge cases.
- Aim for ≥80% coverage on critical modules and ensure `npm run test` passes before merging.

## Commit & Pull Request Guidelines
- Use Conventional Commits (e.g., `feat: add news card`, `fix: handle empty course list`, `docs: update deployment guide`).
- Create focused branches from `main` (e.g., `feature/news-filters`, `fix/convex-schema-mismatch`).
- PRs must include: a clear summary, linked spec or task (`agent-os/specs/...`), screenshots for UI changes, and notes on testing performed.
- CI must be green (`lint`, `type-check`, `test`, relevant E2E jobs) before requesting review.

## Security & Configuration
- Never commit secrets; use `.env.local` and keep `.env.example` updated with non-sensitive placeholders.
- When adding new environment variables, document them in `README-DEVELOPMENT.md` or `docs/development/` and reference how they are used in code.

## Catatan Next.js 16: proxy.ts
- Di Next.js 16, `middleware.ts` diganti menjadi `proxy.ts` untuk proteksi rute global.
- Implementasi ada di `src/proxy.ts` dan memakai `clerkMiddleware`.
- `config.matcher` dipakai untuk menentukan rute publik vs terproteksi.
- Simpan logika ringan di `proxy.ts` (auth/redirect); pindahkan proses berat ke server actions/API.
- Referensi: https://nextjs.org/docs/messages/middleware-to-proxy

### Rasional penggantian middleware → proxy
- Istilah “middleware” sering ketuker dengan Express.js dan bikin salah kaprah.
- Next.js dorong pakai API yang lebih ergonomis; “middleware” jadi last resort.
- Nama “proxy” menegaskan boundary jaringan di depan app, default di Edge Runtime.
- Fitur yang overloaded dipecah; tujuan jadi lebih jelas.

## Credentials (Local Development Only)
For convenience in local development, predefined accounts exist for different roles. Do **not** change these in committed code; manage real credentials via the auth provider dashboard and environment variables.

## Credentials
### Superadmin
 **Email**: erik.supit@gmail.com
    - **Password**: Reim4ji2025
    - **First Name**: Erik
    - **Last Name**: Supit
    - **Role**: superadmin
    - **User ID**:

### Admin
The following credentials are configured for the application:

    - **Email**: reimajinasi@gmail.com
    - **Password**: Reim4ji2025
    - **First Name**: Jett
    - **Last Name**: Juara
    - **Role**: admin
    - **User ID**:

### User
The following credentials are configured for the application:

    - **Email**: tokayakuwi@gmail.com
    - **Password**: Reim4ji2025
    - **First Name**: Kaya
    - **Last Name**: Kuwi
    - **Role**: user
    - **User ID*

### Pro
The following credentials are configured for the application:

    - **Email**: 1200pixels@gmail.com
    - **Password**: Reim4ji2025
    - **First Name**: Seribu
    - **Last Name**: Duaratus
    - **Role**: pro
    - **User ID**

> **SECURITY WARNING**: Never commit real emails, passwords, or API keys to this repository. Store production and staging credentials only in approved secret managers or environment configuration, not in version control.
