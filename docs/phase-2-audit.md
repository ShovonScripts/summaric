# Phase 2 Audit — Environment & Database Findings

Date: 2026-10-25
Project: অনুচ্ছেদ (Anucched) — Bengali Book Summaries Frontend
Path: `C:\xampp\htdocs\ProDo\App\summaric`

---

## Node / Package Environment

| Item | Version |
|------|---------|
| Node.js | 24.14.0 |
| npm | 11.9.0 |
| Git | 2.53.0.windows.1 |
| Next.js | 16.4.3 |
| React | 19.3.0 |
| React DOM | 19.3.0 |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| ESLint | 9.x |
| eslint-config-next | 16.4.3 |

Disk free before scaffold: **5.75 GB**
Disk free after scaffold + build: **5.36 GB** (sufficient for dev, no clean-up needed)

---

## Database — MariaDB 10.4.32 (Local)

- **Server**: MariaDB 10.4.32 (Community Server)
- **Port**: 3306 (TCP/IP)
- **Root access**: Available (passwordless on localhost for this audit)
- **Status**: Running (`mysqld` process confirmed)
- **MySQL 8**: Not installed on this machine.

### Implications for Next Phase (Laravel 12 + MySQL 8)

| Concern | Detail | Mitigation |
|---------|--------|------------|
| **EOL** | MariaDB 10.4 reached EOL (June 2024). No security patches. | Provision MySQL 8.x for staging/production; do not rely on local MariaDB for production data. |
| **JSON** | MariaDB 10.4 supports JSON but lacks some MySQL 8 functions (`JSON_TABLE`, `->>` path returning text). | Use MySQL 8 JSON functions in Laravel migrations; avoid MariaDB-only syntax. |
| **Check Constraints** | Supported in 10.4 but less strict. | Write migrations targeting MySQL 8; test constraints on MySQL 8. |
| **Collation** | Default `utf8mb4_general_ci`; MySQL 8 prefers `utf8mb4_0900_ai_ci`. | Explicitly set `charset: utf8mb4, collation: utf8mb4_0900_ai_ci` in Laravel config. |
| **CTE / Window Functions** | Supported (since 10.2). | Safe to use; parity with MySQL 8. |
| **Authentication Plugin** | `mysql_native_password` default; MySQL 8 uses `caching_sha2_password`. | Ensure Laravel `.env` `DB_PASSWORD` works with chosen plugin; configure `mysql_native_password` if needed for local dev. |

**Recommendation**: Keep local MariaDB for quick iteration; provision a MySQL 8 Docker container or managed instance (Cloud SQL, RDS) for staging/CI. Document connection differences in Laravel `.env.example`.

---

## Next.js 16 Specifics (from bundled docs)

- `next.config.ts`: `cacheComponents: true`, `partialPrefetching: true`, Turbopack Tailwind loader (`@tailwindcss/turbopack`).
- Error boundaries: use `retry` prop (not `reset`).
- Root layout receives `LayoutProps<"/">` globally.
- `params` and `searchParams` are Promises (`await params`, `await searchParams`).
- `PageProps<"/route">` helper available after `next typegen`.
- Fonts: Noto Serif Bengali & Noto Sans Bengali supported in `next/font/google` with `weight: "variable"`, `subsets: ["bengali","latin"]`.

---

## Build & Verification Results

| Check | Command | Result |
|-------|---------|--------|
| Lint | `npm run lint` | ✅ Pass (0 errors) |
| TypeScript | `npx tsc --noEmit` | ✅ Pass (0 errors) |
| Production Build | `npm run build` | ✅ Pass (20 pages generated, 13 static, 7 partial-prerender) |
| Dev Server | `npm run dev` (port 3000) | ✅ Ready in ~2s |
| Production Server | `npm start` (port 3000) | ✅ Ready in 178 ms |

### Responsive Browser Tests (Playwright)

| Widths | Pages Tested | Horizontal Overflow | Console Errors |
|--------|--------------|---------------------|----------------|
| 360, 390, 640, 768, 1024, 1440 | `/`, `/books`, `/books/nishobder-bhasha`, `/about`, `/admin` | **0** | 1 expected 404 resource (from 404 page visit) |

