"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BrandMark } from "@/components/icons";

export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
        <p className="mt-8 text-sm text-gold-ink">একটি সমস্যা হয়েছে</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
          পাতাটি এখন দেখা যাচ্ছে না।
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          আবার চেষ্টা করুন। সমস্যা থেকে গেলে কিছুক্ষণ পর ফিরে আসুন।
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={retry} className="btn-primary">
            আবার চেষ্টা করুন
          </button>
          <Link href="/" className="btn-secondary">
            হোমে ফিরুন
          </Link>
        </div>
      </div>
    </main>
  );
}
