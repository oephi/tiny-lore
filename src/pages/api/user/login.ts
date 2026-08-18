import type { APIRoute } from 'astro';
import { generateState } from '../../../lib/auth';

export const prerender = false;

// Redirects to Google OAuth. Uses a separate callback URL from the editor auth.
// Accepts an optional ?redirect query param to return the user to the page they came from.
export const GET: APIRoute = async ({ redirect, url }) => {
  const clientId = import.meta.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return new Response('Google OAuth not configured', { status: 500 });
  }

  // Encode the return URL in the state param so we can redirect back after login
  const returnTo = url.searchParams.get('redirect') || '/constellations';
  const state = generateState() + ':' + Buffer.from(returnTo).toString('base64url');
  const origin = import.meta.env.PROD ? url.origin.replace('http://', 'https://') : url.origin;
  const redirectUri = `${origin}/api/user/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'online',
    prompt: 'select_account',
  });

  // Use location.replace() so Google's auth page replaces this route in history
  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  return new Response(
    `<!DOCTYPE html><html><head><script>window.location.replace('${googleUrl}');</script></head><body></body></html>`,
    {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    },
  );
};
