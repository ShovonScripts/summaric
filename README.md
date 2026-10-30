# অনুচ্ছেদ (Anucched)
### বাংলা বইয়ের সারাংশ | Bengali Book Summaries

**Discover the ideas behind great books, in Bengali.**

অনুচ্ছেদ (Anucched) is a Bengali book-summary platform designed to make valuable knowledge, timeless ideas, and meaningful literature accessible to Bengali readers.

The platform combines an original dark-editorial design with a modern web architecture, providing a comfortable reading experience across desktop and mobile devices.

---

## Project Overview

| Property | Details |
|---|---|
| Project | অনুচ্ছেদ (Anucched) |
| Platform | Bengali Book Summary |
| Frontend | Next.js 16 |
| Backend | Laravel 12 REST API |
| Database | MariaDB / MySQL |
| Language | Bengali |
| Architecture | Full-stack Web Application |
| Status | Active Development |

## Core Features

### Reader Experience
- Homepage with featured books, latest additions, and categories.
- Book catalogue with search, filtering, and sorting.
- Detailed book summaries, key ideas, and memorable quotes.
- Personal library for saved books.
- Google OAuth and email/password authentication.
- Responsive design for mobile, tablet, and desktop.
- Persistent dark and light themes.

### Administration
- Admin dashboard with statistics.
- Book creation, editing, deletion, and management.
- Category management with CRUD operations.
- Server-driven search, filtering, and pagination.
- Protected admin routes and role-based authorization.

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| Next.js 16.4.3 | React framework |
| React 19.3 | UI library |
| TypeScript 5 | Type safety |
| Tailwind CSS 4 | Styling |
| Turbopack | Development bundler |
| ESLint 9 | Code quality |
| Noto Serif Bengali | Display typography |
| Noto Sans Bengali | Body typography |

### Backend

| Technology | Purpose |
|---|---|
| Laravel 12 | Backend API |
| PHP 8.2+ | Server-side development |
| MariaDB 10.4.32 | Development database |
| MySQL 8 | Production database target |
| Laravel Sanctum | Authentication |
| Session Cookies | Authenticated requests |

## Application Routes

| Route | Description |
|---|---|
| `/` | Homepage |
| `/books` | Book catalogue |
| `/books/[slug]` | Book details |
| `/about` | About the platform |
| `/signin` | User sign-in |
| `/signup` | User registration |
| `/library` | Personal book library |
| `/admin` | Admin dashboard |
| `/admin/books` | Book management |
| `/admin/books/new` | Create a book |
| `/admin/books/[id]/edit` | Edit a book |
| `/admin/categories` | Category management |
| `/404` | Custom not-found page |

## Design Philosophy

অনুচ্ছেদ follows a dark-editorial visual direction inspired by traditional reading spaces and modern digital publications.

**Design principles:**
- Original interface design without pre-built UI templates.
- Bengali-first typography and reading experience.
- Carefully balanced contrast and visual hierarchy.
- Minimal, distraction-free reading layouts.
- Responsive layouts for different screen sizes.
- Consistent design tokens across dark and light themes.

### Colour System

| Token | Dark Theme | Light Theme |
|---|---|---|
| Background | `#071a1f` | `#eef2ed` |
| Surface | `#0c252a` | `#f7faf7` |
| Primary Text | `#eef5f3` | `#082126` |
| Accent Gold | `#f5bc5c` | `#b87912` |
| Accent Green | `#3cc492` | `#157a5a` |

Theme preference is stored in localStorage using `anucched-theme`. An early theme initialization script prevents unwanted theme flashing during page loading.

## Project Structure

```text
anucched/
├── backend/                  # Laravel 12 API
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── routes/
│   └── .env.example
│
├── public/                   # Static assets
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── books/
│   │   ├── about/
│   │   ├── signin/
│   │   ├── signup/
│   │   ├── library/
│   │   └── admin/
│   ├── components/           # Reusable UI components
│   └── lib/                  # API clients and utilities
│
├── package.json
└── README.md