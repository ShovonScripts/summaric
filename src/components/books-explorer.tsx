"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { BookCard } from "@/components/book-card";
import { ChevronDownIcon, SearchIcon } from "@/components/icons";
import type { Book, BookSort, BooksResponse, Category } from "@/lib/api";

const SORT_OPTIONS: { value: BookSort; label: string }[] = [
  { value: "newest", label: "নতুন আগে" },
  { value: "title", label: "শিরোনাম অনুযায়ী" },
  { value: "read_time", label: "দ্রুত পড়া যায়" },
];

interface BooksExplorerProps {
  initialBooks: Book[];
  initialMeta: BooksResponse["meta"];
  initialCategories: Category[];
  initialCategory?: string;
  initialSearch?: string;
  initialSort?: BookSort;
}

function isCategory(value: string | undefined, categories: Category[]): value is string {
  return categories.some((category) => category.slug === value);
}

function buildHref({
  search,
  category,
  sort,
  page,
}: {
  search: string;
  category: string;
  sort: BookSort;
  page: number;
}): string {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category !== "all") params.set("category", category);
  if (sort !== "newest") params.set("sort", sort);
  if (page > 1) params.set("page", page.toString());

  const query = params.toString();
  return `/books${query ? `?${query}` : ""}`;
}

export function BooksExplorer({
  initialBooks,
  initialMeta,
  initialCategories,
  initialCategory,
  initialSearch,
  initialSort = "newest",
}: BooksExplorerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialSearch ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(initialSearch ?? "");
  const [category, setCategory] = useState<string>(
    isCategory(initialCategory, initialCategories) ? initialCategory : "all",
  );
  const [sort, setSort] = useState<BookSort>(initialSort);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const href = buildHref({ search: debouncedQuery, category, sort, page: 1 });
    const current = `${window.location.pathname}${window.location.search}`;
    if (href === current) return;

    startTransition(() => router.replace(href, { scroll: false }));
  }, [debouncedQuery, category, sort, router]);

  const hasFilters =
    debouncedQuery.length > 0 || category !== "all" || sort !== "newest";

  function clearFilters() {
    setQuery("");
    setDebouncedQuery("");
    setCategory("all");
    setSort("newest");
  }

  const activeCategory = initialCategories.find((item) => item.slug === category);
  const pageHref = (page: number) =>
    buildHref({ search: debouncedQuery, category, sort, page });

  return (
    <div id="search" className="scroll-mt-24">
      <div className="grid gap-5 border-b border-line pb-7 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <label htmlFor="book-search" className="text-sm font-medium text-ink">
            বই খুঁজুন
          </label>
          <div className="relative mt-2.5 max-w-xl">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-[1.1rem] -translate-y-1/2 text-faint" />
            <input
              id="book-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="বই, লেখক বা বিষয়..."
              className="h-12 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-gold-ink"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="book-sort" className="text-sm font-medium text-ink">
              সাজান
            </label>
            <div className="relative mt-2.5">
              <select
                id="book-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as BookSort)}
                className="h-12 appearance-none rounded-full border border-line bg-surface pl-4 pr-10 text-sm text-ink outline-none transition-colors focus:border-gold-ink"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
            </div>
          </div>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="h-12 rounded-full border border-line px-4 text-sm text-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              ফিল্টার মুছুন
            </button>
          ) : null}
        </div>
      </div>

      <div
        className="mt-6 flex gap-2 overflow-x-auto pb-1 no-scrollbar"
        role="group"
        aria-label="বিষয় অনুযায়ী ফিল্টার"
      >
        <button
          type="button"
          aria-pressed={category === "all"}
          onClick={() => setCategory("all")}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
            category === "all"
              ? "border-gold bg-gold font-medium text-[#071a1f]"
              : "border-line text-muted hover:border-line-strong hover:text-ink"
          }`}
        >
          সব বই
        </button>
        {initialCategories.map((item) => (
          <button
            key={item.slug}
            type="button"
            aria-pressed={category === item.slug}
            onClick={() => setCategory(item.slug)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
              category === item.slug
                ? "border-gold bg-gold font-medium text-[#071a1f]"
                : "border-line text-muted hover:border-line-strong hover:text-ink"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div
        className="mt-9 flex flex-wrap items-center justify-between gap-3"
        aria-live="polite"
      >
        <p className="text-sm text-muted">
          <span className="font-medium text-ink">{initialMeta.total}টি</span>{" "}
          বই পাওয়া গেছে
        </p>
        {activeCategory ? (
          <p className="text-sm text-faint">
            {activeCategory.name} · {activeCategory.books_count ?? 0}টি সারসংক্ষেপ
          </p>
        ) : null}
      </div>

      <div
        className={`mt-7 transition-opacity duration-200 ${
          isPending ? "opacity-50" : "opacity-100"
        }`}
        aria-busy={isPending}
      >
        {initialBooks.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
            {initialBooks.map((book) => (
              <BookCard key={book.slug} book={book} showSummary />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-line-strong px-6 py-16 text-center">
            <h2 className="font-display text-2xl font-semibold text-ink">
              কোনো বই মেলেনি।
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted">
              অন্য শব্দে খুঁজুন, অথবা বিষয়ের ফিল্টারটি সরিয়ে আবার চেষ্টা করুন।
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="btn-secondary mt-6"
            >
              সব বই দেখুন
            </button>
          </div>
        )}
      </div>

      {initialMeta.last_page > 1 ? (
        <nav
          aria-label="পৃষ্ঠা পরিবর্তন"
          className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6"
        >
          {initialMeta.current_page > 1 ? (
            <Link href={pageHref(initialMeta.current_page - 1)} className="btn-secondary">
              আগের পৃষ্ঠা
            </Link>
          ) : (
            <span className="btn-secondary pointer-events-none opacity-40" aria-hidden="true">
              আগের পৃষ্ঠা
            </span>
          )}
          <p className="text-sm text-muted">
            পৃষ্ঠা {initialMeta.current_page} / {initialMeta.last_page}
          </p>
          {initialMeta.current_page < initialMeta.last_page ? (
            <Link href={pageHref(initialMeta.current_page + 1)} className="btn-secondary">
              পরের পৃষ্ঠা
            </Link>
          ) : (
            <span className="btn-secondary pointer-events-none opacity-40" aria-hidden="true">
              পরের পৃষ্ঠা
            </span>
          )}
        </nav>
      ) : null}
    </div>
  );
}
