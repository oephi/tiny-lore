import type { APIRoute } from 'astro';
import { createUserSessionToken, userSessionCookie } from '../../../lib/auth';
import { getOrigin, exchangeCode, fetchGoogleUser } from '../../../lib/oauth';
import { d1Query } from '../../../lib/d1';
import { randomUUID } from 'node:crypto';

export const prerender = false;

// Google OAuth callback for listeners.
// Exchanges the auth code for user info, upserts the user in D1, and sets a session cookie.
export const GET: APIRoute = async ({ request, url }) => {
  const params = new URL(request.url).searchParams;
  const code = params.get('code');
  const state = params.get('state') || '';

  if (!code) {
    return new Response('Missing authorization code', { status: 400 });
  }

  // Extract return URL from state
  const stateparts = state.split(':');
  let returnTo = '/constellations';
  if (stateparts.length >= 2) {
    try {
      returnTo = Buffer.from(stateparts.slice(1).join(':'), 'base64url').toString();
    } catch { /* use default */ }
  }

  const clientId = import.meta.env.GOOGLE_CLIENT_ID;
  const clientSecret = import.meta.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return new Response('Google OAuth not configured', { status: 500 });
  }

  const redirectUri = `${getOrigin(url)}/api/user/callback`;

  let access_token: string;
  try {
    ({ access_token } = await exchangeCode(code, clientId, clientSecret, redirectUri));
  } catch (err) {
    return new Response(String(err), { status: 500 });
  }

  let email: string;
  let name: string | undefined;
  try {
    ({ email, name } = await fetchGoogleUser(access_token));
  } catch (err) {
    return new Response(String(err), { status: 500 });
  }

  if (!email) {
    return new Response('No email returned from Google', { status: 400 });
  }

  // Upsert user in D1 — insert if new, update name if existing
  const existingResult = await d1Query(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  let userId: string;

  if (existingResult.results.length > 0) {
    userId = existingResult.results[0].id as string;
    await d1Query('UPDATE users SET name = ? WHERE id = ?', [name || null, userId]);
  } else {
    userId = randomUUID();
    await d1Query(
      'INSERT INTO users (id, email, name) VALUES (?, ?, ?)',
      [userId, email, name || null]
    );
  }

  // Use location.replace() instead of 302 so the OAuth flow doesn't stay in browser history
  const token = createUserSessionToken(userId, email);
  const safeReturnTo = returnTo.replace(/'/g, "\\'");

  return new Response(
    `<!DOCTYPE html><html><head><script>window.location.replace('${safeReturnTo}');</script></head><body></body></html>`,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Set-Cookie': userSessionCookie(token),
      },
    },
  );
};
