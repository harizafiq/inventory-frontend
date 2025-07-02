import { apiFetch } from '$lib/api';
import {fail, redirect} from '@sveltejs/kit';

export const actions = {
    default: async ({cookies, request}) => {
        const data = await request.formData();
        const username = data.get('username');
        const password = data.get('password');
        if (!username || !password) {
            return fail(400, { error: 'Username and password are required.' });
        }

        // Call Django backend login
        const res = await apiFetch('/api/auth/login/', cookies, 'POST', { username, password });
        if (!res.ok) {
            return fail(res.status, { error: 'Invalid credentials.' });
        }
        const result = await res.json();
        // Store JWT in cookies
        cookies.set('access', result.access, {
            path: '/', //cookie global
            httpOnly: false, // set to true if using secure tokens
            maxAge: 60 * 5, // set to 5 minute (60s * 5s)
            secure: false // set to true if only https allow
        });

        cookies.set('refresh', result.refresh, {
            path: '/', //cookie global
            httpOnly: false, // set to true if using secure tokens
            maxAge: 60 * 60 * 24 * 7, // set to 7 day
            secure: false // set to true if only https allow
        });

        // Redirect to dashboard
        redirect(302, '/dashboard');
    }
}