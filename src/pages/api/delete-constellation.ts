import type { APIRoute } from 'astro';
import { unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { getSessionFromCookie, isEmailAllowed } from '../../lib/auth';

export const prerender = false;

const REPO = 'oephi/tiny-lore';
const BRANCH = 'main';

async function deleteLocal(slug: string) {
  const filePath = join(process.cwd(), 'src', 'content', 'constellations', `${slug}.md`);
  await unlink(filePath);
}

async function deleteFromGitHub(slug: string) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is not set');
  }

  const path = `src/content/constellations/${slug}.md`;
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${path}`;

  // Get current file SHA (required for deletion)
  const existing = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!existing.ok) {
    throw new Error('File not found on GitHub');
  }

  const data = await existing.json();

  const res = await fetch(apiUrl, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Delete constellation: ${slug}`,
      sha: data.sha,
      branch: BRANCH,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || `GitHub API error: ${res.status}`);
  }
}

export const POST: APIRoute = async ({ request }) => {
  const isProd = import.meta.env.PROD;
  if (isProd) {
    const session = getSessionFromCookie(request.headers.get('Cookie'));
    if (!session || !isEmailAllowed(session.email)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  const data = await request.json();
  const { filename } = data;

  if (!filename) {
    return new Response(JSON.stringify({ error: 'Filename is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const slug = filename.replace(/[^a-z0-9-]/gi, '-').toLowerCase();

  try {
    if (isProd) {
      await deleteFromGitHub(slug);
    } else {
      await deleteLocal(slug);
    }
    return new Response(JSON.stringify({ ok: true, slug }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
