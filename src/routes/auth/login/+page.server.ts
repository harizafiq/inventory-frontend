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
        const res = await fetch('http://localhost:8000/api/auth/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        if (!res.ok) {
            return fail(res.status, { error: 'Invalid credentials.' });
        }
         const result = await res.json();
        // Store JWT in cookies
        cookies.set('access', result.access, {
            path: '/',
            httpOnly: false, // set to true if using secure tokens
            maxAge: 60 * 60 // 1 hour
        });

        cookies.set('refresh', result.refresh, {
            path: '/',
            httpOnly: false,
            maxAge: 60 * 60 * 24 // 1 day
        });

        // Redirect to dashboard
        redirect(302, '/dashboard');
    }
}