"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";

export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/signin?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-paper-deep">
        <p className="text-sm text-muted">যাচাই করা হচ্ছে...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!user.is_admin) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-paper-deep px-5">
        <div className="max-w-md border border-line bg-paper p-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">
            প্রবেশাধিকার নেই
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted">
            এই অংশটি কেবল অ্যাডমিন অ্যাকাউন্টের জন্য। আপনার অ্যাকাউন্টে
            অ্যাডমিন অনুমতি নেই।
          </p>
          <Link href="/" className="btn-secondary mt-6">
            হোমপেজে ফিরুন
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
