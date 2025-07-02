import { redirect } from '@sveltejs/kit';

export const load = async ({cookies}) => {
    cookies.delete('access', {path: '/'});
    cookies.delete('refresh', {path: '/'});
    redirect(302, '/auth/login');
}