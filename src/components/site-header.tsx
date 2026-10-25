"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark, SearchIcon } from "@/components/icons";
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

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[var(--header-bg)] backdrop-blur-xl">
      <div className="container-shell flex h-[4.5rem] items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-sm text-ink"
          aria-label="অনুচ্ছেদ — হোম"
        >
          <BrandMark className="size-9 text-ink" />
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

        <div className="flex items-center gap-2">
          <Link
            href="/books#search"
            aria-label="বই খুঁজুন"
            className="flex size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:bg-surface hover:text-ink"
          >
            <SearchIcon className="size-[1.1rem]" />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
