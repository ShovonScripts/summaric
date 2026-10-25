import Link from "next/link";
import { BrandMark } from "@/components/icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-deep">
      <div className="container-shell py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link
              href="/"
              className="flex w-fit items-center gap-3 text-ink"
              aria-label="অনুচ্ছেদ — হোম"
            >
              <BrandMark className="size-9" />
              <span className="font-display text-[1.3rem] font-semibold">
                অনুচ্ছেদ
              </span>
            </Link>
            <p className="mt-4 text-sm leading-7 text-muted">
              বাছাই করা বইয়ের গভীর সারসংক্ষেপ, এক বসে পড়ার জন্য। সময়
              বাঁচান, ভাবনার গভীরে যান।
            </p>
          </div>

          <div>
            <h2 className="font-display text-base font-semibold text-ink">
              ঘুরে দেখুন
            </h2>
            <nav aria-label="ফুটার মেনু" className="mt-4 flex flex-col gap-2.5">
              <Link
                href="/books"
                className="w-fit text-sm text-muted transition-colors hover:text-ink"
              >
                সব বই
              </Link>
              <Link
                href="/#topics"
                className="w-fit text-sm text-muted transition-colors hover:text-ink"
              >
                বিষয়ভিত্তিক পাঠ
              </Link>
              <Link
                href="/about"
                className="w-fit text-sm text-muted transition-colors hover:text-ink"
              >
                আমাদের কথা
              </Link>
              <Link
                href="/admin"
                className="w-fit text-sm text-muted transition-colors hover:text-ink"
              >
                অ্যাডমিন প্রিভিউ
              </Link>
            </nav>
          </div>

          <div>
            <h2 className="font-display text-base font-semibold text-ink">
              একটি নোট
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              এটি একটি ডেমো ফ্রন্টএন্ড। সব বই, লেখক ও সারসংক্ষেপ কল্পিত।
              পূর্ণ সংস্করণে লাইব্রেরি, অ্যাকাউন্ট ও পেমেন্ট যুক্ত হবে।
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© ২০২৬ অনুচ্ছেদ। ডেমো প্রকল্প।</p>
          <p>বাংলা বই, বাংলায় ভাবনা।</p>
        </div>
      </div>
    </footer>
  );
}
