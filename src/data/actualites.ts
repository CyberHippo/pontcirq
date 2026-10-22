import type { ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { VALID_ANCHORS } from './associations';

// Events live in src/content/actualites/ (one Markdown file each, schema in
// src/content.config.ts). This module holds the logic around them.
export type Actualite = CollectionEntry<'actualites'>['data'] & {
  // The collection entry, to render the Markdown body with `render(entry)`.
  entry: CollectionEntry<'actualites'>;
};

const entries = await getCollection('actualites');

export function formatActualiteDate(actualite: Pick<Actualite, 'date' | 'endDate'>): string {
  const start = new Date(actualite.date);
  const startFull = start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  if (!actualite.endDate) {
    return startFull;
  }

  const end = new Date(actualite.endDate);
  const startDay = start.toLocaleDateString('fr-FR', { day: 'numeric' });
  const endFull = end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const isConsecutiveDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) === 1;

  return isConsecutiveDays ? `${startDay} et ${endFull}` : `Du ${startFull} au ${endFull}`;
}

// `19:30` -> `19h30`, `16:00` -> `16h`.
export function formatActualiteTime(time: string): string {
  const [hours, minutes] = time.split(':');
  return minutes === '00' ? `${Number(hours)}h` : `${Number(hours)}h${minutes}`;
}

// Date label, optional time label and `datetime` attribute for an event's <time>.
export function getActualiteWhen(actualite: Pick<Actualite, 'date' | 'endDate' | 'time'>): {
  date: string;
  time?: string;
  datetime: string;
} {
  return {
    date: formatActualiteDate(actualite),
    time: actualite.time && formatActualiteTime(actualite.time),
    datetime: actualite.time ? `${actualite.date}T${actualite.time}` : actualite.date,
  };
}

export const actualites: Actualite[] = entries.map((entry) => ({ ...entry.data, entry }));

// Ids are used in URLs (/actualites/<id>/), so they must be unique.
const seenIds = new Map<number, string>();
for (const { id, entry } of actualites) {
  const other = seenIds.get(id);
  if (other) {
    throw new Error(`Duplicate actualite id ${id} in src/content/actualites/${other}.md and ${entry.id}.md`);
  }
  seenIds.set(id, entry.id);
}

// Build-time check: every association link must point to a card on /vie-locale.
// This module is imported by the event pages, so a dead anchor fails the build.
const deadAnchors = actualites.flatMap((a) =>
  (a.associations ?? [])
    .filter((assoc) => !VALID_ANCHORS.has(assoc.anchor))
    .map((assoc) => `  - ${a.entry.id}.md (id ${a.id}): "${assoc.anchor}" (${assoc.name})`),
);
if (deadAnchors.length > 0) {
  throw new Error(
    `Unknown association anchors in src/content/actualites/ (no matching card on /vie-locale):\n${deadAnchors.join('\n')}\n` +
      `Valid anchors: ${[...VALID_ANCHORS].join(', ')}`,
  );
}

// Event images live in src/assets/actualites/ and are referenced by file name, so astro:assets can optimise them.
const actualiteImages: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ default: ImageMetadata }>('/src/assets/actualites/*.{jpg,jpeg,png,webp,avif}', { eager: true }),
  ).map(([path, module]) => [path.split('/').pop()!, module.default]),
);

// Build-time check: every event image must exist in src/assets/actualites/.
const missingImages = actualites
  .filter((a) => a.image && !actualiteImages[a.image])
  .map((a) => `  - ${a.entry.id}.md (id ${a.id}): "${a.image}"`);
if (missingImages.length > 0) {
  throw new Error(
    `Missing event images (expected a file name in src/assets/actualites/, e.g. "contes-2026.jpg"):\n${missingImages.join('\n')}`,
  );
}

export function getActualiteImage(actualite: Pick<Actualite, 'image'>): ImageMetadata | undefined {
  return actualite.image ? actualiteImages[actualite.image] : undefined;
}

export type ActualiteStatus = 'upcoming' | 'ongoing' | 'past';

export const STATUS_LABELS: Record<ActualiteStatus, string> = {
  upcoming: 'À venir',
  ongoing: 'En cours',
  past: 'Passé',
};

// Statuses are computed at build time, in the commune's time zone. The site is
// rebuilt weekly (and on every push) so labels stay current.
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date());

export function getStatus(actualite: Pick<Actualite, 'date' | 'endDate'>): ActualiteStatus {
  if ((actualite.endDate ?? actualite.date) < today) return 'past';
  if (actualite.date <= today) return 'ongoing';
  return 'upcoming';
}

export const RECENT_PAST_COUNT = 5;
export const ARCHIVE_PAGE_SIZE = 5;

// Upcoming and ongoing events, soonest first.
const upcoming = actualites
  .filter((a) => getStatus(a) !== 'past')
  .sort((a, b) => a.date.localeCompare(b.date) || a.id - b.id);

// Past events, most recent first.
const past = actualites
  .filter((a) => getStatus(a) === 'past')
  .sort((a, b) => b.date.localeCompare(a.date) || a.id - b.id);

const archives = past.slice(RECENT_PAST_COUNT);

export function getUpcoming(): Actualite[] {
  return upcoming;
}

export function getRecentPast(): Actualite[] {
  return past.slice(0, RECENT_PAST_COUNT);
}

// Next events first, then the most recent past ones.
export function getHighlights(count: number): Actualite[] {
  return [...upcoming, ...past].slice(0, count);
}

export function getArchivePage(page: number): Actualite[] {
  const start = (page - 1) * ARCHIVE_PAGE_SIZE;
  return archives.slice(start, start + ARCHIVE_PAGE_SIZE);
}

export function getArchiveTotalPages(): number {
  return Math.ceil(archives.length / ARCHIVE_PAGE_SIZE);
}

export function getById(id: number): Actualite | undefined {
  return actualites.find((a) => a.id === id);
}
