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
    hidden: z.boolean().optional().default(false),
    image: z.string().optional(),
    quote: z.string().optional(),
    tracks: z.array(z.object({
      title: z.string(),
      duration: z.string(),
      file: z.string(),
    })).optional().default([]),
  }),
});

export const collections = { constellations };
