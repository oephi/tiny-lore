import type { APIRoute } from 'astro';
import { generateState } from '../../../lib/auth';
import { getOrigin } from '../../../lib/oauth';

export const prerender = false;

export const GET: APIRoute = async ({ redirect, url }) => {
  const clientId = import.meta.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return new Response('Google OAuth not configured', { status: 500 });
  }

  const state = generateState();
  const redirectUri = `${getOrigin(url)}/api/auth/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email',
    state,
    access_type: 'online',
    prompt: 'select_account',
  });

  return redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
};
