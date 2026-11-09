// All calls to the NestJS backend live here.
import type { Category, Order, Product } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // NestJS errors look like: { statusCode, message, error }
    const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
    throw new Error(message ?? `Request failed (${res.status})`);
  }
  return data as T;
}

export const api = {
  getCategories: () => request<Category[]>('/categories'),
  getProducts: () => request<Product[]>('/products'),
  getOrders: () => request<Order[]>('/orders'),
  checkout: (items: { productId: number; quantity: number }[]) =>
    request<Order>('/checkout', { method: 'POST', body: JSON.stringify({ items }) }),
};

// 15000 → "15,000 ₭"
export const formatKip = (amount: number) => `${amount.toLocaleString('en-US')} ₭`;
