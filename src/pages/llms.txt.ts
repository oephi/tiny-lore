import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

export const GET: APIRoute = async () => {
  const constellations = await getCollection('constellations');

  const pages = constellations
    .map((c) => `- [${c.data.name}](https://tiny-lore.vercel.app/constellations/${c.id}): ${c.data.subtitle}`)
    .join('\n');

  const body = `# Tiny Lore

> Where tiny moments meet infinite worlds

Tiny Lore is an interactive constellation map of children's stories. Each constellation in the night sky represents a story, with stars and lines forming the shape of the tale's central character. Click a constellation to explore its story and listen to audio tracks.

## Pages

- [Constellation Map](https://tiny-lore.vercel.app/constellations): Interactive night sky with all constellations
${pages}

## Features

- Interactive canvas-based constellation map with pan and zoom
- Each constellation links to a detail page with story text and audio tracks
- Users can sign in via Google to favorite tracks
- Dark celestial aesthetic with gold accents

## Technical

- Built with Astro
- Canvas 2D rendering for the constellation map
- Server-side rendered auth routes, static content pages
- Hosted on Vercel
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
