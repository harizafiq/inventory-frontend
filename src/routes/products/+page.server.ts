import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies, fetch }) => {
  const access = cookies.get('access');

  if (!access) {
    redirect(302, '/auth/login');
  }

  const res = await fetch('http://localhost:8000/api/inventory/products/', {
    headers: {
      Authorization: `Bearer ${access}`
    }
  });

  if (!res.ok) {
    redirect(302, '/auth/login');
  }

  const products = await res.json();

  return { products };
};
