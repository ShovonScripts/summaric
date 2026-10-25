import type { CSSProperties } from "react";
import { getCategory } from "@/data/categories";
import type { Book, CoverMotif } from "@/types/book";

function Motif({ motif }: { motif: CoverMotif }) {
  switch (motif) {
    case "ripple":
      return (
        <g stroke="var(--cover-accent)" fill="none" strokeWidth="1.4">
          <circle cx="220" cy="166" r="34" opacity="0.95" />
          <circle cx="220" cy="166" r="72" opacity="0.55" />
          <circle cx="220" cy="166" r="112" opacity="0.32" />
          <circle cx="220" cy="166" r="154" opacity="0.18" />
          <circle cx="220" cy="166" r="196" opacity="0.1" />
          <circle cx="220" cy="166" r="4" fill="var(--cover-accent)" stroke="none" />
        </g>
      );
    case "wave":
      return (
        <g stroke="var(--cover-accent)" fill="none" strokeWidth="1.5">
          <path d="M-20 92c58-42 96 42 154 0s96 42 154 0 96 42 154 0" opacity="0.8" />
          <path d="M-20 138c58-42 96 42 154 0s96 42 154 0 96 42 154 0" opacity="0.55" />
          <path d="M-20 184c58-42 96 42 154 0s96 42 154 0 96 42 154 0" opacity="0.35" />
          <path d="M-20 230c58-42 96 42 154 0s96 42 154 0 96 42 154 0" opacity="0.2" />
          <circle cx="232" cy="350" r="42" fill="var(--cover-accent)" opacity="0.14" stroke="none" />
        </g>
      );
    case "orbit":
      return (
        <g fill="none" stroke="var(--cover-accent)">
          <ellipse cx="160" cy="170" rx="118" ry="54" opacity="0.7" transform="rotate(-22 160 170)" />
          <ellipse cx="160" cy="170" rx="88" ry="36" opacity="0.45" transform="rotate(28 160 170)" />
          <circle cx="160" cy="170" r="28" opacity="0.9" />
          <circle cx="250" cy="120" r="6" fill="var(--cover-accent)" stroke="none" />
          <circle cx="82" cy="224" r="4" fill="var(--cover-accent)" stroke="none" opacity="0.7" />
        </g>
      );
    case "grid":
      return (
        <g stroke="var(--cover-accent)">
          <g opacity="0.3">
            {[40, 80, 120, 160, 200, 240, 280].map((x) => (
              <path key={`v-${x}`} d={`M${x} 40v240`} strokeWidth="0.8" />
            ))}
            {[40, 80, 120, 160, 200, 240, 280].map((y) => (
              <path key={`h-${y}`} d={`M30 ${y}h250`} strokeWidth="0.8" />
            ))}
          </g>
          <rect x="84" y="96" width="132" height="132" opacity="0.75" strokeWidth="1.4" />
          <rect x="112" y="124" width="76" height="76" opacity="0.4" strokeWidth="1.2" />
          <circle cx="150" cy="162" r="18" fill="var(--cover-accent)" stroke="none" opacity="0.85" />
        </g>
      );
    case "sun":
      return (
        <g stroke="var(--cover-accent)" fill="none">
          <circle cx="150" cy="166" r="58" opacity="0.9" strokeWidth="1.4" />
          <circle cx="150" cy="166" r="84" opacity="0.35" strokeWidth="1" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 150 + Math.cos(rad) * 96;
            const y1 = 166 + Math.sin(rad) * 96;
            const x2 = 150 + Math.cos(rad) * 124;
            const y2 = 166 + Math.sin(rad) * 124;
            return (
              <path
                key={angle}
                d={`M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`}
                opacity="0.4"
                strokeWidth="1.2"
              />
            );
          })}
        </g>
      );
    case "steps":
      return (
        <g stroke="var(--cover-accent)" fill="none" strokeWidth="1.4">
          <path d="M42 252h54v-42h54v-42h54v-42h54" opacity="0.85" />
          <path d="M42 292h70v-40h54v-40h54v-40h38" opacity="0.45" />
          <path d="M42 332h86v-40h54v-40h54v-40h22" opacity="0.22" />
          <circle cx="234" cy="126" r="5" fill="var(--cover-accent)" stroke="none" />
        </g>
      );
    case "moon":
      return (
        <g stroke="var(--cover-accent)" fill="none">
          <path
            d="M212 94a72 72 0 1 0 20 112 64 64 0 1 1-20-112Z"
            opacity="0.85"
            strokeWidth="1.5"
          />
          <circle cx="112" cy="128" r="4" fill="var(--cover-accent)" stroke="none" opacity="0.8" />
          <circle cx="78" cy="190" r="2.5" fill="var(--cover-accent)" stroke="none" opacity="0.55" />
          <circle cx="138" cy="232" r="3" fill="var(--cover-accent)" stroke="none" opacity="0.65" />
        </g>
      );
    case "stack":
      return (
        <g stroke="var(--cover-accent)" fill="none" strokeWidth="1.4">
          <rect x="68" y="92" width="164" height="28" rx="2" opacity="0.8" />
          <rect x="56" y="128" width="188" height="28" rx="2" opacity="0.55" />
          <rect x="82" y="164" width="136" height="28" rx="2" opacity="0.36" />
          <rect x="102" y="200" width="96" height="28" rx="2" opacity="0.22" />
          <path d="M68 262h164" opacity="0.4" />
        </g>
      );
    case "spiral":
      return (
        <g stroke="var(--cover-accent)" fill="none" strokeWidth="1.5">
          <path
            d="M154 166c0-20 16-36 36-36s36 16 36 36-16 36-36 36h-54c-28 0-50-22-50-50s22-50 50-50h84c38 0 68 30 68 68s-30 68-68 68H92"
            opacity="0.8"
          />
          <circle cx="154" cy="166" r="5" fill="var(--cover-accent)" stroke="none" />
        </g>
      );
    case "arch":
      return (
        <g stroke="var(--cover-accent)" fill="none">
          <path d="M52 274V168a98 98 0 0 1 196 0v106" opacity="0.8" strokeWidth="1.5" />
          <path d="M92 274V174a58 58 0 0 1 116 0v100" opacity="0.5" strokeWidth="1.2" />
          <path d="M132 274v-92a18 18 0 0 1 36 0v92" opacity="0.3" strokeWidth="1.1" />
          <path d="M40 286h220" opacity="0.5" strokeWidth="1.2" />
        </g>
      );
  }
}

export function BookCover({
  book,
  className = "",
}: {
  book: Book;
  className?: string;
}) {
  const style = {
    "--cover-base": book.cover.base,
    "--cover-accent": book.cover.accent,
    "--cover-ink": book.cover.ink,
  } as CSSProperties;

  return (
    <div
      className={`book-cover ${className}`}
      style={style}
      aria-hidden="true"
    >
      <svg
        className="book-cover__art"
        viewBox="0 0 300 480"
        preserveAspectRatio="xMidYMid slice"
      >
        <Motif motif={book.cover.motif} />
      </svg>
      <div className="book-cover__content">
        <span className="book-cover__category">
          {getCategory(book.category).name}
        </span>
        <div>
          <div className="book-cover__title">{book.title}</div>
          <div className="book-cover__rule" />
          <div className="book-cover__author">{book.author}</div>
        </div>
      </div>
    </div>
  );
}
