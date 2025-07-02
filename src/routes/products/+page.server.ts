import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies, url }) => {
  const access = cookies.get('access');

  if (!access) {
    redirect(302, '/auth/login');
  }

  const page = url.searchParams.get('page') || '1';
  const pageSize = url.searchParams.get('page_size') || '10';
  const res = await fetch(`http://localhost:8000/api/inventory/products/?page=${page}&page_size=${pageSize}`, {
    headers: {
      Authorization: `Bearer ${access}`
    }
  });

  if (!res.ok) {
    redirect(302, '/auth/login');
  }

  const products = await res.json();
  console.log(products);
  return { 
    products: products.results, // for the array of object if using pagination
    count: products.count,
    next: products.next,
    previous: products.previous,
    page: Number(page),
    pageSize: Number(pageSize)
  };
};
