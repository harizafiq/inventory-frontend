import {redirect} from '@sveltejs/kit';

export const load = async ({cookies}) => {
    const access = cookies.get('access');

    if (!access) {
        redirect(302, '/auth/login');
    }

    const [userRes,summaryRes] = await Promise.all([
        fetch('http://localhost:8000/api/auth/me/', {
        headers: {
            Authorization: `Bearer ${access}`
            }
        }),
        fetch('http://localhost:8000/api/inventory/summary/', {
        headers: {
            Authorization: `Bearer ${access}`
            }
        })
    ]);

    if (!userRes.ok || !summaryRes.ok) {
        redirect(302, '/auth/login');
    }
    return { 
        user: await userRes.json(),
        summary: await summaryRes.json()
     };
}