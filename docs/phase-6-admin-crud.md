# Phase 6 — Admin CRUD & Roles (2026-10-25)

## Objective
Build admin middleware, write APIs, and wire `/admin` to real backend data so admins can manage books & categories.

---

## Backend

### Migrations & Model
- `2026_10_25_120000_add_is_admin_to_users_table.php` – boolean `is_admin` on users.
- `User` fillable/cast `is_admin`; auth payloads (`/login`, `/register`, `/user`) expose `is_admin`.

### Middleware
- `EnsureUserIsAdmin` – 403 for non-admin; alias `admin` in `bootstrap/app.php`.
- Route group `auth:sanctum,admin` under `/api/admin`.

### Resources & Requests
- `AdminBookResource`, `AdminCategoryResource` – full attribute payloads incl. nested category/cover.
- `Admin\BookRequest` – validation: slug regex, `key_ideas` array, `cover.*` (base/accent/ink/motif), status enum.
- `Admin\CategoryRequest` – slug unique, name, blurb, motif enum.

### Controllers
- `Admin\DashboardController@stats` → `/api/admin/stats` (counts + recent books).
- `Admin\BookController` – index (filter status/search/pagination), store, show, update, destroy.
- `Admin\CategoryController` – index, store, update, destroy (blocked if `books_count > 0`).

### Seeding & Factory
- `UserFactory::admin()` state.
- `DatabaseSeeder` creates admin when `ADMIN_EMAIL` + `ADMIN_PASSWORD` present in `.env`.

### CORS
- `config/cors.php` – `supports_credentials: true`, `allowed_origins` from `CORS_ALLOWED_ORIGINS` (default `FRONTEND_URL`).
- Fixes credentialed requests from `localhost:3000` (was `*` before).

---

## Frontend

### lib/admin.ts
Client API wrapper (`getAdminBooks`, `createAdminBook`, `updateAdminBook`, `deleteAdminBook`, `getAdminCategories`, …) + TS types (`AdminBook`, `AdminCategory`, `AdminStats`, `AdminBookPayload`, `AdminCategoryPayload`).

### Components
- `AdminGuard` – redirects guests to `/signin?next=…`, 403 for non-admin.
- `AdminNav` – active link highlighting.
- `AdminAccount` – shows admin name + logout.
- `BookForm` – create/edit modal (title, author, slug, category, year, pages, read_time, summary, key_ideas, quote, cover color picker, added_at, featured, status, tags). Uses `getAdminCategories` for select.

### Pages (App Router)
- `admin/layout.tsx` – shell + `AdminGuard` wrapped in `<Suspense>` to satisfy Instant Navigation validation (`usePathname` in guard/nav).
- `admin/page.tsx` – client component, fetches `getAdminDashboard()`, renders stats cards + recent books table.
- `admin/books/page.tsx` – server-driven list with status filter, search debounce, pagination, delete confirmation; inline loading on interactions.
- `admin/books/new/page.tsx` – server component rendering `<BookForm />`.
- `admin/books/[id]/edit/page.tsx` – **server wrapper** (`params: Promise<{id}>`) → client `EditBookForm` with `id` prop (avoids `useParams` in client during prerender).
- `admin/categories/page.tsx` – full CRUD UI: list (name, slug, motif, books_count), side panel form (create/edit), delete disabled when `books_count > 0`, uses `refreshToken` pattern to reload without sync `setState` in effect (ESLint `react-hooks/set-state-in-effect` compliant).

### Lint / TypeScript
- Zero ESLint errors (`npm run lint`).
- `npx tsc --noEmit` clean.

### Build
- `next build` → 27 pages (7 Partial Prerender, rest Static).
- No prerender errors.

---

## Runtime Verification
- Laravel API on `http://localhost:8000`, Next on `http://localhost:3000`.
- Login `admin@example.com` / `admin12345` → session cookie (SameSite=Lax, domain `localhost`).
- Credentialed `fetch` to API works: CORS `Access-Control-Allow-Origin: http://localhost:3000`, `Access-Control-Allow-Credentials: true`.
- Admin endpoints verified via cookie jar:
  - `GET /api/admin/stats` → 200.
  - `POST /api/admin/categories` → 201.
  - `POST /api/admin/books` → 201.
  - `DELETE /api/admin/books/:id` → 200.
  - `DELETE /api/admin/categories/:slug` → 200.
- All `/admin/*` pages return HTTP 200.

---

## Follow-ups
- [ ] CSRF hardening: add `ValidateCsrfToken` to API middleware + send `X-XSRF-TOKEN` from frontend.
- [ ] Admin UI: category edit/delete confirmation toasts, book cover preview.
- [ ] Pagination cursor-based for large sets.
- [ ] Soft delete / archive for books.
- [ ] Activity log / audit trail.