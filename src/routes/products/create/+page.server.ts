import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({cookies, request}) => {

        const access = cookies.get('access');
        if (!access) {
            redirect(302, '/auth/login');
        }

        const data = await request.formData();
        const name = data.get('name');
        const sku = data.get('sku');
        const description = data.get('description');
        const quantityRaw = data.get('quantity');
        const quantity = quantityRaw ? parseInt(String(quantityRaw)) : NaN;

        if (!name || !sku || isNaN(quantity)) {
            console.log('masuk');
            return fail(400, {
                error: 'Please fill in all fields correctly.',
                values: { name, sku, description, quantityRaw }
            });
        } else {
            const payload = {
                name: name,
                sku: sku,
                description: description,
                quantity: quantity
            };
            const res = await fetch('http://localhost:8000/api/inventory/products/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access}`
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                fail(res.status, { error: 'Failed to create product' });
            }

            // Redirect back to product list
            redirect(302, '/products');
        }
    }
}