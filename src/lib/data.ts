import type { Book, Category, BooksResponse, CategoriesResponse, BookDetailResponse, CategoryDetailResponse } from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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

export async function getBooks(params?: {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  per_page?: number;
}): Promise<BooksResponse> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.set('search', params.search);
  if (params?.category) searchParams.set('category', params.category);
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.per_page) searchParams.set('per_page', params.per_page.toString());

  const query = searchParams.toString();
  return fetchApi<BooksResponse>(`/books${query ? `?${query}` : ''}`);
}

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

export async function getCategories(): Promise<Category[]> {
  const response = await fetchApi<CategoriesResponse>('/categories');
  return response.data;
}

export async function getCategory(slug: string): Promise<Category | null> {
  try {
    const response = await fetchApi<CategoryDetailResponse>(`/categories/${slug}`);
    return response.data;
  } catch {
    return null;
  }
}

export async function getPublishedBooksCount(): Promise<number> {
  const response = await fetchApi<BooksResponse>('/books?per_page=1');
  return response.meta.total;
}

export async function getAllPublishedBooks(): Promise<Book[]> {
  const response = await fetchApi<BooksResponse>('/books?per_page=100');
  return response.data;
}