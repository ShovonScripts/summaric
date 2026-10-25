import type { Metadata } from "next";
import { Suspense } from "react";
import { BooksExplorer } from "@/components/books-explorer";
import { PUBLISHED_BOOKS } from "@/data/books";
import { CATEGORIES } from "@/data/categories";

export const metadata: Metadata = {
  title: "বইয়ের সংগ্রহ",
  description:
    "বিষয়, লেখক বা পড়ার সময় অনুযায়ী বেছে নিন আপনার পরের বই। বাছাই করা বাংলা ও বিশ্বসাহিত্যের সারসংক্ষেপ।",
};

async function BooksExplorerSlot({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const params = await searchParams;
  const initialCategory =
    typeof params.category === "string" ? params.category : undefined;

  return (
    <BooksExplorer
      key={initialCategory ?? "all"}
      initialCategory={initialCategory}
    />
  );
}

export default function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  return (
    <>
      <section className="border-b border-line bg-paper-deep">
        <div className="container-shell py-14 sm:py-20">
          <p className="text-sm text-gold-ink">পাঠের তালিকা</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="text-[clamp(2.5rem,5.5vw,4.8rem)] font-semibold leading-[1.12] text-ink">
                আপনার পরের বইটি খুঁজে নিন।
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
                {PUBLISHED_BOOKS.length}টি বাছাই করা বই, {CATEGORIES.length}টি
                বিষয়ে সাজানো। সময় কম থাকলে দ্রুত পড়ার বই, আর গভীরে যেতে চাইলে
                বড় পাঠ—দুটোই এখানে।
              </p>
            </div>
            <div className="flex gap-8 border-t border-line pt-5 text-sm text-muted lg:border-t-0 lg:pt-0">
              <div>
                <p className="font-display text-2xl font-semibold text-ink">
                  {PUBLISHED_BOOKS.length}
                </p>
                <p className="mt-1 text-xs">প্রকাশিত সারসংক্ষেপ</p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-ink">
                  {CATEGORIES.length}
                </p>
                <p className="mt-1 text-xs">বিষয়</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-shell">
          <Suspense
            fallback={
              <div className="space-y-6" aria-hidden="true">
                <div className="h-12 max-w-xl animate-pulse rounded-full bg-surface" />
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-9 w-24 animate-pulse rounded-full bg-surface"
                    />
                  ))}
                </div>
                <div className="h-64 border border-line bg-surface" />
              </div>
            }
          >
            <BooksExplorerSlot searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
