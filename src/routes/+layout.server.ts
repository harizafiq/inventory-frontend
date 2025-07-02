import { apiFetch } from '$lib/api.js';

export const load = async({cookies}) => {
    const res = await apiFetch('/api/auth/me/', cookies);
    if (!res.ok) {
        console.log('[Retry] Status:', res.status);
        return { isAuthenticated: false }
    }
    const user = await res.json();
    console.log(user);
    return {
        isAuthenticated: Boolean(cookies.get('access')),
        user
    }
}