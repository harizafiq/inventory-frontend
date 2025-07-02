import { apiFetch } from '$lib/api';
import { error, fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const load = async ({cookies, params}) => {
    const access = cookies.get('access');
    const id = params.id;
    if (!access) {
        redirect(302, '/auth/login');
    }
    const [productRes, inboundRes, outboundRes, cycleCountRes] = await Promise.all([
            fetch(`http://localhost:8000/api/inventory/products/${id}/`, {
            headers: { Authorization: `Bearer ${access}` }
        }),
        fetch(`http://localhost:8000/api/inventory/inbound/?product=${id}`, {
            headers: { Authorization: `Bearer ${access}` }
        }),
        fetch(`http://localhost:8000/api/inventory/outbound/?product=${id}`, {
            headers: { Authorization: `Bearer ${access}` }
        }),
        fetch(`http://localhost:8000/api/inventory/cycle-count/?product=${id}`,
        {
            headers: {
            Authorization: `Bearer ${access}`
            }
        })
    ]);
    if (!productRes.ok) {
        error(404, 'Product not exist');
    }
    return {
        product: await productRes.json(),
        inbound: await inboundRes.json(),
        outbound: await outboundRes.json(),
        cycleCounts: await cycleCountRes.json()
    };
}

export const actions = {
    inbound: async ({request, cookies, params}) => {
        const access = cookies.get('access');
        if (!access) {
            redirect(302, '/auth/login');
        }
        const data = await request.formData();
        const product = params.id;
        const quantity = Number(data.get('quantity'));
        const notes = data.get('notes') || '';

        if (!product || !quantity || isNaN(quantity)) {
            fail(400, { error: 'All fields are required'});
        }

        const res = await fetch('http://localhost:8000/api/inventory/inbound/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access}`
            },
            body: JSON.stringify({product, quantity, notes})
        });

        if (!res.ok) {
            fail(res.status, { error: 'Failed to submit inbound entry'});
        }

        redirect(302, '/products');
    },
    outbound: async ({request, cookies,params}) => {
        const access = cookies.get('access');

        const data = await request.formData();
        const product = params.id;
        const quantity = Number(data.get('quantity'));
        const notes = data.get('notes') || '';

        if (!product || !quantity || isNaN(quantity)) {
            fail(400, { error: 'All fields are required'});
        }

        const res = await fetch('http://localhost:8000/api/inventory/outbound/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access}`
            },
            body: JSON.stringify({product, quantity, notes})
        });

        if (!res.ok) {
            fail(res.status, { error: 'Failed to submit inbound entry'});
        }

        redirect(302, '/products');
    },
    cycle: async ({ request, cookies, params }) => {
        const access = cookies.get('access');
        if (!access) redirect(302, '/auth/login');

        const data = await request.formData();
        const product = Number(params.id);
        const counted_quantity = Number(data.get('counted_quantity'));
        const notes = data.get('notes') || '';

        if (!product || isNaN(counted_quantity)) {
            fail(400, { error: 'Invalid input' });
        }

        const res = await apiFetch('/api/inventory/cycle-count/', cookies, 'POST', {
        product,
        counted_quantity,
        notes
        });

        if (!res.ok) {
            fail(res.status, { error: 'Cycle count failed' });
        }

        redirect(302, `/products/${product}`);
    }
}