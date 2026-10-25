import Link from "next/link";
import { BookCover } from "@/components/book-cover";
import { ClockIcon } from "@/components/icons";
import { getCategory } from "@/data/categories";
import type { Book } from "@/types/book";

export function BookCard({
  book,
  showSummary = false,
}: {
  book: Book;
  showSummary?: boolean;
}) {
  return (
    <Link
      href={`/books/${book.slug}`}
      className="group block min-w-0 rounded-sm focus-visible:outline-offset-4"
    >
      <div className="transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-hover:rotate-[-0.6deg]">
        <BookCover book={book} />
      </div>
      <div className="mt-4">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.72rem] leading-5 text-faint">
          <span>{getCategory(book.category).name}</span>
          <span className="h-px w-3 bg-line-strong" aria-hidden="true" />
          <span className="inline-flex items-center gap-1">
            <ClockIcon className="size-3.5" />
            {book.readTime} মিনিট
          </span>
        </div>
        <h3 className="mt-1.5 font-display text-[1.35rem] font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-gold-ink">
          {book.title}
        </h3>
        <p className="mt-0.5 text-sm text-muted">{book.author}</p>
        {showSummary ? (
          <p className="mt-2 hidden text-sm leading-7 text-muted sm:block">
            <span className="line-clamp-2">{book.summary}</span>
          </p>
        ) : null}
      </div>
    </Link>
  );
}
