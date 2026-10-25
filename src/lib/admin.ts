import type {
  Book,
  BookSort,
  BookStatus,
  Category,
  CoverMotif,
} from "@/lib/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface AdminError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface AdminBook extends Book {
  id: number;
  category_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface AdminBookPayload {
  slug: string;
  title: string;
  author: string;
  category_id: number;
  year: number | null;
  pages: number | null;
  read_time: number | null;
  summary: string | null;
  key_ideas: string[];
  quote: string | null;
  cover: {
    base: string;
    accent: string;
    ink: string;
    motif: CoverMotif;
  } | null;
  added_at: string | null;
  featured: boolean;
  status: BookStatus;
  tags: string[];
}

export interface AdminCategory extends Category {
  id: number;
  books_count: number;
}

export interface AdminCategoryPayload {
  slug: string;
  name: string;
  blurb: string;
  motif: CoverMotif;
}

export interface AdminStats {
  total: number;
  published: number;
  draft: number;
  review: number;
  categories: number;
  featured: number;
}

export interface AdminDashboard {
  stats: AdminStats;
  recent_books: AdminBook[];
}

export interface AdminBooksResponse {
  data: AdminBook[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}

export interface AdminListParams {
  status?: BookStatus | "all";
  search?: string;
  category?: string;
  page?: number;
  per_page?: number;
  sort?: BookSort;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error: AdminError = {
      message: data?.message || "অনুরোধ ব্যর্থ হয়েছে।",
      errors: data?.errors,
    };
    throw error;
  }

  return data as T;
}

export function isAdminError(error: unknown): error is AdminError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  );
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  const response = await request<{ data: AdminDashboard }>("/admin/stats");
  return response.data;
}

export async function getAdminBooks(
  params: AdminListParams = {},
): Promise<AdminBooksResponse> {
  const searchParams = new URLSearchParams();
  if (params.status && params.status !== "all") {
    searchParams.set("status", params.status);
  }
  if (params.search) searchParams.set("search", params.search);
  if (params.category) searchParams.set("category", params.category);
  if (params.page) searchParams.set("page", params.page.toString());
  searchParams.set("per_page", (params.per_page ?? 20).toString());

  return request<AdminBooksResponse>(`/admin/books?${searchParams.toString()}`);
}

export async function getAdminBook(id: number | string): Promise<AdminBook> {
  const response = await request<{ data: AdminBook }>(`/admin/books/${id}`);
  return response.data;
}

export async function createAdminBook(
  payload: AdminBookPayload,
): Promise<AdminBook> {
  const response = await request<{ data: AdminBook }>("/admin/books", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateAdminBook(
  id: number | string,
  payload: AdminBookPayload,
): Promise<AdminBook> {
  const response = await request<{ data: AdminBook }>(`/admin/books/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function deleteAdminBook(id: number | string): Promise<void> {
  await request<{ message: string }>(`/admin/books/${id}`, {
    method: "DELETE",
  });
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const response = await request<{ data: AdminCategory[] }>(
    "/admin/categories",
  );
  return response.data;
}

export async function createAdminCategory(
  payload: AdminCategoryPayload,
): Promise<AdminCategory> {
  const response = await request<{ data: AdminCategory }>("/admin/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateAdminCategory(
  slug: string,
  payload: AdminCategoryPayload,
): Promise<AdminCategory> {
  const response = await request<{ data: AdminCategory }>(
    `/admin/categories/${slug}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}

export async function deleteAdminCategory(slug: string): Promise<void> {
  await request<{ message: string }>(`/admin/categories/${slug}`, {
    method: "DELETE",
  });
}
