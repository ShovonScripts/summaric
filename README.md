অনুচ্ছেদ (Anucched)

বাংলা বইয়ের সারাংশ | Bengali Book Summaries

Discover the ideas behind great books, in Bengali.

অনুচ্ছেদ (Anucched) is a Bengali book-summary platform designed to make valuable knowledge, timeless ideas, and meaningful literature accessible to Bengali readers.

The platform combines an original dark-editorial design with a modern web architecture, providing a comfortable reading experience across desktop and mobile devices.

---

Project Overview

Property| Details
Project| অনুচ্ছেদ (Anucched)
Platform| Bengali Book Summary
Frontend| Next.js 16
Backend| Laravel 12 REST API
Database| MariaDB / MySQL
Language| Bengali
Architecture| Full-stack Web Application
Status| Active Development

Core Features

Reader Experience

- Homepage: Featured books, latest additions, categories, and discovery sections.
- Book Catalogue: Browse, search, filter, and sort books.
- Book Details: Read summaries, key ideas, memorable quotes, and related books.
- Personal Library: Save books to a personal reading collection.
- Authentication: Google OAuth and email/password authentication.
- Responsive Design: Optimized for mobile, tablet, and desktop.
- Theme System: Persistent dark and light themes.

Administration

- Admin dashboard with real-time statistics.
- Book creation, editing, deletion, and management.
- Category management with CRUD operations.
- Server-driven search, filtering, and pagination.
- Protected admin routes and role-based authorization.

Technology Stack

Frontend

Technology| Purpose
Next.js 16.4.3| React framework
React 19.3| UI library
TypeScript 5| Type safety
Tailwind CSS 4| Styling
Turbopack| Development bundler
ESLint 9| Code quality
Noto Serif Bengali| Display typography
Noto Sans Bengali| Body typography

Backend

Technology| Purpose
Laravel 12| Backend API
PHP 8.2+| Server-side development
MariaDB 10.4.32| Development database
MySQL 8| Production database target
Laravel Sanctum| Authentication
Session Cookies| Secure authenticated requests

Application Routes

Route| Description
"/"| Homepage
"/books"| Book catalogue
"/books/[slug]"| Book details
"/about"| About the platform
"/signin"| User sign-in
"/signup"| User registration
"/library"| Personal book library
"/admin"| Admin dashboard
"/admin/books"| Book management
"/admin/books/new"| Create a book
"/admin/books/[id]/edit"| Edit a book
"/admin/categories"| Category management
"/404"| Custom not-found page

Design Philosophy

অনুচ্ছেদ follows a dark-editorial visual direction inspired by the atmosphere of traditional reading spaces and modern digital publications.

Design principles:

- Original interface design without pre-built UI templates.
- Bengali-first typography and reading experience.
- Carefully balanced contrast and visual hierarchy.
- Minimal, distraction-free reading layouts.
- Responsive layouts for different screen sizes.
- Consistent design tokens across dark and light themes.

Colour System

Token| Dark Theme| Light Theme
Background| "#071a1f"| "#eef2ed"
Surface| "#0c252a"| "#f7faf7"
Primary Text| "#eef5f3"| "#082126"
Accent Gold| "#f5bc5c"| "#b87912"
Accent Green| "#3cc492"| "#157a5a"

Theme preference is stored in localStorage using "anucched-theme". An early theme initialization script prevents unwanted theme flashing during page loading.

Project Structure

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

The structure above is a high-level overview; individual files and folders may vary.

Getting Started

Prerequisites

Make sure you have installed:

- Node.js (compatible with Next.js 16)
- npm
- PHP 8.2 or later
- Composer
- MariaDB or MySQL

1. Clone the Repository

git clone YOUR_REPOSITORY_URL
cd anucched

2. Install Frontend Dependencies

npm install

3. Configure the Backend

cd backend
composer install
cp .env.example .env
php artisan key:generate

Configure your database credentials and application settings inside "backend/.env".

4. Run Database Migrations

php artisan migrate --seed

Configure the required admin credentials through environment variables before seeding.

5. Start the Laravel API

php artisan serve --host=localhost --port=8000

6. Start the Next.js Frontend

Open another terminal in the project root:

npm run dev

Open:

http://localhost:3000

Available Commands

npm run dev        # Start development server
npm run build      # Create production build
npm run start      # Start production server
npm run lint       # Run ESLint
npx tsc --noEmit   # Check TypeScript types

Development Roadmap

The following roadmap outlines potential development priorities.

- [x] Original frontend design
- [x] Dark and light theme system
- [x] Responsive layouts
- [x] Book catalogue and detail pages
- [x] Laravel API integration
- [x] Authentication integration
- [x] Admin dashboard
- [x] Book management
- [x] Category management
- [ ] Production deployment
- [ ] Real Bengali book content and editorial review
- [ ] Reading progress tracking
- [ ] SEO and structured metadata improvements
- [ ] Automated testing
- [ ] Performance and accessibility improvements

Roadmap items reflect development priorities and are not necessarily completed features.

Security

Security is an important consideration throughout development.

- Environment files and credentials must never be committed.
- Admin access is protected by authentication and role verification.
- Laravel Sanctum handles authenticated API requests.
- Credentialed CORS requests must use explicitly trusted origins.
- Production deployments should use HTTPS.
- Default development credentials must be replaced before deployment.

Important: Never use development admin credentials in production.

Responsive Testing

The interface has been tested at the following viewport widths:

"360px" · "390px" · "640px" · "768px" · "1024px" · "1440px"

No horizontal overflow was observed at the tested widths.

Contributing

Contributions, suggestions, and constructive feedback are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run lint and TypeScript checks.
5. Submit a pull request with a clear description.

Project Philosophy

অনুচ্ছেদ is built around a simple idea:

জ্ঞান সবার জন্য, ভাষা হোক মাতৃভাষা।

Knowledge should not be limited by language. Through Bengali book summaries, অনুচ্ছেদ aims to make important ideas easier to discover, understand, and apply.

---

অনুচ্ছেদ (Anucched)
Read less. Understand more. Think deeper.