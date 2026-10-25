import type { CoverMotif } from "@/types/book";

export function CategoryGlyph({ motif }: { motif: CoverMotif }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      viewBox="0 0 40 40"
      className="size-10 shrink-0 text-gold-ink"
      aria-hidden="true"
      focusable="false"
    >
      {motif === "orbit" ? (
        <g {...common}>
          <ellipse cx="20" cy="20" rx="14" ry="6.5" transform="rotate(-24 20 20)" />
          <ellipse cx="20" cy="20" rx="14" ry="6.5" transform="rotate(34 20 20)" opacity="0.5" />
          <circle cx="20" cy="20" r="3.5" />
        </g>
      ) : null}
      {motif === "grid" ? (
        <g {...common}>
          <path d="M8 8h24v24H8z" />
          <path d="M8 16h24M8 24h24M16 8v24M24 8v24" opacity="0.55" />
          <circle cx="20" cy="20" r="2.2" fill="currentColor" stroke="none" />
        </g>
      ) : null}
      {motif === "wave" ? (
        <g {...common}>
          <path d="M4 14c5-5 8 5 13 0s8 5 13 0 8 5 13 0" transform="translate(-3 0)" />
          <path d="M4 21c5-5 8 5 13 0s8 5 13 0 8 5 13 0" opacity="0.65" transform="translate(-3 0)" />
          <path d="M4 28c5-5 8 5 13 0s8 5 13 0 8 5 13 0" opacity="0.35" transform="translate(-3 0)" />
        </g>
      ) : null}
      {motif === "steps" ? (
        <g {...common}>
          <path d="M6 30h8v-7h8v-7h8v-7h5" />
          <path d="M6 35h13v-7h8v-7h8" opacity="0.45" />
        </g>
      ) : null}
      {motif === "sun" ? (
        <g {...common}>
          <circle cx="20" cy="20" r="7" />
          <path d="M20 5v4M20 31v4M5 20h4M31 20h4M9.4 9.4l2.8 2.8M27.8 27.8l2.8 2.8M9.4 30.6l2.8-2.8M27.8 12.2l2.8-2.8" />
        </g>
      ) : null}
      {motif === "ripple" ? (
        <g {...common}>
          <circle cx="20" cy="20" r="3" />
          <circle cx="20" cy="20" r="8" opacity="0.7" />
          <circle cx="20" cy="20" r="13" opacity="0.42" />
          <circle cx="20" cy="20" r="18" opacity="0.2" />
        </g>
      ) : null}
      {motif === "moon" ? (
        <g {...common}>
          <path d="M27 8a13 13 0 1 0 5 20 14 14 0 0 1-5-20Z" />
          <circle cx="13" cy="12" r="1.5" fill="currentColor" stroke="none" />
        </g>
      ) : null}
      {motif === "stack" ? (
        <g {...common}>
          <path d="M9 10h22v5H9zM6 18h28v5H6zM11 26h18v5H11z" />
        </g>
      ) : null}
      {motif === "spiral" ? (
        <g {...common}>
          <path d="M20 20a5 5 0 1 1 5 5h-8a8 8 0 1 1 8-8h8a12 12 0 1 0-12 12" />
        </g>
      ) : null}
      {motif === "arch" ? (
        <g {...common}>
          <path d="M7 33V20a13 13 0 0 1 26 0v13" />
          <path d="M14 33V21a6 6 0 0 1 12 0v12" opacity="0.55" />
          <path d="M5 35h30" opacity="0.45" />
        </g>
      ) : null}
    </svg>
  );
}
