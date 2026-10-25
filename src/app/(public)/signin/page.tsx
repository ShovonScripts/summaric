"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { EyeIcon, EyeClosedIcon, MailIcon, LockIcon } from "@/components/icons";

function SignInPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const callbackUrl = searchParams.get("callbackUrl") || "/books";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError("ইমেইল আবশ্যক");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError("সঠিক ইমেইল ঠিকানা দিন");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError("পাসওয়ার্ড আবশ্যক");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);

    if (!emailValid || !passwordValid) return;

    setSubmitting(true);
    try {
      await login(email, password, true);
    } catch (err) {
      // Error is handled by the auth context
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-ink mb-6"
            aria-label="অনুচ্ছেদ — হোম"
          >
            <svg
              viewBox="0 0 40 40"
              className="size-9 text-ink"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <rect
                x="3.25"
                y="3.25"
                width="33.5"
                height="33.5"
                rx="9"
                stroke="currentColor"
                strokeOpacity="0.32"
                strokeWidth="1.5"
              />
              <path
                d="M13 11.5v17M13 11.5c6.6 0 10 2.5 10 6.6 0 4-3.4 6.4-10 6.4"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <circle cx="27.5" cy="25.5" r="2.3" fill="var(--gold)" />
            </svg>
            <span className="font-display text-[1.5rem] font-semibold">
              অনুচ্ছেদ
            </span>
          </Link>
          <h1 className="font-display text-3xl font-semibold text-ink mt-4">
            স্বাগতম আবার
          </h1>
          <p className="mt-2 text-muted">
            আপনার অ্যাকাউন্টে প্রবেশ করুন
          </p>
        </div>

        <div className="bg-surface border border-line rounded-xl p-6 sm:p-8">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }}>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-ink mb-1.5"
                >
                  ইমেইল ঠিকানা
                </label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-faint" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    onBlur={() => validateEmail(email)}
                    placeholder="আপনার ইমেইল ঠিকানা"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-surface text-ink placeholder:text-faint transition-colors focus:outline-none focus:ring-2 focus:ring-gold/30 ${
                      emailError ? 'border-gold' : 'border-line hover:border-line-strong'
                    }`}
                    disabled={submitting}
                  />
                </div>
                {emailError && (
                  <p className="mt-1.5 text-sm text-gold">{emailError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-ink mb-1.5"
                >
                  পাসওয়ার্ড
                </label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-faint" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                    onBlur={() => validatePassword(password)}
                    placeholder="আপনার পাসওয়ার্ড"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-surface text-ink placeholder:text-faint transition-colors focus:outline-none focus:ring-2 focus:ring-gold/30 ${
                      passwordError ? 'border-gold' : 'border-line hover:border-line-strong'
                    }`}
                    disabled={submitting}
                  />
                </div>
                <p className="mt-1.5 text-sm text-gold">{passwordError}</p>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="size-4 border-line rounded bg-surface text-gold focus:ring-2 focus:ring-gold/30"
                  />
                  <span className="text-sm text-muted">মনে রাখুন</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-gold hover:text-gold/80 underline-offset-2 hover:underline"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin size-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    প্রক্রিয়াকরণ...
                  </span>
                ) : (
                  "প্রবেশ করুন"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-line" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-2 text-faint">অথবা</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-line rounded-lg text-sm font-medium text-ink bg-surface hover:bg-surface-2 transition-colors"
            >
              <svg className="size-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.56v2.84C3.93 20.66 7.46 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09 8 5 13 0 8 5-13 0z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.73 1 4.26 3.47 2.56 6.96l2.84 2.22z"
                />
              </svg>
              <span>Google দিয়ে যোগদান করুন</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            অ্যাকাউন্ট নেই?{" "}
            <a
              href="/signup"
              className="text-gold hover:text-gold/80 font-medium underline-offset-2 hover:underline"
            >
              নিবন্ধন করুন
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-ink mb-6"
            aria-label="অনুচ্ছেদ — হোম"
          >
            <svg
              viewBox="0 0 40 40"
              className="size-9 text-ink"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <rect
                x="3.25"
                y="3.25"
                width="33.5"
                height="33.5"
                rx="9"
                stroke="currentColor"
                strokeOpacity="0.32"
                strokeWidth="1.5"
              />
              <path
                d="M13 11.5v17M13 11.5c6.6 0 10 2.5 10 6.6 0 4-3.4 6.4-10 6.4"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <circle cx="27.5" cy="25.5" r="2.3" fill="var(--gold)" />
            </svg>
            <span className="font-display text-[1.5rem] font-semibold">
              অনুচ্ছেদ
            </span>
          </Link>
          <h1 className="font-display text-3xl font-semibold text-ink mt-4">
            স্বাগতম আবার
          </h1>
          <p className="mt-2 text-muted">
            আপনার অ্যাকাউন্টে প্রবেশ করুন
          </p>
        </div>

        <Suspense fallback={
          <div className="w-full max-w-md bg-surface border border-line rounded-xl p-6 sm:p-8">
            <div className="flex justify-center">
              <div className="animate-spin size-8 border-2 border-gold border-t-transparent rounded-full" />
            </div>
          </div>
        }>
          <SignInPageContent />
        </Suspense>
      </div>
    </div>
  );
}