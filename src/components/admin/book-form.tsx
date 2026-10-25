"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  createAdminBook,
  getAdminCategories,
  isAdminError,
  updateAdminBook,
  type AdminBook,
  type AdminBookPayload,
  type AdminCategory,
} from "@/lib/admin";
import type { BookStatus, CoverMotif } from "@/lib/api";

const MOTIFS: CoverMotif[] = [
  "ripple",
  "wave",
  "orbit",
  "grid",
  "sun",
  "steps",
  "moon",
  "stack",
  "spiral",
  "arch",
];

const STATUS_OPTIONS: { value: BookStatus; label: string }[] = [
  { value: "draft", label: "ড্রাফট" },
  { value: "review", label: "পর্যালোচনায়" },
  { value: "published", label: "প্রকাশিত" },
];

const inputClass =
  "w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-gold-ink";

interface BookFormState {
  slug: string;
  title: string;
  author: string;
  categoryId: string;
  year: string;
  pages: string;
  readTime: string;
  summary: string;
  keyIdeas: string;
  quote: string;
  base: string;
  accent: string;
  ink: string;
  motif: CoverMotif;
  addedAt: string;
  featured: boolean;
  status: BookStatus;
  tags: string;
}

function toFormState(book?: AdminBook): BookFormState {
  return {
    slug: book?.slug ?? "",
    title: book?.title ?? "",
    author: book?.author ?? "",
    categoryId: book ? String(book.category_id) : "",
    year: book?.year ? String(book.year) : "",
    pages: book?.pages ? String(book.pages) : "",
    readTime: book?.read_time ? String(book.read_time) : "",
    summary: book?.summary ?? "",
    keyIdeas: (book?.key_ideas ?? []).join("\n"),
    quote: book?.quote ?? "",
    base: book?.cover?.base ?? "#15343b",
    accent: book?.cover?.accent ?? "#f5bc5c",
    ink: book?.cover?.ink ?? "#f6f1e6",
    motif: book?.cover?.motif ?? "ripple",
    addedAt: book?.added_at ?? new Date().toISOString().slice(0, 10),
    featured: book?.featured ?? false,
    status: book?.status ?? "draft",
    tags: (book?.tags ?? []).join(", "),
  };
}

function toNumberOrNull(value: string): number | null {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {hint ? <p className="mt-1 text-[0.7rem] text-faint">{hint}</p> : null}
      <div className="mt-1.5">{children}</div>
      {error ? <p className="mt-1 text-xs text-gold-ink">{error}</p> : null}
    </div>
  );
}

