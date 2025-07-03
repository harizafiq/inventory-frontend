import { apiFetch } from '$lib/api.js';
import {redirect} from '@sveltejs/kit';

export const load = async ({cookies}) => {
    const [userRes,summaryRes] = await Promise.all([
        apiFetch('/api/auth/me/', cookies),
        apiFetch('/api/inventory/summary/', cookies),
    ]);

    if (!userRes.ok || !summaryRes.ok) {
        redirect(302, '/auth/login/');
    }
    return { 
        user: await userRes.json(),
        summary: await summaryRes.json()
     };
}