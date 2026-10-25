import Link from "next/link";
import { BookCard } from "@/components/book-card";
import { BookCover } from "@/components/book-cover";
import { CategoryGlyph } from "@/components/category-glyph";
import {
  ArrowUpRightIcon,
  BookOpenIcon,
  ClockIcon,
  SparkIcon,
} from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import {
  FEATURED_BOOK,
  PUBLISHED_BOOKS,
  countBooksByCategory,
} from "@/data/books";
import { CATEGORIES } from "@/data/categories";

const NOTES = [
  {
    title: "গভীরতা",
    description:
      "শুধু সারমর্ম নয়—বইয়ের মূল যুক্তি, দ্বিধা আর টানাপোড়েনও তুলে ধরা হয়।",
    icon: BookOpenIcon,
  },
  {
    title: "সময়ের সম্মান",
    description:
      "প্রতিটি সারসংক্ষেপে পড়ার সময় স্পষ্ট। আগে থেকেই জানবেন কতটা সময় লাগবে।",
    icon: ClockIcon,
  },
  {
    title: "বাছাই",
    description:
      "প্রতিটি বই হাতে বেছে নেওয়া। একই ধরনের তালিকা নয়, প্রতিবার নতুন কিছু।",
    icon: SparkIcon,
  },
];

export default function HomePage() {
  const featured = FEATURED_BOOK;
  const latest = PUBLISHED_BOOKS.filter(
    (book) => book.slug !== featured.slug,
  ).slice(0, 4);

  return (
    <>
      <section className="hero-atmosphere relative overflow-hidden border-b border-line">
        <div
          className="hero-watermark absolute -right-10 top-14 leading-none"
          aria-hidden="true"
        >
          অ
        </div>
        <div className="container-shell relative grid gap-16 py-14 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-10 lg:py-24">
          <div className="hero-copy relative z-10">
            <div className="flex items-center gap-3 text-sm text-gold-ink">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              এই সপ্তাহের নির্বাচন
            </div>
            <h1 className="display-hero mt-5 max-w-2xl font-semibold text-ink">
              <span className="block">এক বসে পড়ুন,</span>
              <span className="block">ভাবতে থাকুন অনেকক্ষণ।</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted sm:text-lg sm:leading-9">
              বাছাই করা বাংলা ও বিশ্বসাহিত্যের বই, ৬–১২ মিনিটের গভীর
              সারসংক্ষেপে। সময় বাঁচান, ভাবনার গভীরে যান।
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/books" className="btn-primary">
                বইয়ের সংগ্রহ দেখুন
                <ArrowUpRightIcon className="size-4" />
              </Link>
              <Link
                href={`/books/${featured.slug}`}
                className="btn-secondary"
              >
                আজকের সারসংক্ষেপ
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-faint">
              <span>{PUBLISHED_BOOKS.length}টি বই</span>
              <span className="h-4 w-px bg-line" aria-hidden="true" />
              <span>{CATEGORIES.length}টি বিষয়</span>
              <span className="h-4 w-px bg-line" aria-hidden="true" />
              <span>প্রতি শুক্রবার নতুন পাঠ</span>
            </div>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[26rem] lg:max-w-none">
            <div className="relative mx-auto mb-12 w-[74%] max-w-[20rem] sm:w-[60%] lg:mb-0 lg:w-[76%] lg:max-w-[22.5rem]">
              <BookCover book={featured} className="hero-cover" />
              <div className="absolute -bottom-7 -left-2 w-[78%] border border-line bg-surface/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:-left-6 sm:p-5 lg:-bottom-8 lg:-left-8">
                <div className="flex items-center gap-2 text-[0.7rem] text-gold-ink">
                  <SparkIcon className="size-3.5" />
                  সপ্তাহের বই
                </div>
                <p className="mt-2 font-display text-lg font-semibold leading-snug text-ink">
                  {featured.title}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {featured.author} · {featured.readTime} মিনিট
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-shell">
          <SectionHeading
            title="নতুন এসেছে।"
            description="সাম্প্রতিক যোগ হওয়া সারসংক্ষেপগুলো—প্রতিটি এক বসে পড়ার জন্য সাজানো।"
            linkHref="/books"
            linkLabel="সব বই দেখুন"
          />
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
            {latest.map((book) => (
              <BookCard key={book.slug} book={book} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="topics"
        className="scroll-mt-24 border-y border-line bg-paper-deep section-pad"
      >
        <div className="container-shell">
          <SectionHeading
            title="বিষয় ধরে পড়ুন।"
            description="কোন মুডে আছেন, তার ওপর ভর করে বেছে নিন আপনার পরের বইটি।"
          />
          <div className="mt-8 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/books?category=${category.slug}`}
                className="group flex items-start gap-5 border-t border-line py-6 transition-colors hover:border-gold-ink"
              >
                <CategoryGlyph motif={category.motif} />
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-semibold text-ink transition-colors group-hover:text-gold-ink">
                    {category.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-7 text-muted">
                    {category.blurb}
                  </p>
                  <p className="mt-2 text-xs text-faint">
                    {countBooksByCategory(category.slug)}টি সারসংক্ষেপ
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
          <div>
            <p className="font-display text-[clamp(1.8rem,3.2vw,2.8rem)] leading-[1.4] text-ink">
              “ভালো বই সময় নেয়। ভালো সারসংক্ষেপ সেই সময়কে সম্মান করে।”
            </p>
            <p className="mt-5 text-sm text-muted">
              অনুচ্ছেদের সম্পাদকীয় নোট
            </p>
          </div>
          <div className="grid gap-7 sm:grid-cols-3">
            {NOTES.map((note) => {
              const Icon = note.icon;
              return (
                <div key={note.title} className="border-t border-line pt-5">
                  <Icon className="size-5 text-gold-ink" />
                  <h2 className="mt-4 font-display text-xl font-semibold text-ink">
                    {note.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    {note.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-shell">
          <div className="relative overflow-hidden border border-line bg-surface px-6 py-10 sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-14 lg:py-12">
            <div className="relative z-10 max-w-2xl">
              <p className="text-sm text-gold-ink">আপনার পরের বই</p>
              <h2 className="section-title mt-3 text-ink">
                কী পড়বেন, ভাবতে হবে না।
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base sm:leading-8">
                বিষয়, সময় আর আগ্রহ অনুযায়ী বেছে নিন। প্রতিটি বইয়ের সঙ্গে
                থাকছে মূল ভাবনার সংক্ষিপ্ত মানচিত্র।
              </p>
            </div>
            <Link
              href="/books"
              className="btn-primary relative z-10 mt-7 w-fit lg:mt-0"
            >
              বই খুঁজে নিন
              <ArrowUpRightIcon className="size-4" />
            </Link>
            <span
              className="pointer-events-none absolute -bottom-24 -right-10 font-display text-[15rem] leading-none text-gold opacity-[0.055]"
              aria-hidden="true"
            >
              ।
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
