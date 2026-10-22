# Pontcirq

Static website of the commune of Pontcirq (46150, Lot), built with Astro and deployed to GitHub Pages at https://pontcirq.vergnol.eu.

Site content is in French; code, comments, commit messages and PR descriptions are in English.

## Commands

- `npm run dev`: local dev server
- `npm run build`: `astro check` then `astro build` into `dist/`. Run it before every PR.
- CI installs with `npm ci --ignore-scripts` on Node 22; reproduce that locally if a dependency change is involved.

## Layout

- `src/data/actualites.ts`: all events/news and the logic around them (status, archives, highlights)
- `src/pages/`: one file per page; `actualites/[id].astro` is the event detail page
- `src/pages/fragments/archives/[page].astro`: htmx fragments loaded by « Voir les archives »; `/fragments/` is excluded from the sitemap
- `src/pages/rss.xml.ts`: RSS feed of all events (`/rss.xml`, `@astrojs/rss`), newest date first; linked from `BaseLayout.astro` and /actualites
- `src/components/`: `ActualiteCard`, `StatusBadge`, `Carousel`, `Header`, `Footer`
- `src/pages/vie-locale.astro`: associations, library, school, markets (data inline in the frontmatter)
- `src/styles/global.css`: design tokens (`--color-*`, `--radius`, `--shadow-*`); reuse them instead of hard-coded colors
- `public/images/`: static images, served from `/images/...`. File names are lowercase kebab-case with lowercase extensions: `logo-<name>` for logos, `<event>-<year>` for events

The Inter font (`@fontsource-variable/inter`) and htmx (`htmx.org`, pinned to an exact version) are npm dependencies bundled by Astro from `BaseLayout.astro`. Don't load scripts, styles or fonts from CDNs or Google Fonts (they receive visitors' IPs); self-host them instead.

## Adding an event

Add an entry to the `actualites` array in `src/data/actualites.ts`:

- `id`: next integer after the current highest id (ids are not in array order)
- `date` / `endDate`: `YYYY-MM-DD`; `endDate` only for multi-day events
- `time`: start time `HH:MM` (24h), shown next to the date as `19h30` / `16h`; omit it for multi-day events with several times
- `lieu`: place, e.g. `Salle communale de Pontcirq`, `Église Saint-Pierre-ès-Liens`, `Place de la halle, Catus`; shown under the date. Keep stating time and place in `content` too
- `excerpt`: one sentence for cards; `content`: full text, rendered as Markdown (`\n\n` between paragraphs)
- `image`: put the file in `public/images/actualites/` with a lowercase kebab-case name (e.g. `mois-du-doc-2026.png`); rename files the user drops in with spaces or capitals
- `associations`: `{ name, anchor }` where `anchor` is `assoc-` + `slugify(name)` and must match a card on /vie-locale; omit the field when no listed association organises the event
- If the user provides a poster, read it and include useful details missing from their message (times, price, duration, contact)
- Write in the past tense when the event date has already passed, in the future tense otherwise

Event order in the array does not matter: lists are sorted by date.

## Event status and archives

- `getStatus()` returns `upcoming`, `ongoing` or `past`, computed at build time in `Europe/Paris`
- /actualites shows every upcoming event (soonest first), the 5 most recent past events, then archives loaded 5 at a time
- The home page shows the next 3 events, then the most recent past ones
- Because status is computed at build time, the deploy workflow also rebuilds weekly (Monday just after midnight, Paris time)

## Associations

Associations are listed in `src/pages/vie-locale.astro`. When removing one, also remove any `associations` link to it in `actualites.ts` (otherwise the anchor is dead), and check the grid `grid-template-rows` so the two columns stay balanced.

## CI / deployment

- `.github/workflows/deploy.yml` builds and deploys on push to `master`, weekly, and on manual dispatch
- Actions are pinned to full commit SHAs with a version comment; the runner is pinned to `ubuntu-24.04`; token permissions are per job. Keep it that way when editing the workflow.
- Dependabot (`.github/dependabot.yml`) updates actions and npm weekly with a 7-day cooldown
- When the domain changes, update `site` in `astro.config.mjs`, the sitemap line in `public/robots.txt`, and the custom domain in the repo's Pages settings

## Workflow

- One branch and one PR per change; don't stack unrelated changes on an open PR
- Branch names: `content/...` for site content, `feat/...` for features, `ci/...` for workflow changes
- Open PRs with `gh pr create --assignee @me`
