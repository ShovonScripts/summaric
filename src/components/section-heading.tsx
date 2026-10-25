import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons";

export function SectionHeading({
  title,
  description,
  linkHref,
  linkLabel,
}: {
  title: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h2 className="section-title text-ink">{title}</h2>
        {description ? (
          <p className="mt-3 max-w-xl text-[0.98rem] leading-8 text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {linkHref && linkLabel ? (
        <Link
          href={linkHref}
          className="inline-flex w-fit items-center gap-2 border-b border-line-strong pb-1 text-sm font-medium text-ink transition-colors hover:border-gold-ink hover:text-gold-ink"
        >
          {linkLabel}
          <ArrowUpRightIcon className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}
