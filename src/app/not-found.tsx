import Link from "next/link";
import { BrandMark } from "@/components/icons";

export default function NotFound() {
  return (
    <main className="hero-atmosphere flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg border border-line bg-surface p-7 text-center sm:p-10">
        <Link
          href="/"
          className="mx-auto flex w-fit items-center gap-3 text-ink"
          aria-label="অনুচ্ছেদ — হোম"
        >
          <BrandMark className="size-9" />
          <span className="font-display text-xl font-semibold">অনুচ্ছেদ</span>
        </Link>
        <p className="mt-8 text-sm text-gold-ink">৪০৪</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
          পাতাটি খুঁজে পাওয়া গেল না।
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          লিংকটি হয়তো বদলে গেছে, অথবা বইটি এখনও প্রকাশিত হয়নি।
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/books" className="btn-primary">
            বইয়ের সংগ্রহ
          </Link>
          <Link href="/" className="btn-secondary">
            হোমে ফিরুন
          </Link>
        </div>
      </div>
    </main>
  );
}
