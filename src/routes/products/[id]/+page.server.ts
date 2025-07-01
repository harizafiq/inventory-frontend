import { redirect } from '@sveltejs/kit';
import { error } from 'console';

export const load = async ({cookies, params}) => {
    const access = cookies.get('access');
    const id = params.id;
    if (!access) {
        redirect(302, '/auth/login');
    }
    const res = await fetch(`http://localhost:8000/api/inventory/products/${id}`, {
        headers: {
        Authorization: `Bearer ${access}`
        }
    });
    if (!res.ok) {
        error(404, 'Product not exist');
    }
    const product = await res.json();
    return {product};
}