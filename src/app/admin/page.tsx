import Link from "next/link";
import {
  ArrowUpRightIcon,
  BookOpenIcon,
  EyeIcon,
  PlusIcon,
  SparkIcon,
  TagIcon,
} from "@/components/icons";
import { BOOKS } from "@/data/books";
import { CATEGORIES } from "@/data/categories";
import { formatBengaliDate } from "@/lib/format";
import type { BookStatus } from "@/types/book";

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

const ACTIVITY = [
  {
    title: "নতুন ড্রাফট সংরক্ষিত",
    detail: "ভুলে যাওয়ার শিল্প",
    time: "আজ, ১০:৪০",
    color: "bg-gold",
  },
  {
    title: "সারসংক্ষেপ প্রকাশিত",
    detail: "থাকার শিল্প",
    time: "গতকাল, ১৮:১৫",
    color: "bg-green",
  },
  {
    title: "পর্যালোচনায় পাঠানো হয়েছে",
    detail: "নগরের নিঃশ্বাস",
    time: "২ দিন আগে",
    color: "bg-faint",
  },
];

export default function AdminPage() {
  const published = BOOKS.filter((book) => book.status === "published");
  const drafts = BOOKS.filter((book) => book.status === "draft");
  const review = BOOKS.filter((book) => book.status === "review");
  const recent = [...BOOKS]
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .slice(0, 6);

  const stats = [
    {
      label: "প্রকাশিত সারসংক্ষেপ",
      value: published.length,
      hint: "পাঠকের জন্য দৃশ্যমান",
      icon: BookOpenIcon,
    },
    {
      label: "ড্রাফট",
      value: drafts.length,
      hint: "সম্পাদনার অপেক্ষায়",
      icon: SparkIcon,
    },
    {
      label: "পর্যালোচনায়",
      value: review.length,
      hint: "শেষ দেখার বাকি",
      icon: EyeIcon,
    },
    {
      label: "সক্রিয় বিষয়",
      value: CATEGORIES.length,
      hint: "সংগ্রহে সাজানো",
      icon: TagIcon,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gold-ink">শুভ সকাল, সম্পাদক</p>
          <h1 className="mt-2 font-display text-[clamp(2rem,4vw,3.1rem)] font-semibold leading-tight text-ink">
            আজ কী যোগ করবেন?
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            এই ড্যাশবোর্ডটি ফ্রন্টএন্ড প্রিভিউ। লগইন, সম্পাদনা ও প্রকাশনা
            পরবর্তী ব্যাকএন্ড ধাপে যুক্ত হবে।
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled
            title="পরবর্তী ধাপে সক্রিয় হবে"
            className="btn-primary cursor-not-allowed opacity-45"
          >
            <PlusIcon className="size-4" />
            নতুন সারসংক্ষেপ
          </button>
          <Link href="/" className="btn-secondary">
            সাইট দেখুন
            <ArrowUpRightIcon className="size-4" />
          </Link>
        </div>
      </section>

      <section
        aria-label="সংক্ষিপ্ত পরিসংখ্যান"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="border border-line bg-paper p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs leading-5 text-muted">{stat.label}</p>
                <Icon className="size-4 shrink-0 text-gold-ink" />
              </div>
              <p className="mt-4 font-display text-4xl font-semibold leading-none text-ink">
                {stat.value}
              </p>
              <p className="mt-3 text-[0.7rem] text-faint">{stat.hint}</p>
            </div>
          );
        })}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <section className="min-w-0 border border-line bg-paper">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">
                সাম্প্রতিক বই
              </h2>
              <p className="mt-1 text-xs text-faint">
                সর্বশেষ যোগ হওয়া সারসংক্ষেপ
              </p>
            </div>
            <Link
              href="/books"
              className="hidden text-xs text-muted transition-colors hover:text-gold-ink sm:block"
            >
              পাবলিক তালিকা
            </Link>
          </div>

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
                {recent.map((book) => {
                  const status = STATUS_META[book.status];
                  return (
                    <tr key={book.slug}>
                      <td className="px-5 py-3.5 sm:px-6">
                        <div className="flex items-center gap-3">
                          <span
                            className="relative block h-12 w-9 shrink-0 overflow-hidden rounded-[2px] border border-white/10"
                            style={{ backgroundColor: book.cover.base }}
                            aria-hidden="true"
                          >
                            <span
                              className="absolute inset-x-0 bottom-0 h-1"
                              style={{ backgroundColor: book.cover.accent }}
                            />
                            <span
                              className="absolute left-1 top-1 h-4 w-px opacity-60"
                              style={{ backgroundColor: book.cover.accent }}
                            />
                          </span>
                          <div className="min-w-0">
                            <p className="max-w-[12rem] truncate font-medium text-ink">
                              {book.title}
                            </p>
                            <p className="mt-0.5 text-[0.68rem] text-faint">
                              {book.readTime} মিনিটের পাঠ
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-xs text-muted">
                        {book.author}
                      </td>
                      <td className="px-3 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[0.65rem] ${status.className}`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${status.dot}`}
                            aria-hidden="true"
                          />
                          {status.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-[0.68rem] text-faint sm:px-6">
                        {formatBengaliDate(book.addedAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-6">
          <section className="border border-line bg-paper p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-ink">
              দ্রুত কাজ
            </h2>
            <p className="mt-1 text-xs text-faint">
              সম্পাদনার শর্টকাট—শীঘ্রই সক্রিয় হবে
            </p>
            <div className="mt-4 space-y-2">
              {[
                { label: "নতুন বই যোগ করুন", icon: PlusIcon },
                { label: "বিভাগ সাজান", icon: TagIcon },
                { label: "হোমপেজের নির্বাচন বদলান", icon: SparkIcon },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    type="button"
                    disabled
                    title="পরবর্তী ধাপে সক্রিয় হবে"
                    className="flex w-full cursor-not-allowed items-center gap-3 rounded-lg border border-line px-3 py-2.5 text-left text-xs text-faint"
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="flex-1">{action.label}</span>
                    <span className="text-[0.6rem]">শীঘ্রই</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="border border-line bg-paper p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-ink">
              সাম্প্রতিক কার্যকলাপ
            </h2>
            <ul className="mt-4 space-y-4">
              {ACTIVITY.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span
                    className={`mt-1.5 size-2 shrink-0 rounded-full ${item.color}`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-ink">{item.title}</p>
                    <p className="mt-0.5 truncate text-[0.68rem] text-muted">
                      {item.detail}
                    </p>
                    <p className="mt-1 text-[0.62rem] text-faint">
                      {item.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section className="border border-dashed border-line-strong px-5 py-4 text-xs leading-6 text-muted">
        নোট: এই ইন্টারফেসে কোনো প্রকৃত অ্যাকাউন্ট, ডেটাবেস বা প্রকাশনা
        সংযুক্ত নেই। সব সংখ্যা ও বই ডেমো ডেটা থেকে আসছে।
      </section>
    </div>
  );
}
