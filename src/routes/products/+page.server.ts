import { apiFetch } from '$lib/api.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies, url }) => {
  const page = url.searchParams.get('page') || '1';
  const pageSize = url.searchParams.get('page_size') || '10';
  const res = await apiFetch(`/api/inventory/products/?page=${page}&page_size=${pageSize}`, cookies);

  if (!res.ok) {
    redirect(302, '/auth/login/');
  }

  const products = await res.json();
  return { 
    products: products.results, // for the array of object if using pagination
    count: products.count,
    next: products.next,
    previous: products.previous,
    page: Number(page),
    pageSize: Number(pageSize)
  };
};
