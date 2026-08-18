import type { APIRoute } from 'astro';
import { createUserSessionToken, userSessionCookie } from '../../../lib/auth';
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

  // Build redirect_uri — Vercel may report http behind its proxy, force https in production
  const origin = url.origin.replace('http://', 'https://');
  const redirectUri = `${origin}/api/user/callback`;

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenRes.ok) {
    const errBody = await tokenRes.text();
    return new Response(`Failed to exchange authorization code: ${errBody}`, { status: 500 });
  }

  const { access_token } = await tokenRes.json();

  // Get user info from Google
  const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!userRes.ok) {
    return new Response('Failed to get user info', { status: 500 });
  }

  const { email, name } = await userRes.json();

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
    // Update name in case it changed
    await d1Query('UPDATE users SET name = ? WHERE id = ?', [name || null, userId]);
  } else {
    userId = randomUUID();
    await d1Query(
      'INSERT INTO users (id, email, name) VALUES (?, ?, ?)',
      [userId, email, name || null]
    );
  }

  // Create session and redirect back
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
