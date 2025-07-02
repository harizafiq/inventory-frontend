import { apiFetch } from '$lib/api';
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
    const res = await apiFetch('/api/inventory/audit-log/', cookies);
    if (!res.ok) {
        redirect(302, '/auth/login');
    }
    const logs = await res.json();
    if (!res.ok) {
        redirect(302, '/auth/login');
    }
    return { logs };
};
