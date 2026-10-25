"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpenIcon,
  ChevronDownIcon,
  PlusIcon,
  SearchIcon,
} from "@/components/icons";
import {
  deleteAdminBook,
  getAdminBooks,
  isAdminError,
  type AdminBook,
  type AdminBooksResponse,
} from "@/lib/admin";
import { formatBengaliDate } from "@/lib/format";
import type { BookStatus } from "@/lib/api";

const STATUS_OPTIONS: { value: BookStatus | "all"; label: string }[] = [
  { value: "all", label: "সব অবস্থা" },
  { value: "published", label: "প্রকাশিত" },
  { value: "draft", label: "ড্রাফট" },
  { value: "review", label: "পর্যালোচনায়" },
];

const STATUS_META: Record<BookStatus, { label: string; className: string }> = {
  published: { label: "প্রকাশিত", className: "border-green/25 bg-green/10 text-green-ink" },
  draft: { label: "ড্রাফট", className: "border-gold/25 bg-gold/10 text-gold-ink" },
  review: { label: "পর্যালোচনায়", className: "border-line bg-surface-2 text-muted" },
};

export default function AdminBooksPage() {
  const [response, setResponse] = useState<AdminBooksResponse | null>(null);
  const [status, setStatus] = useState<BookStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    let ignore = false;

    getAdminBooks({
      status,
      search: debouncedSearch || undefined,
      page,
    })
      .then((data) => {
        if (ignore) return;
        setResponse(data);
        setError(null);
      })
      .catch((err) => {
        if (ignore) return;
        setError(isAdminError(err) ? err.message : "বইয়ের তালিকা লোড হয়নি।");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [status, debouncedSearch, page, reloadToken]);

  async function handleDelete(book: AdminBook) {
    if (!window.confirm(`"${book.title}" মুছে ফেলতে চান? এটি ফেরানো যাবে না।`)) {
      return;
    }

    setDeletingId(book.id);
    try {
      await deleteAdminBook(book.id);
      setLoading(true);
      setReloadToken((token) => token + 1);
    } catch (err) {
      setError(isAdminError(err) ? err.message : "বই মোছা যায়নি।");
    } finally {
      setDeletingId(null);
    }
  }

  const books = response?.data ?? [];
  const meta = response?.meta;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gold-ink">কনটেন্ট</p>
          <h1 className="mt-2 font-display text-[clamp(1.9rem,3.5vw,2.7rem)] font-semibold leading-tight text-ink">
            সারসংক্ষেপের তালিকা
          </h1>
          <p className="mt-2 text-sm text-muted">
            সব অবস্থার বই এখানে দেখা যায় এবং সম্পাদনা করা যায়।
          </p>
        </div>
        <Link href="/admin/books/new" className="btn-primary w-fit">
          <PlusIcon className="size-4" />
          নতুন সারসংক্ষেপ
        </Link>
      </section>

      <section className="border border-line bg-paper">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
                setLoading(true);
              }}
              placeholder="শিরোনাম, লেখক বা সারমর্ম..."
              aria-label="বই খুঁজুন"
              className="h-10 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-gold-ink"
            />
          </div>
          <div className="relative">
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as BookStatus | "all");
                setPage(1);
                setLoading(true);
              }}
              aria-label="অবস্থা অনুযায়ী ফিল্টার"
              className="h-10 appearance-none rounded-full border border-line bg-surface pl-4 pr-9 text-sm text-ink outline-none transition-colors focus:border-gold-ink"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          </div>
        </div>

        {error ? (
          <p role="alert" className="border-b border-line px-4 py-3 text-sm text-gold-ink">
            {error}
          </p>
        ) : null}

        {loading && !response ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-12 animate-pulse rounded bg-surface" />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <BookOpenIcon className="mx-auto size-8 text-faint" />
            <h2 className="mt-4 font-display text-xl font-semibold text-ink">
              কোনো বই পাওয়া যায়নি।
            </h2>
            <p className="mt-2 text-sm text-muted">
              ফিল্টার বদলান অথবা নতুন সারসংক্ষেপ যোগ করুন।
            </p>
            <Link href="/admin/books/new" className="btn-secondary mt-5">
              নতুন সারসংক্ষেপ
            </Link>
          </div>
        ) : (
          <div className={`overflow-x-auto transition-opacity ${loading ? "opacity-60" : ""}`}>
            <table className="w-full min-w-[46rem] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[0.68rem] text-faint">
                  <th className="px-4 py-3 font-normal sm:px-6">বই</th>
                  <th className="px-3 py-3 font-normal">বিভাগ</th>
                  <th className="px-3 py-3 font-normal">অবস্থা</th>
                  <th className="px-3 py-3 font-normal">যোগ হয়েছে</th>
                  <th className="px-4 py-3 text-right font-normal sm:px-6">কাজ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {books.map((book) => (
                  <tr key={book.id}>
                    <td className="px-4 py-3.5 sm:px-6">
                      <Link
                        href={`/admin/books/${book.id}/edit`}
                        className="block max-w-[16rem] truncate font-medium text-ink transition-colors hover:text-gold-ink"
                      >
                        {book.title}
                      </Link>
                      <p className="mt-0.5 text-[0.68rem] text-faint">
                        {book.author} · {book.read_time ?? 0} মিনিট
                      </p>
                    </td>
                    <td className="px-3 py-3.5 text-xs text-muted">
                      {book.category?.name ?? "—"}
                    </td>
                    <td className="px-3 py-3.5">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[0.65rem] ${STATUS_META[book.status].className}`}
                      >
                        {STATUS_META[book.status].label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-[0.68rem] text-faint">
                      {book.added_at ? formatBengaliDate(book.added_at) : "—"}
                    </td>
                    <td className="px-4 py-3.5 text-right sm:px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/books/${book.id}/edit`}
                          className="rounded-full border border-line px-3 py-1.5 text-[0.68rem] text-muted transition-colors hover:border-line-strong hover:text-ink"
                        >
                          সম্পাদনা
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(book)}
                          disabled={deletingId === book.id}
                          className="rounded-full border border-line px-3 py-1.5 text-[0.68rem] text-muted transition-colors hover:border-gold hover:text-gold-ink disabled:opacity-50"
                        >
                          {deletingId === book.id ? "মুছছে..." : "মুছুন"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta && meta.last_page > 1 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 sm:px-6">
            <p className="text-xs text-faint">
              {meta.total}টি বই · পৃষ্ঠা {meta.current_page} / {meta.last_page}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setPage((value) => Math.max(1, value - 1));
                  setLoading(true);
                }}
                disabled={meta.current_page <= 1 || loading}
                className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-line-strong hover:text-ink disabled:opacity-40"
              >
                আগের
              </button>
              <button
                type="button"
                onClick={() => {
                  setPage((value) => Math.min(meta.last_page, value + 1));
                  setLoading(true);
                }}
                disabled={meta.current_page >= meta.last_page || loading}
                className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-line-strong hover:text-ink disabled:opacity-40"
              >
                পরের
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
