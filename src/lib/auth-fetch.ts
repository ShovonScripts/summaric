"use client";

import { User } from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface AuthError {
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

export interface AuthResponse {
  message: string;
  user: User;
}

async function getCsrfCookie(): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
  await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
    credentials: 'include',
  });
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const error: { message: string; errors?: Record<string, string[]> } = {
      message: data.message || 'An error occurred',
      errors: data.errors,
    };
    throw error;
  }

  return data as T;
}

export async function initializeCsrf(): Promise<void> {
  await getCsrfCookie();
}

export async function register(
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<{ message: string; user: User }> {
  await getCsrfCookie();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });

  return handleResponse(response);
}

export async function login(
  email: string,
  password: string,
  remember = false
): Promise<{ message: string; user: User }> {
  await getCsrfCookie();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, password, remember }),
  });

  return handleResponse(response);
}

export async function logout(): Promise<{ message: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/logout`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    },
  );

  return handleResponse(response);
}

export async function getUser(): Promise<{ user: User }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/user`,
    {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    },
  );

  return handleResponse(response);
}

export function getGoogleAuthUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
  return `${baseUrl}/api/auth/google`;
}

export function getGoogleCallbackUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
  return `${baseUrl}/api/auth/google/callback`;
}

export function isAuthError(error: unknown): error is { message: string; errors?: Record<string, string[]> } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}

export function formatValidationErrors(errors?: Record<string, string[]>): string {
  if (!errors) return '';
  return Object.values(errors).flat().join(', ');
}