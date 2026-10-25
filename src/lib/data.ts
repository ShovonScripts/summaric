import { cache } from "react";
import type {
  Book,
  BookSort,
  BooksResponse,
  CategoriesResponse,
  Category,
  CategoryDetailResponse,
  BookDetailResponse,
} from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const DEFAULT_PER_PAGE = 12;

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    next: { revalidate: 60 },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  return data as T;
}

export interface GetBooksParams {
  search?: string;
  category?: string;
  sort?: BookSort;
  page?: number;
  per_page?: number;
}

export const getBooks = cache(
  async (params: GetBooksParams = {}): Promise<BooksResponse> => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set('search', params.search);
    if (params.category) searchParams.set('category', params.category);
    if (params.sort) searchParams.set('sort', params.sort);
    if (params.page) searchParams.set('page', params.page.toString());
    searchParams.set(
      'per_page',
      (params.per_page ?? DEFAULT_PER_PAGE).toString(),
    );

    return fetchApi<BooksResponse>(`/books?${searchParams.toString()}`);
  },
);

export async function getFeaturedBook(): Promise<Book | null> {
  const response = await fetchApi<{ data: Book[] }>('/books/featured');
  return response.data[0] ?? null;
}

export async function getBook(slug: string): Promise<Book | null> {
  try {
    const response = await fetchApi<BookDetailResponse>(`/books/${slug}`);
    return response.data;
  } catch {
    return null;
  }
}

export const getCategories = cache(async (): Promise<Category[]> => {
  const response = await fetchApi<CategoriesResponse>('/categories');
  return response.data;
});

export async function getCategory(slug: string): Promise<Category | null> {
  try {
    const response = await fetchApi<CategoryDetailResponse>(`/categories/${slug}`);
    return response.data;
  } catch {
    return null;
  }
}

export const getPublishedBooksCount = cache(async (): Promise<number> => {
  const response = await fetchApi<BooksResponse>('/books?per_page=1');
  return response.meta.total;
});

export const getAllPublishedBooks = cache(async (): Promise<Book[]> => {
  const response = await fetchApi<BooksResponse>('/books?per_page=50');
  return response.data;
});
