import {redirect} from '@sveltejs/kit';

export const load = async ({cookies}) => {
    const access = cookies.get('access');

    if (!access) {
        redirect(302, '/auth/login');
    }

    const res = await fetch('http://localhost:8000/api/auth/me/', {
    headers: {
        Authorization: `Bearer ${access}`
        }
    });

    if (!res.ok) {
        throw redirect(302, '/auth/login');
    }

    const user = await res.json();
    console.log(user);
    return { user };
}