Functional checks passed:
- Theme toggle (dark ↔ light) persists in `localStorage`, no flash.
- Search (`/books`) returns correct count.
- Category filter chips update results.
- Empty state shown for no matches.
- Category deep link (`/books?category=monobiggan`) works.
- Mobile nav visible at ≤768px, desktop nav hidden; inverse at >768px.
- 404 page renders with link back to home and catalogue.

---

## Screenshots (stored in `C:\Users\USER\AppData\Local\Temp\opencode\summaric-shots\`)

| File | Description |
|------|-------------|
| `home-1440.png` / `home-390.png` / `home-360.png` / `home-768.png` | Homepage at key breakpoints |
| `books-1440.png` / `books-390.png` / `books-640.png` / `books-1024.png` | Catalogue |
| `detail-1440.png` / `detail-390.png` | Book detail |
| `about-1440.png` / `about-360.png` | About |
| `admin-1440.png` / `admin-390.png` / `admin-360.png` | Admin preview |
| `home-light-390.png` | Light theme after toggle (settled) |

---

## Known Non-Issues

1. **Duplicate `<h1>` in DOM after navigation** — Next 16 router-cache (Activity boundary) keeps the previous route hidden with `display:none`. Zero client rects, excluded from accessibility tree and `innerText`. Not a visual/a11y/SEO issue.

2. **MariaDB version mismatch** — Documented above; no code changes required for this phase.

---

## Files Touched / Created (Phase 2)

```
src/app/globals.css                (design tokens, theme, utilities, component styles)
src/app/layout.tsx                 (fonts, theme script, metadata, viewport)
src/app/(public)/layout.tsx        (public shell: header, footer, mobile nav)
src/app/(public)/page.tsx          (homepage)
src/app/(public)/about/page.tsx    (about)
src/app/(public)/books/page.tsx    (catalogue with Suspense + BooksExplorer)
src/app/(public)/books/[slug]/page.tsx (book detail, generateStaticParams)
src/app/admin/layout.tsx           (admin shell)
src/app/admin/page.tsx             (admin dashboard)
src/app/not-found.tsx              (custom 404)
src/app/error.tsx                  (error boundary with retry)
src/components/icons.tsx           (inline SVG icons + BrandMark)
src/components/theme-toggle.tsx    (client theme button)
src/components/book-cover.tsx      (CSS-generated book cover with 6 motifs)
src/components/book-card.tsx       (link card for books)
src/components/section-heading.tsx (reusable section header)
src/components/books-explorer.tsx  (client search/filter/sort)
src/components/category-glyph.tsx  (motif glyphs for categories)
src/components/site-header.tsx     (desktop header, brand, nav, search, theme)
src/components/site-footer.tsx     (footer)
src/components/mobile-nav.tsx      (fixed bottom nav on mobile)
src/data/books.ts                  (14 books, 12 published)
src/data/categories.ts             (6 categories + helpers)
src/types/book.ts                  (Book, Category, CoverArt types)
src/lib/format.ts                  (Bengali date formatter)
```

---

## Next Phase Recommendations

1. **Backend**: Scaffold Laravel 12 API on MySQL 8 (Docker).
2. **Auth**: Sanctum + Google OAuth + email/password.
3. **Payments**: Manual bKash/Nagad verification flow (webhook or admin review).
4. **Admin**: Replace preview with real CRUD (Filament optional, but custom keeps bundle small).
5. **Search**: Move to server-side (Meilisearch or MySQL fulltext) for scale.
6. **Images**: Replace CSS covers with uploaded WebP/AVIF; use `next/image` optimization.
7. **CI/CD**: GitHub Actions → lint, typecheck, build, Playwright E2E.
8. **Secrets**: `.env` management (never commit).
9. **Monitoring**: Sentry + LogRocket or similar.

---

**Auditor**: opencode agent
**No secrets or credentials recorded in this document.**