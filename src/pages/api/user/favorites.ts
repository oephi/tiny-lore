import type { APIRoute } from 'astro';
import { getUserSessionFromCookie } from '../../../lib/auth';
import { d1Query } from '../../../lib/d1';

export const prerender = false;

// GET /api/user/favorites — returns the logged-in user's favorites list
export const GET: APIRoute = async ({ request }) => {
  const session = getUserSessionFromCookie(request.headers.get('Cookie'));
  if (!session) {
    return new Response(JSON.stringify({ favorites: [], loggedIn: false }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = await d1Query(
    'SELECT track_id, created_at FROM favorites WHERE user_id = ? ORDER BY created_at DESC',
    [session.userId]
  );

  return new Response(JSON.stringify({
    favorites: result.results.map(r => r.track_id),
    loggedIn: true,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

// POST /api/user/favorites — toggle a favorite (add or remove)
// Body: { trackId: string }
export const POST: APIRoute = async ({ request }) => {
  const session = getUserSessionFromCookie(request.headers.get('Cookie'));
  if (!session) {
    return new Response(JSON.stringify({ error: 'Not logged in' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { trackId } = await request.json();
  if (!trackId) {
    return new Response(JSON.stringify({ error: 'trackId is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check if already favorited
  const existing = await d1Query(
    'SELECT 1 FROM favorites WHERE user_id = ? AND track_id = ?',
    [session.userId, trackId]
  );

  if (existing.results.length > 0) {
    // Remove favorite
    await d1Query(
      'DELETE FROM favorites WHERE user_id = ? AND track_id = ?',
      [session.userId, trackId]
    );
    return new Response(JSON.stringify({ favorited: false }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    // Add favorite
    await d1Query(
      'INSERT INTO favorites (user_id, track_id) VALUES (?, ?)',
      [session.userId, trackId]
    );
    return new Response(JSON.stringify({ favorited: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
