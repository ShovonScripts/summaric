import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCard } from "@/components/book-card";
import { BookCover } from "@/components/book-cover";
import { ClockIcon, TagIcon } from "@/components/icons";
import { getBook, getAllPublishedBooks } from "@/lib/data";

type BookPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const books = await getAllPublishedBooks();
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBook(slug);

  if (!book) {
    return { title: "বই পাওয়া যায়নি" };
  }

  return {
    title: book.title,
    description: book.summary,
    openGraph: {
      title: `${book.title} — অনুচ্ছেদ`,
      description: book.summary,
      type: "article",
    },
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = await getBook(slug);

  if (!book) notFound();

  const allBooks = await getAllPublishedBooks();
  const sameCategory = allBooks.filter(
    (item) => item.category.slug === book.category.slug && item.slug !== book.slug,
  );
  const related = [
    ...sameCategory,
    ...allBooks.filter(
      (item) => item.slug !== book.slug && item.category.slug !== book.category.slug,
    ),
  ].slice(0, 3);

  return (
    <>
      <section className="border-b border-line bg-paper-deep">
        <div className="container-shell py-10 sm:py-14">
          <nav aria-label="ব্রেডক্রাম্ব" className="text-xs text-faint">
            <Link href="/" className="transition-colors hover:text-ink">
              হোম
            </Link>
            <span className="px-2" aria-hidden="true">
              /
            </span>
            <Link href="/books" className="transition-colors hover:text-ink">
              বই
            </Link>
            <span className="px-2" aria-hidden="true">
              /
            </span>
            <span className="text-muted">{book.title}</span>
          </nav>

          <div className="mt-10 grid gap-12 lg:grid-cols-[0.38fr_0.62fr] lg:items-start lg:gap-16">
            <div className="mx-auto w-full max-w-[19rem] lg:sticky lg:top-28">
              <BookCover book={book} />
              <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4">
                <div className="border-t border-line pt-3">
                  <dt className="text-xs text-faint">পৃষ্ঠা</dt>
                  <dd className="mt-1 text-sm text-ink">{book.pages}</dd>
                </div>
                <div className="border-t border-line pt-3">
                  <dt className="text-xs text-faint">প্রথম প্রকাশ</dt>
                  <dd className="mt-1 text-sm text-ink">{book.year}</dd>
                </div>
                <div className="border-t border-line pt-3">
                  <dt className="text-xs text-faint">পড়ার সময়</dt>
                  <dd className="mt-1 text-sm text-ink">
                    {book.read_time} মিনিট
                  </dd>
                </div>
                <div className="border-t border-line pt-3">
                  <dt className="text-xs text-faint">বিষয়</dt>
                  <dd className="mt-1 text-sm text-ink">{book.category.name}</dd>
                </div>
              </dl>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-faint">
                <span className="text-gold-ink">{book.category.name}</span>
                <span className="h-4 w-px bg-line" aria-hidden="true" />
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon className="size-4" />
                  {book.read_time} মিনিটের পাঠ
                </span>
              </div>
              <h1 className="mt-4 text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.12] text-ink">
                {book.title}
              </h1>
              <p className="mt-3 text-lg text-muted">{book.author}</p>

              <div className="prose-bn mt-8 max-w-2xl text-[1.02rem] leading-9 text-muted">
                <p>{book.summary}</p>
              </div>

              <p className="mt-5 max-w-2xl border-l border-line pl-4 text-xs leading-6 text-faint">
                এটি একটি নমুনা পাঠ। পূর্ণ সংস্করণে অধ্যায়ভিত্তিক উদাহরণ, আরও
                টীকা ও পাঠ-নির্দেশনা যুক্ত হবে।
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/books" className="btn-primary">
                  সব বই দেখুন
                </Link>
                <Link href="#key-ideas" className="btn-secondary">
                  মূল ভাবনাগুলো
                </Link>
              </div>

              <blockquote className="mt-10 border-l-2 border-gold pl-5">
                <p className="font-display text-[1.35rem] leading-9 text-ink">
                  “{book.quote}”
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-shell grid gap-14 lg:grid-cols-[0.38fr_0.62fr] lg:gap-16">
          <aside>
            <div className="flex items-center gap-2 text-sm font-medium text-ink">
              <TagIcon className="size-4 text-gold-ink" />
              বইয়ের ট্যাগ
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {book.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-line px-3 py-1.5 text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-8 border-t border-line pt-5">
              <p className="text-sm leading-7 text-muted">
                একটি সারসংক্ষেপ পড়ে ভালো লাগলে বইটির পূর্ণ সংস্করণ পড়ার
                পরামর্শ থাকবে। সারসংক্ষেপ মূল বইয়ের বিকল্প নয়—এটি প্রবেশদ্বার।
              </p>
            </div>
          </aside>

          <div id="key-ideas" className="scroll-mt-28">
            <h2 className="font-display text-[clamp(2rem,3.5vw,3rem)] font-semibold leading-tight text-ink">
              তিনটি মূল ভাবনা।
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
              বইটি পড়ার আগে এই তিনটি সূত্র মনে রাখলে পুরো পাঠটি সহজে ধরা যাবে।
            </p>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {book.key_ideas.map((idea, index) => (
                <li key={idea} className="flex gap-4 py-5">
                  <span
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-gold"
                    aria-hidden="true"
                  />
                  <p className="text-[0.98rem] leading-8 text-muted">
                    {idea}
                  </p>
                  <span className="sr-only">ভাবনা {index + 1}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper-deep section-pad">
        <div className="container-shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="section-title text-ink">আরও পড়তে পারেন।</h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                একই আগ্রহের কাছাকাছি আরও কিছু বই।
              </p>
            </div>
            <Link
              href="/books"
              className="w-fit border-b border-line-strong pb-1 text-sm text-ink transition-colors hover:border-gold-ink hover:text-gold-ink"
            >
              পুরো সংগ্রহ দেখুন
            </Link>
          </div>
          <div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
            {related.map((item) => (
              <BookCard key={item.slug} book={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
