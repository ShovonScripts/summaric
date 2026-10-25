"use client";

import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";

function LibraryContent() {
  const sampleBooks = [
    {
      id: 1,
      title: "নিঃশব্দের ভাষা",
      slug: "nishobder-bhasha",
      author: "অরুণা সেন",
      progress: 65,
      category: "মনোবিজ্ঞান",
      readTime: 9,
    },
    {
      id: 2,
      title: "সময়ের নদী",
      slug: "somo-yer-nodi",
      author: "তানভীর হাসান",
      progress: 100,
      category: "ইতিহাস ও সমাজ",
      readTime: 11,
    },
    {
      id: 3,
      title: "ছোট্ট জীবনের বড় প্রশ্ন",
      slug: "chotto-jiboner-boro-proshno",
      author: "মেহেরুন নেসা",
      progress: 30,
      category: "মনন ও দর্শন",
      readTime: 7,
    },
  ];

  return (
    <div className="min-h-dvh">
      <div className="container-shell py-10 sm:py-16">
        <div className="mb-10">
          <p className="text-sm text-gold-ink">আপনার লাইব্রেরি</p>
          <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-semibold text-ink mt-2">
            আপনার লাইব্রেরি
          </h1>
          <p className="mt-3 text-muted">
            আপনার পড়া বইগুলো এবং পড়ার যাত্রা এখানে থেকে শুরু করুন।
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-ink">
                পড়া চলছে
              </h2>
              <Link
                href="/books"
                className="text-sm text-gold-ink hover:text-gold font-medium"
              >
                সব দেখুন
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleBooks.map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${book.slug}`}
                  className="group bg-surface border border-line rounded-xl p-5 hover:border-gold/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-medium text-gold-ink px-2 py-1 rounded-full bg-gold/10">
                      {book.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-faint">
                      <svg
                        className="size-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="8.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path d="M12 7.5v5l3.2 1.9" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      <span>{book.readTime} মিনিট</span>
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-ink group-hover:text-gold-ink transition-colors mb-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted mb-3">{book.author}</p>
                  <div className="w-full bg-line/30 rounded-full h-2">
                    <div
                      className="bg-gold h-2 rounded-full transition-all duration-300"
                      style={{ width: `${book.progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted text-right">
                    {book.progress}% পূর্ণ
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section className="pt-8 border-t border-line">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-ink">
                সম্পন্ন বই
              </h2>
              <Link
                href="/library/completed"
                className="text-sm text-gold-ink hover:text-gold font-medium"
              >
                সব দেখুন
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                href="/books/somo-yer-nodi"
                className="group bg-surface border border-line rounded-xl p-5 hover:border-gold/30 transition-colors"
              >
                <div className="flex items-center gap-2 text-xs text-gold-ink mb-3">
                  <span className="px-2 py-1 rounded-full bg-green/10 text-green font-medium">সম্পন্ন</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-ink group-hover:text-gold-ink transition-colors mb-1">
                  সময়ের নদী
                </h3>
                <p className="text-sm text-muted mb-3">তানভীর হাসান · ইতিহাস ও সমাজ</p>
                <div className="flex items-center justify-between text-xs text-faint">
                  <span>১১ মিনিট</span>
                  <span className="text-green font-medium">১০০% সম্পন্ন</span>
                </div>
              </Link>
            </div>
          </section>
        </div>

        <div className="mt-12 border-t border-line pt-8">
          <h2 className="font-display text-xl font-semibold text-ink mb-6">
            আপনার পরের পাঠ কী হবে?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/books"
              className="btn-primary flex-1 text-center"
            >
              বই খুঁজে নিন
            </Link>
            <Link
              href="/books?category=monon"
              className="btn-secondary flex-1 text-center"
            >
              বিষয় অনুযায়ী ব্রাউজ করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LibraryPage() {
  return (
    <div className="min-h-dvh">
      <ProtectedRoute>
        <LibraryContent />
      </ProtectedRoute>
    </div>
  );
}