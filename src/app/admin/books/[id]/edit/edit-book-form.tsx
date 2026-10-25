"use client";

import { useEffect, useState } from "react";
import { BookForm } from "@/components/admin/book-form";
import {
  getAdminBook,
  isAdminError,
  type AdminBook,
} from "@/lib/admin";

export function EditBookForm({ id }: { id: string }) {
  const [book, setBook] = useState<AdminBook | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getAdminBook(id)
      .then((item) => {
        if (active) setBook(item);
      })
      .catch((err) => {
        if (active) {
          setError(isAdminError(err) ? err.message : "বই লোড হয়নি।");
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl border border-line bg-paper p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">
          বই পাওয়া যায়নি
        </h1>
        <p className="mt-3 text-sm text-muted">{error}</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="mx-auto max-w-4xl space-y-4" aria-busy="true">
        <div className="h-10 w-64 animate-pulse rounded bg-surface" />
        <div className="h-96 animate-pulse border border-line bg-paper" />
      </div>
    );
  }

  return <BookForm book={book} />;
}
