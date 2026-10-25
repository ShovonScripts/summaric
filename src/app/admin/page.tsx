"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRightIcon,
  BookOpenIcon,
  EyeIcon,
  PlusIcon,
  SparkIcon,
  TagIcon,
} from "@/components/icons";
import { formatBengaliDate } from "@/lib/format";
import type { AdminBook, AdminDashboard } from "@/lib/admin";
import { getAdminDashboard, isAdminError } from "@/lib/admin";
import type { BookStatus } from "@/lib/api";

const STATUS_META: Record<
  BookStatus,
  { label: string; className: string; dot: string }
> = {
  published: {
    label: "প্রকাশিত",
    className: "border-green/25 bg-green/10 text-green-ink",
    dot: "bg-green",
  },
  draft: {
    label: "ড্রাফট",
    className: "border-gold/25 bg-gold/10 text-gold-ink",
    dot: "bg-gold",
  },
  review: {
    label: "পর্যালোচনায়",
    className: "border-line bg-surface-2 text-muted",
    dot: "bg-faint",
  },
};

function StatusBadge({ status }: { status: BookStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[0.65rem] ${meta.className}`}
    >
      <span className={`size-1.5 rounded-full ${meta.dot}`} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

function BookRow({ book }: { book: AdminBook }) {
  return (
    <tr>
      <td className="px-5 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          <span
            className="relative block h-12 w-9 shrink-0 overflow-hidden rounded-[2px] border border-white/10"
            style={{ backgroundColor: book.cover?.base ?? "#15343b" }}
            aria-hidden="true"
          >
            <span
              className="absolute inset-x-0 bottom-0 h-1"
              style={{ backgroundColor: book.cover?.accent ?? "#f5bc5c" }}
            />
          </span>
          <div className="min-w-0">
            <Link
              href={`/admin/books/${book.id}/edit`}
              className="block max-w-[12rem] truncate font-medium text-ink transition-colors hover:text-gold-ink"
            >
              {book.title}
            </Link>
            <p className="mt-0.5 text-[0.68rem] text-faint">
              {book.category?.name} · {book.read_time ?? 0} মিনিট
            </p>
          </div>
        </div>
      </td>
      <td className="px-3 py-3.5 text-xs text-muted">{book.author}</td>
      <td className="px-3 py-3.5">
        <StatusBadge status={book.status} />
      </td>
      <td className="whitespace-nowrap px-5 py-3.5 text-[0.68rem] text-faint sm:px-6">
        {book.added_at ? formatBengaliDate(book.added_at) : "—"}
      </td>
    </tr>
  );
}

export default function AdminPage() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getAdminDashboard()
      .then((dashboard) => {
        if (active) setData(dashboard);
      })
      .catch((err) => {
        if (active) {
          setError(isAdminError(err) ? err.message : "ড্যাশবোর্ড লোড হয়নি।");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl border border-line bg-paper p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">
          ড্যাশবোর্ড লোড করা যায়নি
        </h1>
        <p className="mt-3 text-sm text-muted">{error}</p>
        <p className="mt-2 text-xs text-faint">
          ব্যাকএন্ড চলছে এবং আপনি অ্যাডমিন হিসেবে লগইন করেছেন কি না দেখুন।
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-6xl space-y-6" aria-busy="true">
        <div className="h-10 w-64 animate-pulse rounded bg-surface" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse border border-line bg-paper" />
          ))}
        </div>
        <div className="h-64 animate-pulse border border-line bg-paper" />
      </div>
    );
  }

  const { stats, recent_books: recent } = data;

  const cards = [
    {
      label: "প্রকাশিত সারসংক্ষেপ",
      value: stats.published,
      hint: "পাঠকের জন্য দৃশ্যমান",
      icon: BookOpenIcon,
    },
    {
      label: "ড্রাফট",
      value: stats.draft,
      hint: "সম্পাদনার অপেক্ষায়",
      icon: SparkIcon,
    },
    {
      label: "পর্যালোচনায়",
      value: stats.review,
      hint: "শেষ দেখার বাকি",
      icon: EyeIcon,
    },
    {
      label: "সক্রিয় বিষয়",
      value: stats.categories,
      hint: "সংগ্রহে সাজানো",
      icon: TagIcon,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gold-ink">অ্যাডমিন ড্যাশবোর্ড</p>
          <h1 className="mt-2 font-display text-[clamp(2rem,4vw,3.1rem)] font-semibold leading-tight text-ink">
            আজ কী যোগ করবেন?
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            মোট {stats.total}টি সারসংক্ষেপ, যার {stats.featured}টি হোমপেজে
            ফিচার্ড। নতুন বই যোগ করুন, অবস্থা বদলান বা বিভাগ সাজান।
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/books/new" className="btn-primary">
            <PlusIcon className="size-4" />
            নতুন সারসংক্ষেপ
          </Link>
          <Link href="/books" className="btn-secondary">
            পাবলিক তালিকা
            <ArrowUpRightIcon className="size-4" />
          </Link>
        </div>
      </section>

      <section
        aria-label="সংক্ষিপ্ত পরিসংখ্যান"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="border border-line bg-paper p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs leading-5 text-muted">{card.label}</p>
                <Icon className="size-4 shrink-0 text-gold-ink" />
              </div>
              <p className="mt-4 font-display text-4xl font-semibold leading-none text-ink">
                {card.value}
              </p>
              <p className="mt-3 text-[0.7rem] text-faint">{card.hint}</p>
            </div>
          );
        })}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <section className="min-w-0 border border-line bg-paper">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">
                সাম্প্রতিক সম্পাদনা
              </h2>
              <p className="mt-1 text-xs text-faint">
                সর্বশেষ হালনাগাদ হওয়া সারসংক্ষেপ
              </p>
            </div>
            <Link
              href="/admin/books"
              className="text-xs text-muted transition-colors hover:text-gold-ink"
            >
              সব দেখুন
            </Link>
          </div>

          {recent.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[39rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-[0.68rem] text-faint">
                    <th className="px-5 py-3 font-normal sm:px-6">বই</th>
                    <th className="px-3 py-3 font-normal">লেখক</th>
                    <th className="px-3 py-3 font-normal">অবস্থা</th>
                    <th className="px-5 py-3 font-normal sm:px-6">যোগ হয়েছে</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {recent.map((book) => (
                    <BookRow key={book.id} book={book} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-6 py-10 text-sm text-muted">
              এখনো কোনো বই নেই। প্রথম সারসংক্ষেপ যোগ করুন।
            </p>
          )}
        </section>

        <div className="space-y-6">
          <section className="border border-line bg-paper p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-ink">
              দ্রুত কাজ
            </h2>
            <p className="mt-1 text-xs text-faint">সরাসরি সম্পাদনায় যান</p>
            <div className="mt-4 space-y-2">
              <Link
                href="/admin/books/new"
                className="flex w-full items-center gap-3 rounded-lg border border-line px-3 py-2.5 text-left text-xs text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                <PlusIcon className="size-4 shrink-0" />
                নতুন বই যোগ করুন
              </Link>
              <Link
                href="/admin/books"
                className="flex w-full items-center gap-3 rounded-lg border border-line px-3 py-2.5 text-left text-xs text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                <BookOpenIcon className="size-4 shrink-0" />
                বইয়ের তালিকা দেখুন
              </Link>
              <Link
                href="/admin/categories"
                className="flex w-full items-center gap-3 rounded-lg border border-line px-3 py-2.5 text-left text-xs text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                <TagIcon className="size-4 shrink-0" />
                বিভাগ সাজান
              </Link>
            </div>
          </section>

          <section className="border border-line bg-paper p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-ink">
              প্রকাশনার অবস্থা
            </h2>
            <ul className="mt-4 space-y-3 text-xs">
              {(
                [
                  ["published", stats.published],
                  ["draft", stats.draft],
                  ["review", stats.review],
                ] as [BookStatus, number][]
              ).map(([status, count]) => (
                <li
                  key={status}
                  className="flex items-center justify-between gap-3 border-b border-line pb-3 last:border-b-0 last:pb-0"
                >
                  <StatusBadge status={status} />
                  <span className="font-display text-lg text-ink">{count}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