export function BookForm({ book }: { book?: AdminBook }) {
  const router = useRouter();
  const [form, setForm] = useState<BookFormState>(() => toFormState(book));
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    let active = true;

    getAdminCategories()
      .then((items) => {
        if (!active) return;
        setCategories(items);
        setForm((current) =>
          current.categoryId || items.length === 0
            ? current
            : { ...current, categoryId: String(items[0].id) },
        );
      })
      .catch((err) => {
        if (active) {
          setError(
            isAdminError(err) ? err.message : "বিভাগের তালিকা লোড হয়নি।",
          );
        }
      })
      .finally(() => {
        if (active) setLoadingCategories(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function update<K extends keyof BookFormState>(
    key: K,
    value: BookFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function fieldError(name: string): string | undefined {
    return fieldErrors[name]?.[0];
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    const payload: AdminBookPayload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      author: form.author.trim(),
      category_id: Number(form.categoryId),
      year: toNumberOrNull(form.year),
      pages: toNumberOrNull(form.pages),
      read_time: toNumberOrNull(form.readTime),
      summary: form.summary.trim() || null,
      key_ideas: form.keyIdeas
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
      quote: form.quote.trim() || null,
      cover: {
        base: form.base,
        accent: form.accent,
        ink: form.ink,
        motif: form.motif,
      },
      added_at: form.addedAt || null,
      featured: form.featured,
      status: form.status,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      if (book) {
        await updateAdminBook(book.id, payload);
      } else {
        await createAdminBook(payload);
      }
      router.push("/admin/books");
      router.refresh();
    } catch (err) {
      if (isAdminError(err)) {
        setError(err.message);
        setFieldErrors(err.errors ?? {});
      } else {
        setError("সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gold-ink">
            {book ? "সম্পাদনা" : "নতুন সারসংক্ষেপ"}
          </p>
          <h1 className="mt-2 font-display text-[clamp(1.9rem,3.5vw,2.7rem)] font-semibold leading-tight text-ink">
            {book ? book.title : "নতুন বই যোগ করুন"}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/books" className="btn-secondary">
            বাতিল
          </Link>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
          </button>
        </div>
      </section>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold-ink"
        >
          {error}
        </p>
      ) : null}

      <section className="space-y-5 border border-line bg-paper p-5 sm:p-6">
        <h2 className="font-display text-xl font-semibold text-ink">
          মূল তথ্য
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="শিরোনাম" htmlFor="title" error={fieldError("title")}>
            <input
              id="title"
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              required
              className={inputClass}
            />
          </Field>
          <Field
            label="স্লাগ"
            htmlFor="slug"
            hint="শুধু ছোট হাতের ইংরেজি অক্ষর, সংখ্যা ও হাইফেন"
            error={fieldError("slug")}
          >
            <input
              id="slug"
              value={form.slug}
              onChange={(event) => update("slug", event.target.value)}
              required
              placeholder="book-slug"
              className={inputClass}
            />
          </Field>
          <Field label="লেখক" htmlFor="author" error={fieldError("author")}>
            <input
              id="author"
              value={form.author}
              onChange={(event) => update("author", event.target.value)}
              required
              className={inputClass}
            />
          </Field>
          <Field
            label="বিভাগ"
            htmlFor="category"
            error={fieldError("category_id")}
          >
            <select
              id="category"
              value={form.categoryId}
              onChange={(event) => update("categoryId", event.target.value)}
              required
              disabled={loadingCategories}
              className={inputClass}
            >
              <option value="" disabled>
                বিভাগ বেছে নিন
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="অবস্থা"
            htmlFor="status"
            error={fieldError("status")}
          >
            <select
              id="status"
              value={form.status}
              onChange={(event) =>
                update("status", event.target.value as BookStatus)
              }
              className={inputClass}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="যোগ করার তারিখ" htmlFor="addedAt" error={fieldError("added_at")}>
            <input
              id="addedAt"
              type="date"
              value={form.addedAt}
              onChange={(event) => update("addedAt", event.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="প্রকাশের বছর" htmlFor="year" error={fieldError("year")}>
            <input
              id="year"
              inputMode="numeric"
              value={form.year}
              onChange={(event) => update("year", event.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="পৃষ্ঠা" htmlFor="pages" error={fieldError("pages")}>
            <input
              id="pages"
              inputMode="numeric"
              value={form.pages}
              onChange={(event) => update("pages", event.target.value)}
              className={inputClass}
            />
          </Field>
          <Field
            label="পড়ার সময় (মিনিট)"
            htmlFor="readTime"
            error={fieldError("read_time")}
          >
            <input
              id="readTime"
              inputMode="numeric"
              value={form.readTime}
              onChange={(event) => update("readTime", event.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="সারসংক্ষেপ" htmlFor="summary" error={fieldError("summary")}>
          <textarea
            id="summary"
            value={form.summary}
            onChange={(event) => update("summary", event.target.value)}
            rows={5}
            className={inputClass}
          />
        </Field>

        <Field
          label="মূল ভাবনা"
          htmlFor="keyIdeas"
          hint="প্রতি লাইনে একটি ভাবনা"
          error={fieldError("key_ideas")}
        >
          <textarea
            id="keyIdeas"
            value={form.keyIdeas}
            onChange={(event) => update("keyIdeas", event.target.value)}
            rows={4}
            className={inputClass}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="উদ্ধৃতি" htmlFor="quote" error={fieldError("quote")}>
            <textarea
              id="quote"
              value={form.quote}
              onChange={(event) => update("quote", event.target.value)}
              rows={2}
              className={inputClass}
            />
          </Field>
          <Field label="ট্যাগ" htmlFor="tags" hint="কমা দিয়ে আলাদা করুন">
            <input
              id="tags"
              value={form.tags}
              onChange={(event) => update("tags", event.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <label className="flex items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => update("featured", event.target.checked)}
            className="size-4 accent-[var(--gold)]"
          />
          হোমপেজে ফিচার্ড হিসেবে দেখান
        </label>
      </section>

      <section className="space-y-5 border border-line bg-paper p-5 sm:p-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">
            প্রচ্ছদ
          </h2>
          <p className="mt-1 text-xs text-faint">
            CSS দিয়ে আঁকা প্রচ্ছদের রঙ ও মোটিফ।
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="বেস রঙ" htmlFor="base" error={fieldError("cover.base")}>
            <input
              id="base"
              type="color"
              value={form.base}
              onChange={(event) => update("base", event.target.value)}
              className="h-11 w-full cursor-pointer rounded-lg border border-line bg-surface p-1"
            />
          </Field>
          <Field
            label="অ্যাকসেন্ট রঙ"
            htmlFor="accent"
            error={fieldError("cover.accent")}
          >
            <input
              id="accent"
              type="color"
              value={form.accent}
              onChange={(event) => update("accent", event.target.value)}
              className="h-11 w-full cursor-pointer rounded-lg border border-line bg-surface p-1"
            />
          </Field>
          <Field label="লেখার রঙ" htmlFor="ink" error={fieldError("cover.ink")}>
            <input
              id="ink"
              type="color"
              value={form.ink}
              onChange={(event) => update("ink", event.target.value)}
              className="h-11 w-full cursor-pointer rounded-lg border border-line bg-surface p-1"
            />
          </Field>
          <Field label="মোটিফ" htmlFor="motif" error={fieldError("cover.motif")}>
            <select
              id="motif"
              value={form.motif}
              onChange={(event) =>
                update("motif", event.target.value as CoverMotif)
              }
              className={inputClass}
            >
              {MOTIFS.map((motif) => (
                <option key={motif} value={motif}>
                  {motif}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <div className="flex justify-end gap-2">
        <Link href="/admin/books" className="btn-secondary">
          বাতিল
        </Link>
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
        </button>
      </div>
    </form>
  );
}
