import type { APIRoute } from 'astro';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { requireEditorAuth } from '../../lib/auth';
import { GITHUB_REPO, GITHUB_BRANCH } from '../../lib/github';

export const prerender = false;

async function saveLocal(filename: string, buffer: Buffer) {
  const dir = join(process.cwd(), 'public', 'images', 'constellations');
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, filename), buffer);
}

async function saveToGitHub(filename: string, base64: string) {
  const token = import.meta.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN not set');

  const path = `public/images/constellations/${filename}`;
  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`;

  // Check if file exists (need SHA to update)
  let sha: string | undefined;
  const existing = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
  if (existing.ok) {
    const data = await existing.json();
    sha = data.sha;
  }

  const body: Record<string, string> = {
    message: `Upload image: ${filename}`,
    content: base64,
    branch: GITHUB_BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || `GitHub API error: ${res.status}`);
  }
}

export const POST: APIRoute = async ({ request }) => {
  if (!requireEditorAuth(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Sanitize filename
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const name = (formData.get('name') as string || file.name.replace(/\.[^.]+$/, ''))
    .replace(/[^a-z0-9-]/gi, '-')
    .toLowerCase();
  const filename = `${name}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');

  try {
    if (import.meta.env.PROD) {
      await saveToGitHub(filename, base64);
    } else {
      await saveLocal(filename, buffer);
    }

    const url = `/images/constellations/${filename}`;
    return new Response(JSON.stringify({ ok: true, url }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
