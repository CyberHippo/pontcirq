import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { actualites } from '../data/actualites';

export function GET(context: APIContext) {
  const items = [...actualites]
    .sort((a, b) => b.date.localeCompare(a.date) || a.id - b.id)
    .map((actualite) => ({
      title: actualite.title,
      link: `/actualites/${actualite.id}/`,
      pubDate: new Date(actualite.date),
      description: actualite.excerpt,
    }));

  return rss({
    title: 'Actualités de Pontcirq',
    description: 'Les événements et les annonces de la commune de Pontcirq (46150), dans le Lot.',
    site: context.site!,
    items,
    customData: '<language>fr-fr</language>',
  });
}
