import type { APIRoute } from 'astro';
import { clearUserSessionCookie } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/constellations',
      'Set-Cookie': clearUserSessionCookie(),
    },
  });
};
