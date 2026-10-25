"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback = null }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="animate-spin size-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-dvh flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-surface border border-line rounded-xl p-6 sm:p-8 text-center">
          <p className="text-muted mb-4">এই পৃষ্ঠা देखने জন্য লগইন করতে হবে।</p>
          <a
            href="/signin"
            className="btn-primary inline-block"
          >
            লগইন করুন
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}