const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface GoogleOAuthConfig {
  client_id: string;
  redirect_uri: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error: ErrorResponse = {
        message: data.message || 'An error occurred',
        errors: data.errors,
      };
      throw error;
    }

    return data as T;
  }

  async getCsrfCookie(): Promise<void> {
    await fetch(`${this.baseUrl.replace('/api', '')}/sanctum/csrf-cookie`, {
      credentials: 'include',
    });
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/logout', {
      method: 'POST',
    });
  }

  async getUser(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/user');
  }

  async getGoogleAuthUrl(): Promise<string> {
    return `${this.baseUrl.replace('/api', '')}/api/auth/google`;
  }
}

export const api = new ApiClient();

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}