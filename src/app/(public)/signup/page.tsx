"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { EyeIcon, EyeClosedIcon, MailIcon, LockIcon, UserIcon } from "@/components/icons";

export default function SignUpPage() {
  const router = useRouter();
  const { register, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError("নাম আবশ্যক");
      return false;
    }
    if (value.trim().length < 2) {
      setNameError("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
      return false;
    }
    setNameError("");
    return true;
  };

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
    if (value.length < 8) {
      setPasswordError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) {
      setConfirmError("পাসওয়ার্ড নিশ্চিত করুন");
      return false;
    }
    if (value !== password) {
      setConfirmError("পাসওয়ার্ড মেলেনি");
      return false;
    }
    setConfirmError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameValid = validateName(name);
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);
    const confirmValid = validateConfirmPassword(passwordConfirmation);

    if (!nameValid || !emailValid || !passwordValid || !confirmValid) return;

    try {
      await register(name.trim(), email, password, passwordConfirmation);
      router.push("/books");
      router.refresh();
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  return (
    <>
      <div className="min-h-dvh flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 text-ink mb-6">
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
            <span className="font-display text-[1.5rem] font-semibold">অনুচ্ছেদ</span>
          </Link>
          <h1 className="font-display text-3xl font-semibold text-ink mt-4">
            স্বাগতম
          </h1>
          <p className="mt-2 text-muted">
            অনুচ্ছেদে যোগ দিন এবং পড়া শুরু করুন
          </p>
        </div>

        <div className="bg-surface border border-line rounded-xl p-6 sm:p-8">
          {error && (
            <div
              className="mb-6 p-4 bg-gold/10 border border-gold/30 rounded-lg text-gold-ink text-sm"
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }}>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-ink mb-1.5"
                >
                  নাম
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-faint" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (nameError) setNameError("");
                    }}
                    onBlur={() => validateName(name)}
                    placeholder="আপনার নাম"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-surface text-ink placeholder:text-faint transition-colors focus:outline-none focus:ring-2 focus:ring-gold/30 ${
                      nameError ? 'border-gold' : 'border-line hover:border-line-strong'
                    }`}
                    disabled={submitting}
                  />
                </div>
                {nameError && (
                  <p className="mt-1.5 text-sm text-gold">{nameError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-ink mb-1.5"
                >
                  ইমেইল ঠিকানা
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-faint"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
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
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-faint"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h12z"
                    />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                    onBlur={() => validatePassword(password)}
                    placeholder="পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)"
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg bg-surface text-ink placeholder:text-faint transition-colors focus:outline-none focus:ring-2 focus:ring-gold/30 ${
                      passwordError ? 'border-gold' : 'border-line hover:border-line-strong'
                    }`}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-ink"
                    aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
                  >
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {showPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.06 9.06 0 0112 5.0415c1.834 0 3.526.73 2.1.06 1.852.149 3.042.74 3.976 1.803a21.824 21.824 0 012.668 3.626"
                        />
                      ) : (
                        <>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 6 12 6c4.478 0 8.268 2.943 9.542 7-1.332.33-2.605.854-3.594 1.587"
                          />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-1.5 text-sm text-gold">{passwordError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password_confirmation"
                  className="block text-sm font-medium text-ink mb-1.5"
                >
                  পাসওয়ার্ড নিশ্চিত করুন
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-faint"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h12z"
                    />
                  </svg>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="password_confirmation"
                    name="password_confirmation"
                    autoComplete="new-password"
                    value={passwordConfirmation}
                    onChange={(e) => {
                      setPasswordConfirmation(e.target.value);
                      if (confirmError) setConfirmError("");
                    }}
                    onBlur={() => validateConfirmPassword(passwordConfirmation)}
                    placeholder="পাসওয়ার্ড আবার লিখুন"
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg bg-surface text-ink placeholder:text-faint transition-colors focus:outline-none focus:ring-2 focus:ring-gold/30 ${
                      confirmError ? 'border-gold' : 'border-line hover:border-line-strong'
                    }`}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-ink"
                    aria-label={showConfirmPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
                  >
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {showConfirmPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.06 9.06 0 0112 5.0415c1.834 0 3.526.73 2.1.06 1.852.149 3.042.74 3.976 1.803a21.824 21.824 0 012.668 3.626"
                        />
                      ) : (
                        <>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 6 12 6c4.478 0 8.268 2.943 9.542 7-1.332.33-2.605.854-3.594 1.587"
                          />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {confirmError && (
                  <p className="mt-1.5 text-sm text-gold">{confirmError}</p>
                )}
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
                  "নিবন্ধন করুন"
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
              onClick={() => (window.location.href = "/api/auth/google")}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-line rounded-lg text-sm font-medium text-ink bg-surface hover:bg-surface-2 transition-colors disabled:opacity-50"
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
              <span>Google দিয়ে নিবন্ধন করুন</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/signin"
              className="text-gold hover:text-gold/80 font-medium underline-offset-2 hover:underline"
            >
              লগইন করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  </>
);
}