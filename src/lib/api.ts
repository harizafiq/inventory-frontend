import { redirect } from "@sveltejs/kit";

// src/lib/api.ts
const baseURL = import.meta.env.VITE_PUBLIC_API_BASE;
console.log(baseURL);
export async function apiFetch(
  endpoint: string,
  cookies: any,
  method = 'GET',
  body: any = null
) {
  let access = cookies.get('access');
  const refresh = cookies.get('refresh');
console.log(`${baseURL}${endpoint}`);
  let res = await fetch(`${baseURL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${access}`,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (res.status === 401 && refresh) {
    const refreshRes = await fetch(`${baseURL}/api/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh })
    });

    if (refreshRes.ok) {
        const data = await refreshRes.json();
        access = data.access;
        cookies.set('access', access, {
            path: '/', //cookie global
            httpOnly: false, // set to true if using secure tokens
            maxAge: 60 * 60, // set to 1 hour (60s * 60s)
            secure: false // set to true if only https allow
        });

      // Retry original request
      res = await fetch(`${baseURL}${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${access}`,
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
      });
    } else {
      cookies.delete('access', {path: '/'});
      cookies.delete('refresh', {path: '/'});
    }
  }

  return res;
}
