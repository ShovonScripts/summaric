import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { AdminAccount } from "@/components/admin/admin-account";
import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminNav } from "@/components/admin/admin-nav";
import { ArrowUpRightIcon, BrandMark } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "অ্যাডমিন",
  description: "অনুচ্ছেদ অ্যাডমিন প্যানেল।",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-paper-deep" />}>
      <AdminGuard>
        <div className="admin-shell min-h-dvh bg-paper-deep">
        <div className="lg:grid lg:grid-cols-[16rem_1fr]">
          <aside className="hidden border-r border-line bg-paper lg:sticky lg:top-0 lg:flex lg:h-dvh lg:min-h-dvh lg:flex-col">
            <div className="border-b border-line p-5">
              <Link
                href="/admin"
                className="flex items-center gap-3 text-ink"
                aria-label="অনুচ্ছেদ অ্যাডমিন"
              >
                <BrandMark className="size-9" />
                <span className="flex flex-col leading-none">
                  <span className="font-display text-lg font-semibold">
                    অনুচ্ছেদ
                  </span>
                  <span className="mt-1 text-[0.62rem] text-faint">
                    অ্যাডমিন প্যানেল
                  </span>
                </span>
              </Link>
            </div>

            <nav
              aria-label="অ্যাডমিন মেনু"
              className="flex flex-1 flex-col gap-1 p-3"
            >
              <AdminNav />
            </nav>

            <div className="border-t border-line p-4">
              <Link
                href="/"
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface hover:text-ink"
              >
                সাইটে ফিরুন
                <ArrowUpRightIcon className="size-4" />
              </Link>
            </div>
          </aside>

          <div className="min-w-0">
            <header className="sticky top-0 z-40 border-b border-line bg-[var(--header-bg)] backdrop-blur-xl">
              <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-3">
                  <Link
                    href="/admin"
                    className="shrink-0 text-ink lg:hidden"
                    aria-label="অনুচ্ছেদ অ্যাডমিন"
                  >
                    <BrandMark className="size-8" />
                  </Link>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">
                      অ্যাডমিন প্যানেল
                    </p>
                    <p className="text-[0.68rem] text-faint">
                      বই ও বিভাগ ব্যবস্থাপনা
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/"
                    className="hidden items-center gap-2 rounded-full border border-line px-3.5 py-2 text-xs text-muted transition-colors hover:border-line-strong hover:text-ink sm:flex"
                  >
                    সাইট দেখুন
                    <ArrowUpRightIcon className="size-3.5" />
                  </Link>
                  <ThemeToggle compact />
                  <AdminAccount />
                </div>
              </div>

              <nav
                aria-label="মোবাইল অ্যাডমিন মেনু"
                className="flex gap-2 overflow-x-auto border-t border-line px-4 py-2.5 no-scrollbar lg:hidden"
              >
                <AdminNav mobile />
              </nav>
            </header>

            <main className="p-4 sm:p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </div>
      </AdminGuard>
    </Suspense>
  );
}
