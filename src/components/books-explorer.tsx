"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { BookCard } from "@/components/book-card";
import { ChevronDownIcon, SearchIcon } from "@/components/icons";
import type { Book, Category } from "@/lib/api";

type SortOption = "newest" | "title" | "quick";

interface BooksExplorerProps {
  initialBooks: Book[];
  initialCategories: Category[];
  initialCategory?: string;
  initialSearch?: string;
  initialSort?: SortOption;
  initialPage?: number;
}

function isCategory(value: string | undefined, categories: Category[]): value is string {
  return categories.some((category) => category.slug === value);
}

export function BooksExplorer({
  initialBooks,
  initialCategories,
  initialCategory,
  initialSearch,
  initialSort = "newest",
  initialPage = 1,
}: BooksExplorerProps) {
  const [query, setQuery] = useState(initialSearch ?? "");
  const [category, setCategory] = useState<string>(
    isCategory(initialCategory, initialCategories) ? initialCategory : "all",
  );
  const [sort, setSort] = useState<SortOption>(initialSort);
  const deferredQuery = useDeferredValue(query);

  const filteredBooks = useMemo(() => {
    const search = deferredQuery.trim().toLocaleLowerCase("bn-BD");
    const result = initialBooks.filter((book) => {
      const matchesCategory = category === "all" || book.category.slug === category;
      if (!matchesCategory) return false;
      if (!search) return true;

      const categoryName = book.category.name;
      const haystack = [
        book.title,
        book.author,
        book.summary,
        categoryName,
        ...book.tags,
      ]
        .join(" ")
        .toLocaleLowerCase("bn-BD");

      return haystack.includes(search);
    });

    return [...result].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title, "bn");
      if (sort === "quick") return a.read_time - b.read_time;
      return b.added_at.localeCompare(a.added_at);
    });
  }, [category, deferredQuery, sort, initialBooks, initialCategories]);

  const hasFilters = query.trim().length > 0 || category !== "all";

  function clearFilters() {
    setQuery("");
    setCategory("all");
    setSort("newest");
  }

  return (
    <div id="search" className="scroll-mt-24">
      <div className="grid gap-5 border-b border-line pb-7 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <label
            htmlFor="book-search"
            className="text-sm font-medium text-ink"
          >
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
            <label
              htmlFor="book-sort"
              className="text-sm font-medium text-ink"
            >
              সাজান
            </label>
            <div className="relative mt-2.5">
              <select
                id="book-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
                className="h-12 appearance-none rounded-full border border-line bg-surface pl-4 pr-10 text-sm text-ink outline-none transition-colors focus:border-gold-ink"
              >
                <option value="newest">নতুন আগে</option>
                <option value="title">শিরোনাম অনুযায়ী</option>
                <option value="quick">দ্রুত পড়া যায়</option>
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
          <span className="font-medium text-ink">{filteredBooks.length}টি</span>{" "}
          বই পাওয়া গেছে
        </p>
        {category !== "all" ? (
          <p className="text-sm text-faint">
            {initialCategories.find(c => c.slug === category)?.name} ·{" "}
            {initialCategories.find(c => c.slug === category)?.books_count}টি সারসংক্ষেপ
          </p>
        ) : null}
      </div>

      {filteredBooks.length > 0 ? (
        <div className="mt-7 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
          {filteredBooks.map((book) => (
            <BookCard key={book.slug} book={book} showSummary />
          ))}
        </div>
      ) : (
        <div className="mt-10 border border-dashed border-line-strong px-6 py-16 text-center">
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
  );
}
