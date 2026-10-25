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
| `/admin` | Admin preview dashboard (no auth) |
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

## Admin Preview

- `/admin` uses a separate layout (no public header/footer).
- Dashboard with stats, recent books table, activity log, disabled quick actions.
- All data from mock `src/data/books.ts`; no backend, no auth.

## Notes

- No external UI/animation/state libraries; inline SVG icons only.
- No Laravel, Docker, MySQL, payment, or OAuth in this phase.
- MariaDB 10.4.32 is running locally (port 3306). Next phase should target MySQL 8 for production parity.
- No secrets committed. `.env` not used.