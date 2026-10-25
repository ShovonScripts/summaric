# অনুচ্ছেদ (Anucched) — Bengali Book Summaries Frontend

A dark-editorial Next.js 16 frontend for a Bengali book-summary platform. Original design, no templates.

## Stack

- **Next.js** 16.4.3 (App Router, React 19.3, Turbopack)
- **TypeScript** 5 (strict)
- **Tailwind CSS** 4 (custom tokens, dark/light theme)
- **Fonts**: Noto Serif Bengali (display), Noto Sans Bengali (body) via `next/font/google`
- **ESLint** 9 (Next core-web-vitals + TS)

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage — featured book, latest, categories, CTA |
| `/books` | Catalogue — search, category chips, sort, responsive grid |
| `/books/[slug]` | Book detail — summary, key ideas, quote, related |
| `/about` | Mission, principles, roadmap |
| `/signin` | Sign in with Google OAuth + email/password |
| `/signup` | Register with Google OAuth + email/password |
| `/library` | Authenticated user library (saved books) |
| `/admin` | Admin dashboard (auth required, `is_admin` role) |
| `/admin/books` | Admin book list — filter, search, paginate, delete |
| `/admin/books/new` | Create new book |
| `/admin/books/[id]/edit` | Edit book |
| `/admin/categories` | Admin category CRUD |
| `/404` | Custom not-found |

## Commands

```bash
npm run dev       # dev server (Turbopack)
npm run build     # production build
npm run start     # production server (port 3000)
npm run lint      # ESLint
npx tsc --noEmit  # TypeScript check
```

## Design Tokens (CSS variables)

```css
:root {
  /* Dark (default) */
  --paper: #071a1f;
  --paper-deep: #041216;
  --surface: #0c252a;
  --surface-2: #103138;
  --ink: #eef5f3;
  --muted: #9ab2b0;
  --faint: #78918f;
  --line: rgba(238,245,243,0.13);
  --line-strong: rgba(238,245,243,0.26);
  --gold: #f5bc5c;
  --gold-ink: #f5bc5c;
  --green: #3cc492;
  --green-ink: #6ee0b8;
  --focus: #f5bc5c;
}
html[data-theme="light"] {
  /* Light */
  --paper: #eef2ed;
  --paper-deep: #e4ebe5;
  --surface: #f7faf7;
  --surface-2: #ffffff;
  --ink: #082126;
  --muted: #4e6a67;
  --faint: #6d8783;
  --line: rgba(8,33,38,0.14);
  --line-strong: rgba(8,33,38,0.3);
  --gold: #b87912;
  --gold-ink: #7c4f05;
  --green: #157a5a;
  --green-ink: #0d5c43;
  --focus: #7c4f05;
}
```

- Toggle persists in `localStorage` (`anucched-theme`).
- Theme script runs inline in `<head>` before paint to avoid flash.

## Responsive Breakpoints Tested

360, 390, 640, 768, 1024, 1440 px — no horizontal overflow at any width.

## Data

- 12 published fictional books with original Bengali titles, authors, summaries, key ideas, quotes.
- 6 categories with motif glyphs.
- Cover art: CSS-generated abstract book covers (5:8 aspect) using semantic color tokens.

## Admin (Phase 6)

- Requires Laravel API running on `http://localhost:8000` (MariaDB + Sanctum session cookies).
- Admin user: `admin@example.com` / `admin12345` (seeded via `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `backend/.env`).
- Role check: `is_admin` column + `EnsureUserIsAdmin` middleware (`admin` alias).
- CORS configured in `backend/config/cors.php` with `supports_credentials: true` for `localhost:3000`.
- Pages:
  - `/admin` — real dashboard stats + recent books.
  - `/admin/books` — server-driven list (status filter, debounced search, pagination, delete).
  - `/admin/books/new` — create book.
  - `/admin/books/[id]/edit` — edit book (server wrapper + client form).
  - `/admin/categories` — full CRUD (create, edit, delete blocked when books exist).
- Components: `AdminGuard`, `AdminNav`, `AdminAccount`, `BookForm`.
- Client API in `src/lib/admin.ts` (typed, credentialed fetch).

## Notes

- No external UI/animation/state libraries; inline SVG icons only.
- Laravel 12 API (MariaDB 10.4.32) powers auth, catalogue, and admin CRUD (see `backend/`).
- MariaDB 10.4.32 running locally (port 3306); production parity targets MySQL 8.
- No secrets committed. `.env` not used; `backend/.env.example` documents required vars.