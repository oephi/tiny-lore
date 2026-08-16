import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const constellations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/constellations' }),
  schema: z.object({
    name: z.string(),
    subtitle: z.string(),
    color: z.string(),
    center: z.object({ x: z.number(), y: z.number() }),
    stars: z.array(z.object({ x: z.number(), y: z.number() })),
    lines: z.array(z.object({ from: z.number(), to: z.number() })),
  }),
});

export const collections = { constellations };
