import type { APIRoute } from 'astro';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getSessionFromCookie, isEmailAllowed } from '../../lib/auth';

export const prerender = false;

const REPO = 'oephi/tiny-lore';
const BRANCH = 'main';

function buildMarkdown(data: {
  name: string;
  subtitle: string;
  color: string;
  center: { x: number; y: number };
  stars: { x: number; y: number }[];
  lines: { from: number; to: number }[];
  story: string;
}): string {
  const { name, subtitle, color, center, stars, lines, story } = data;

  const starsYaml = stars.length
    ? `stars:\n${stars.map((s) => `  - x: ${s.x}\n    y: ${s.y}`).join('\n')}`
    : 'stars: []';

  const linesYaml = lines.length
    ? `lines:\n${lines.map((l) => `  - from: ${l.from}\n    to: ${l.to}`).join('\n')}`
    : 'lines: []';

  return `---
name: ${name}
subtitle: ${subtitle || 'A new constellation'}
color: "${color || '#c9a84c'}"
center:
  x: ${center?.x ?? 0}
  y: ${center?.y ?? 0}
${starsYaml}
${linesYaml}
---

${story || 'Write your story here.'}
`;
}

async function saveLocal(slug: string, content: string) {
  const filePath = join(process.cwd(), 'src', 'content', 'constellations', `${slug}.md`);
  await writeFile(filePath, content, 'utf-8');
}

async function saveToGitHub(slug: string, content: string) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is not set');
  }

  const path = `src/content/constellations/${slug}.md`;
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${path}`;

  // Check if file already exists (need its SHA to update)
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

  // Create or update file
  const body: Record<string, string> = {
    message: sha ? `Update constellation: ${slug}` : `Add constellation: ${slug}`,
    content: btoa(unescape(encodeURIComponent(content))),
    branch: BRANCH,
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
  // Auth check — skip in dev, require session in production
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
  const { filename, name } = data;

  if (!filename || !name) {
    return new Response(JSON.stringify({ error: 'Filename and name are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const slug = filename.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  const md = buildMarkdown(data);

  try {
    if (isProd) {
      await saveToGitHub(slug, md);
    } else {
      await saveLocal(slug, md);
    }
    return new Response(JSON.stringify({ ok: true, slug, rebuilt: isProd }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
