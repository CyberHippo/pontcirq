import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected a YYYY-MM-DD date');

// One Markdown file per event in src/content/actualites/; the body is the full text.
// src/data/actualites.ts also checks at build time that ids are unique, that
// association anchors match a card on /vie-locale and that images exist.
const actualites = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/actualites' }),
  schema: z
    .object({
      id: z.number().int().positive(),
      date: isoDate,
      endDate: isoDate.optional(),
      /** Start time, `HH:MM` (24h). Omit for multi-day events with several times. */
      time: z.string().regex(/^\d{2}:\d{2}$/, 'Expected a HH:MM time').optional(),
      /** Place of the event, e.g. « Salle communale de Pontcirq ». */
      lieu: z.string().min(1).optional(),
      title: z.string().min(1),
      excerpt: z.string().min(1),
      /** File name of an image in src/assets/actualites/, e.g. `contes-2026.jpg` */
      image: z
        .string()
        .regex(/^[^/]+$/, 'Expected a file name in src/assets/actualites/, e.g. "contes-2026.jpg"')
        .optional(),
      associations: z
        .array(
          z.object({
            name: z.string().min(1),
            anchor: z.string().regex(/^assoc-[a-z0-9-]+$/, 'Expected assoc-<slug>'),
          }),
        )
        .optional(),
    })
    .refine((a) => !a.endDate || a.endDate >= a.date, {
      message: 'endDate must be on or after date',
      path: ['endDate'],
    }),
});

export const collections = { actualites };
