import type { APIRoute } from 'astro';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { requireEditorAuth } from '../../lib/auth';
import { GITHUB_REPO, GITHUB_BRANCH } from '../../lib/github';

export const prerender = false;

function buildMarkdown(data: {
  name: string;
  subtitle: string;
  color: string;
  hidden?: boolean;
  image?: string;
  center: { x: number; y: number };
  stars: { x: number; y: number }[];
  lines: { from: number; to: number }[];
  tracks?: { title: string; duration: string; file: string }[];
  story: string;
}): string {
  const { name, subtitle, color, hidden, image, center, stars, lines, tracks = [], story } = data;

  const starsYaml = stars.length
    ? `stars:\n${stars.map((s) => `  - x: ${s.x}\n    y: ${s.y}`).join('\n')}`
    : 'stars: []';

  const linesYaml = lines.length
    ? `lines:\n${lines.map((l) => `  - from: ${l.from}\n    to: ${l.to}`).join('\n')}`
    : 'lines: []';

  const tracksYaml = tracks.length
    ? `tracks:\n${tracks.map((t) => `  - title: "${t.title}"\n    duration: "${t.duration}"\n    file: "${t.file}"`).join('\n')}`
    : 'tracks: []';

  return `---
name: ${name}
subtitle: ${subtitle || 'A new constellation'}
color: "${color || '#c9a84c'}"${hidden ? `\nhidden: true` : ''}${image ? `\nimage: "${image}"` : ''}
center:
  x: ${center?.x ?? 0}
  y: ${center?.y ?? 0}
${starsYaml}
${linesYaml}
${tracksYaml}
---

${story || ''}
`;
}

async function saveLocal(slug: string, content: string) {
  const filePath = join(process.cwd(), 'src', 'content', 'constellations', `${slug}.md`);
  await writeFile(filePath, content, 'utf-8');
}

async function saveToGitHub(slug: string, content: string) {
  const token = import.meta.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is not set');
  }

  const path = `src/content/constellations/${slug}.md`;
  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`;

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

  const isProd = import.meta.env.PROD;

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
