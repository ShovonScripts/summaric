"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { BrandMark, SearchIcon, UserIcon, LogoutIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { href: "/", label: "হোম" },
  { href: "/books", label: "বই" },
  { href: "/#topics", label: "বিষয়" },
  { href: "/about", label: "আমাদের কথা" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href.includes("#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[var(--header-bg)] backdrop-blur-xl">
      <div className="container-shell flex h-[4.5rem] items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-sm text-ink"
          aria-label="অনুচ্ছেদ — হোম"
        >
          <svg
            viewBox="0 0 40 40"
            className="size-9 text-ink"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <rect
              x="3.25"
              y="3.25"
              width="33.5"
              height="33.5"
              rx="9"
              stroke="currentColor"
              strokeOpacity="0.32"
              strokeWidth="1.5"
            />
            <path
              d="M13 11.5v17M13 11.5c6.6 0 10 2.5 10 6.6 0 4-3.4 6.4-10 6.4"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <circle cx="27.5" cy="25.5" r="2.3" fill="var(--gold)" />
          </svg>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[1.3rem] font-semibold tracking-tight">
              অনুচ্ছেদ
            </span>
            <span className="mt-1 hidden text-[0.62rem] leading-none text-faint sm:block">
              বইয়ের সারসংক্ষেপ
            </span>
          </span>
        </Link>

        <nav
          aria-label="প্রধান মেনু"
          className="hidden items-center gap-7 md:flex"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-2 text-sm transition-colors ${
                  active
                    ? "font-medium text-ink after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:bg-gold"
                    : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/books#search"
            aria-label="বই খুঁজুন"
            className="flex size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:bg-surface hover:text-ink"
          >
            <svg
              className="size-[1.1rem]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
              <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.7" />
            </svg>
          </Link>

          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-2 ml-2">
              <Link
                href="/library"
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-ink transition-colors rounded-lg"
                aria-label="লাইব্রেরি"
              >
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.7}
                    d="M3.5 5.5c3.2-.8 5.7-.2 8.5 1.7 2.8-1.9 5.3-2.5 8.5-1.7v13c-3.2-.8-5.7-.2-8.5 1.7-2.8-1.9-5.3-2.5-8.5-1.7z"
                  />
                  <path d="M12 7.2v13" stroke="currentColor" strokeWidth="1.7" />
                </svg>
                <span className="hidden sm:inline">লাইব্রেরি</span>
              </Link>

              <div className="relative">
                <button
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-surface transition-colors"
                >
                  <svg
                    className="size-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                  <span className="hidden sm:inline text-sm font-medium text-ink max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <svg
                    className="size-4 text-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="m6 9 6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div
                  id="user-dropdown"
                  className="absolute right-0 mt-2 w-48 bg-surface border border-line rounded-lg shadow-lg py-2 hidden"
                  role="menu"
                >
                  <Link
                    href="/library"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-ink hover:bg-surface"
                    role="menuitem"
                  >
                    <svg
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.7}
                        d="M3.5 5.5c3.2-.8 5.7-.2 8.5 1.7 2.8-1.9 5.3-2.5 8.5-1.7v13c-3.2-.8-5.7-.2-8.5 1.7-2.8-1.9-5.3-2.5-8.5-1.7z"
                      />
                      <path d="M12 7.2v13" stroke="currentColor" strokeWidth="1.7" />
                    </svg>
                    লাইব্রেরি
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-ink hover:bg-surface"
                    role="menuitem"
                  >
                    <svg
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.7" />
                    </svg>
                    প্রোফাইল
                  </Link>
                  <hr className="my-1 border-line" />
                  <button
                    onClick={async () => {
                      await logout();
                      window.location.href = "/";
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gold hover:bg-surface"
                    role="menuitem"
                  >
                    <svg
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.7" />
                      <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.7" />
                    </svg>
                    লগআউট
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/signin"
                className="px-4 py-2 text-sm font-medium text-ink hover:text-gold transition-colors"
              >
                লগইন
              </Link>
              <Link
                href="/signup"
                className="btn-primary"
              >
                নিবন্ধন
              </Link>
            </div>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
