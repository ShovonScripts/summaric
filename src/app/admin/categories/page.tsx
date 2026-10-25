"use client";

import { useEffect, useState, type FormEvent } from "react";
import { PlusIcon, TagIcon } from "@/components/icons";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  isAdminError,
  updateAdminCategory,
  type AdminCategory,
  type AdminCategoryPayload,
} from "@/lib/admin";
import type { CoverMotif } from "@/lib/api";

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

const EMPTY_FORM: AdminCategoryPayload = {
  slug: "",
  name: "",
  blurb: "",
  motif: "orbit",
};

const inputClass =
  "w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-gold-ink";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [form, setForm] = useState<AdminCategoryPayload>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    let ignore = false;

    getAdminCategories()
      .then((items) => {
        if (ignore) return;
        setCategories(items);
        setError(null);
      })
      .catch((err) => {
        if (ignore) return;
        setError(isAdminError(err) ? err.message : "বিভাগ লোড হয়নি।");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [refreshToken]);

  function startCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFieldErrors({});
    setError(null);
  }

  function startEdit(category: AdminCategory) {
    setEditing(category);
    setForm({
      slug: category.slug,
      name: category.name,
      blurb: category.blurb,
      motif: category.motif,
    });
    setFieldErrors({});
    setError(null);
  }

  function update<K extends keyof AdminCategoryPayload>(
    key: K,
    value: AdminCategoryPayload[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setFieldErrors({});

    try {
      if (editing) {
        await updateAdminCategory(editing.slug, form);
      } else {
        await createAdminCategory(form);
      }
      setEditing(null);
      setForm(EMPTY_FORM);
      setRefreshToken((token) => token + 1);
    } catch (err) {
      if (isAdminError(err)) {
        setError(err.message);
        setFieldErrors(err.errors ?? {});
      } else {
        setError("সংরক্ষণ করা যায়নি।");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category: AdminCategory) {
    if (
      !window.confirm(`"${category.name}" বিভাগটি মুছে ফেলতে চান?`)
    ) {
      return;
    }

    setDeletingSlug(category.slug);
    try {
      await deleteAdminCategory(category.slug);
      if (editing?.slug === category.slug) {
        startCreate();
      }
      setRefreshToken((token) => token + 1);
    } catch (err) {
      setError(isAdminError(err) ? err.message : "বিভাগ মোছা যায়নি।");
    } finally {
      setDeletingSlug(null);
    }
  }

  const fieldError = (name: string) => fieldErrors[name]?.[0];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gold-ink">কনটেন্ট</p>
          <h1 className="mt-2 font-display text-[clamp(1.9rem,3.5vw,2.7rem)] font-semibold leading-tight text-ink">
            বিভাগ ব্যবস্থাপনা
          </h1>
          <p className="mt-2 text-sm text-muted">
            বিভাগ যোগ করুন, নাম বদলান বা খালি বিভাগ মুছে ফেলুন।
          </p>
        </div>
        <button type="button" onClick={startCreate} className="btn-primary w-fit">
          <PlusIcon className="size-4" />
          নতুন বিভাগ
        </button>
      </section>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold-ink"
        >
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="min-w-0 border border-line bg-paper">
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-display text-xl font-semibold text-ink">
              সব বিভাগ
            </h2>
          </div>

          {loading && categories.length === 0 ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-14 animate-pulse rounded bg-surface" />
              ))}
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className={`flex items-start gap-4 px-5 py-4 ${
                    editing?.slug === category.slug ? "bg-surface/60" : ""
                  }`}
                >
                  <TagIcon className="mt-1 size-4 shrink-0 text-gold-ink" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink">{category.name}</p>
                    <p className="mt-0.5 text-xs text-faint">
                      {category.slug} · {category.books_count}টি বই ·{" "}
                      {category.motif}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-6 text-muted">
                      {category.blurb}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => startEdit(category)}
                      className="rounded-full border border-line px-3 py-1.5 text-[0.68rem] text-muted transition-colors hover:border-line-strong hover:text-ink"
                    >
                      সম্পাদনা
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category)}
                      disabled={
                        deletingSlug === category.slug ||
                        category.books_count > 0
                      }
                      title={
                        category.books_count > 0
                          ? "আগে এই বিভাগের বই সরান"
                          : undefined
                      }
                      className="rounded-full border border-line px-3 py-1.5 text-[0.68rem] text-muted transition-colors hover:border-gold hover:text-gold-ink disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {deletingSlug === category.slug ? "মুছছে..." : "মুছুন"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border border-line bg-paper p-5 sm:p-6">
          <h2 className="font-display text-xl font-semibold text-ink">
            {editing ? "বিভাগ সম্পাদনা" : "নতুন বিভাগ"}
          </h2>
          <p className="mt-1 text-xs text-faint">
            {editing ? `স্লাগ: ${editing.slug}` : "সব ঘর পূরণ করুন"}
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ink">
                নাম
              </label>
              <input
                id="name"
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                required
                className={`mt-1.5 ${inputClass}`}
              />
              {fieldError("name") ? (
                <p className="mt-1 text-xs text-gold-ink">{fieldError("name")}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-ink">
                স্লাগ
              </label>
              <input
                id="slug"
                value={form.slug}
                onChange={(event) => update("slug", event.target.value)}
                required
                placeholder="topic-slug"
                className={`mt-1.5 ${inputClass}`}
              />
              {fieldError("slug") ? (
                <p className="mt-1 text-xs text-gold-ink">{fieldError("slug")}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="blurb" className="block text-sm font-medium text-ink">
                সংক্ষিপ্ত বিবরণ
              </label>
              <textarea
                id="blurb"
                value={form.blurb}
                onChange={(event) => update("blurb", event.target.value)}
                required
                rows={3}
                className={`mt-1.5 ${inputClass}`}
              />
              {fieldError("blurb") ? (
                <p className="mt-1 text-xs text-gold-ink">{fieldError("blurb")}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="motif" className="block text-sm font-medium text-ink">
                মোটিফ
              </label>
              <select
                id="motif"
                value={form.motif}
                onChange={(event) =>
                  update("motif", event.target.value as CoverMotif)
                }
                className={`mt-1.5 ${inputClass}`}
              >
                {MOTIFS.map((motif) => (
                  <option key={motif} value={motif}>
                    {motif}
                  </option>
                ))}
              </select>
              {fieldError("motif") ? (
                <p className="mt-1 text-xs text-gold-ink">{fieldError("motif")}</p>
              ) : null}
            </div>

            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
              </button>
              {editing ? (
                <button type="button" onClick={startCreate} className="btn-secondary">
                  বাতিল
                </button>
              ) : null}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
