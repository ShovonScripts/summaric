import type { Category, CategorySlug } from "@/types/book";

export const CATEGORIES: Category[] = [
  {
    slug: "monon",
    name: "মনন ও দর্শন",
    blurb: "জীবন, নৈতিকতা আর অর্থ খোঁজার বই।",
    motif: "orbit",
  },
  {
    slug: "biggan",
    name: "বিজ্ঞান ও প্রযুক্তি",
    blurb: "জগৎ ও যন্ত্র কীভাবে কাজ করে।",
    motif: "grid",
  },
  {
    slug: "itihas",
    name: "ইতিহাস ও সমাজ",
    blurb: "অতীত আর মানুষের চলার পথ।",
    motif: "wave",
  },
  {
    slug: "byabsa",
    name: "ব্যবসা ও নেতৃত্ব",
    blurb: "কাজ, সিদ্ধান্ত আর মানুষ চালানোর শিল্প।",
    motif: "steps",
  },
  {
    slug: "sahitya",
    name: "সাহিত্য ও জীবন",
    blurb: "গল্পে আর কবিতায় জীবনের ছায়া।",
    motif: "sun",
  },
  {
    slug: "monobiggan",
    name: "মনোবিজ্ঞান",
    blurb: "মন, অভ্যাস আর সম্পর্কের ভেতরকার কথা।",
    motif: "ripple",
  },
];

export const CATEGORY_BY_SLUG = Object.fromEntries(
  CATEGORIES.map((category) => [category.slug, category]),
) as Record<CategorySlug, Category>;

export function getCategory(slug: CategorySlug) {
  return CATEGORY_BY_SLUG[slug];
}
