import { apiFetch } from '$lib/api';
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies, url }) => {
    const page = url.searchParams.get('page') || '1';
    const pageSize = url.searchParams.get('page_size') || '10';
    const res = await apiFetch(`/api/inventory/audit-log/?page=${page}&page_size=${pageSize}`, cookies);
    if (!res.ok) {
        redirect(302, '/auth/login/');
    }
    const logs = await res.json();
    console.log(logs);
    return { 
        logs: logs.results, // for the array of object if using pagination
        count: logs.count,
        next: logs.next,
        previous: logs.previous,
        page: Number(page),
        pageSize: Number(pageSize)
    };
};
