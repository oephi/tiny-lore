// Shared OAuth helpers used by both editor (/api/auth) and listener (/api/user) auth flows.

/** Build the origin, forcing https in production (Vercel proxy reports http). */
export function getOrigin(url: URL): string {
  return import.meta.env.PROD ? url.origin.replace('http://', 'https://') : url.origin;
}

/** Exchange an OAuth authorization code for an access token. */
export async function exchangeCode(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
): Promise<{ access_token: string }> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
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

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to exchange authorization code: ${body}`);
  }

  return res.json();
}

/** Fetch user info (email, name) from Google using an access token. */
export async function fetchGoogleUser(accessToken: string): Promise<{ email: string; name?: string }> {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error('Failed to get user info');
  }

  return res.json();
}
