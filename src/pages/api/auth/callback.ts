import type { APIRoute } from 'astro';
import { createSessionToken, isEmailAllowed, sessionCookie } from '../../../lib/auth';
import { getOrigin, exchangeCode, fetchGoogleUser } from '../../../lib/oauth';

export const prerender = false;

export const GET: APIRoute = async ({ request, redirect, url }) => {
  const params = new URL(request.url).searchParams;
  const code = params.get('code');

  if (!code) {
    return new Response('Missing authorization code', { status: 400 });
  }

  const clientId = import.meta.env.GOOGLE_CLIENT_ID;
  const clientSecret = import.meta.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return new Response('Google OAuth not configured', { status: 500 });
  }

  const redirectUri = `${getOrigin(url)}/api/auth/callback`;

  let access_token: string;
  try {
    ({ access_token } = await exchangeCode(code, clientId, clientSecret, redirectUri));
  } catch (err) {
    return new Response(String(err), { status: 500 });
  }

  let email: string;
  try {
    ({ email } = await fetchGoogleUser(access_token));
  } catch (err) {
    return new Response(String(err), { status: 500 });
  }

  if (!email || !isEmailAllowed(email)) {
    return new Response(
      `<html><body style="background:#072e2c;color:#f5efe0;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
        <div style="text-align:center">
          <h1 style="font-size:1.2rem;color:#c9a84c">Access Denied</h1>
          <p style="opacity:0.6;font-size:0.9rem">${email} is not authorized to use the editor.</p>
          <a href="/" style="color:#c9a84c;font-size:0.8rem">Return home</a>
        </div>
      </body></html>`,
      { status: 403, headers: { 'Content-Type': 'text/html' } }
    );
  }

  const token = createSessionToken(email);

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/editor',
      'Set-Cookie': sessionCookie(token),
    },
  });
};
