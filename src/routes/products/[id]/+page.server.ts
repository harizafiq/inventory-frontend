import { apiFetch } from '$lib/api';
import { error, fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const load = async ({cookies, params, url}) => {
    const id = params.id;
    const inbound_page = url.searchParams.get('inbound_page') || '1';
    const outbound_page = url.searchParams.get('outbound_page') || '1';
    const cycle_page = url.searchParams.get('cycle_page') || '1';
    const pageSize = url.searchParams.get('page_size') || '10';
    const [productRes, inboundRes, outboundRes, cycleCountRes] = await Promise.all([
        apiFetch(`/api/inventory/products/${id}/`, cookies),
        apiFetch(`/api/inventory/inbound/?product=${id}&page=${inbound_page}&page_size=${pageSize}`, cookies),
        apiFetch(`/api/inventory/outbound/?product=${id}&page=${outbound_page}&page_size=${pageSize}`, cookies),
        apiFetch(`/api/inventory/cycle-count/?product=${id}&page=${cycle_page}&page_size=${pageSize}`, cookies),
    ]);
    if (!productRes.ok || !inboundRes.ok || !outboundRes.ok || !cycleCountRes.ok) {
        redirect(302, '/auth/login/');
    }
    const [product, inbound, outbound, cycleCounts] = await Promise.all([
        productRes.json(),
        inboundRes.json(),
        outboundRes.json(),
        cycleCountRes.json()
    ]);
   return {
        product,
        inbound: inbound.results,
        inboundPagination: {
            count: inbound.count,
            next: inbound.next,
            previous: inbound.previous,
            page: Number(inbound_page),
            pageSize: Number(pageSize)
        },
        outbound: outbound.results,
        outboundPagination: {
            count: outbound.count,
            next: outbound.next,
            previous: outbound.previous,
            page: Number(outbound_page),
            pageSize: Number(pageSize)
        },
        cycleCounts: cycleCounts.results,
        cyclePagination: {
            count: cycleCounts.count,
            next: cycleCounts.next,
            previous: cycleCounts.previous,
            page: Number(cycle_page),
            pageSize: Number(pageSize)
        }
    };
}

export const actions = {
    inbound: async ({request, cookies, params}) => {
        const data = await request.formData();
        const product = params.id;
        const quantity = Number(data.get('quantity_in'));
        const notes = data.get('notes_in') || '';

        if (!product || !quantity || isNaN(quantity)) {
            fail(400, { error: 'All fields are required'});
        }

        const errors: Record<string, string> = {};

        if (isNaN(quantity)) {
            errors.quantity = 'Quantity must be a number.';
        } else if (!Number.isInteger(quantity)) {
            errors.quantity = 'Quantity must be a whole number.';
        } else if (quantity < 0) {
            errors.quantity = 'Quantity cannot be negative.';
        }

        if (Object.keys(errors).length > 0) {
            return fail(400, {
                fields: 'quantity_in',
                error: errors
            });
        }

        const res = await apiFetch('/api/inventory/inbound/', 
                cookies, 
                'POST', 
                { product, quantity, notes});

        if (!res.ok) {
            fail(res.status, { error: 'Failed to submit inbound entry'});
        }
        redirect(302, '/products');
    },
    outbound: async ({request, cookies,params}) => {
        const data = await request.formData();
        const product = params.id;
        const quantity = Number(data.get('quantity_out'));
        const notes = data.get('notes_out') || '';

        if (!product || !quantity || isNaN(quantity)) {
            fail(400, { error: 'All fields are required'});
        }

        //check stock first before outbound
        const productRes = await apiFetch(`/api/inventory/products/${product}/`, cookies);
        if (!productRes.ok) {
            redirect(302, '/auth/login/');
        }
        const productValue = await productRes.json();

        const errors: Record<string, string> = {};

        if (isNaN(quantity)) {
            errors.quantity = 'Quantity must be a number.';
        } else if (!Number.isInteger(quantity)) {
            errors.quantity = 'Quantity must be a whole number.';
        } else if (quantity < 0) {
            errors.quantity = 'Quantity cannot be negative.';
        } else if (productValue.quantity < quantity) {
            errors.quantity = 'Cannot outbound more than quantity.';
        }

        if (Object.keys(errors).length > 0) {
            return fail(400, {
                fields: 'quantity_out',
                error: errors
            });
        }
        const res = await apiFetch('/api/inventory/outbound/', 
            cookies, 
            'POST', 
            { product, quantity, notes});

        if (!res.ok) {
            return fail(res.status, { error: 'Failed to submit inbound entry'});
        }

        redirect(302, '/products');
    },
    cycle: async ({ request, cookies, params }) => {
        const data = await request.formData();
        const product = Number(params.id);
        const counted_quantity = Number(data.get('counted_quantity'));
        const notes = data.get('notes_cycle') || '';

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
    },
    delete: async ({params, cookies}) => {
        const id = Number(params.id);
        const res = await apiFetch(`/api/inventory/products/${id}/`, cookies, 'DELETE');
        if (!res.ok) {
            fail(res.status, { error: 'Failed to delete'});
        }
        redirect(302, `/products/`);
    },
    edit: async ({request, params, cookies})=> {
        const id =  Number(params.id);
        const data = await request.formData();
        const name = data.get('name');
        const sku = data.get('sku');
        const description = data.get('description');
        const res = await apiFetch(`/api/inventory/products/${id}/`, cookies, 'PATCH', {
            name,
            sku,
            description
        });

        if (!res.ok) {
            fail(res.status, {error: 'Got error update'});
        }
        redirect(302, `/products/${id}`);
    }
}