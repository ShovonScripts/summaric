export type CategorySlug =
  | "monon"
  | "biggan"
  | "itihas"
  | "byabsa"
  | "sahitya"
  | "monobiggan";

export type CoverMotif =
  | "ripple"
  | "wave"
  | "orbit"
  | "grid"
  | "sun"
  | "steps"
  | "moon"
  | "stack"
  | "spiral"
  | "arch";

export type CoverArt = {
  base: string;
  accent: string;
  ink: string;
  motif: CoverMotif;
};

export type BookStatus = "published" | "draft" | "review";

export type Book = {
  slug: string;
  title: string;
  author: string;
  category: CategorySlug;
  year: number;
  pages: number;
  readTime: number;
  summary: string;
  keyIdeas: string[];
  quote: string;
  cover: CoverArt;
  addedAt: string;
  featured?: boolean;
  status: BookStatus;
  tags: string[];
};

export type Category = {
  slug: CategorySlug;
  name: string;
  blurb: string;
  motif: CoverMotif;
};
