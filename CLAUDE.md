# Pontcirq

Static website of the commune of Pontcirq (46150, Lot), built with Astro and deployed to GitHub Pages at https://pontcirq.vergnol.eu.

Site content is in French; code, comments, commit messages and PR descriptions are in English.

## Commands

- `npm run dev`: local dev server
- `npm run build`: `astro check` then `astro build` into `dist/`. Run it before every PR.
- CI installs with `npm ci --ignore-scripts` on Node 22; reproduce that locally if a dependency change is involved.

## Layout

- `src/content/actualites/`: events/news, one Markdown file each; schema in `src/content.config.ts` (validated at build time)
- `src/data/actualites.ts`: the logic around events (loading the collection, status, archives, highlights, date/time formatting, image lookup), plus the build-time checks of unique ids, association anchors and images
- `src/data/associations.ts`: associations listed on /vie-locale, `associationAnchor(name)` and `LIBRARY_ANCHOR`
- `src/pages/`: one file per page; `actualites/[id].astro` is the event detail page
- `src/pages/fragments/archives/[page].astro`: htmx fragments loaded by « Voir les archives »; `/fragments/` is excluded from the sitemap
- `src/pages/rss.xml.ts`: RSS feed of all events (`/rss.xml`, `@astrojs/rss`), newest date first; linked from `BaseLayout.astro` and /actualites
- `src/components/`: `ActualiteCard`, `StatusBadge`, `Carousel`, `Header`, `Footer`
- `src/pages/vie-locale.astro`: associations (from `src/data/associations.ts`), library, school, markets (markets data inline in the frontmatter)
- `src/styles/global.css`: design tokens (`--color-*`, `--radius`, `--shadow-*`); reuse them instead of hard-coded colors
- `src/assets/`: content photos (`actualites/`, `accueil/`, `vie-locale/`), optimised at build time by `astro:assets` (resized, converted to WebP, responsive `srcset`). Render them with `<Image>` / `getImage` from `astro:assets`, never a plain `<img>`; commit originals as they are, no manual compression needed. `BaseLayout`'s `image` prop (og:image) takes one of these imports and is resized to 1200px JPEG
- `public/images/`: logos and icons served as is from `/images/...` (header blason, footer, services)
- Image file names are lowercase kebab-case with lowercase extensions: `logo-<name>` for logos, `<event>-<year>` for events

The Inter font (`@fontsource-variable/inter`) and htmx (`htmx.org`, pinned to an exact version) are npm dependencies bundled by Astro from `BaseLayout.astro`. Don't load scripts, styles or fonts from CDNs or Google Fonts (they receive visitors' IPs); self-host them instead.

## Adding an event

Create a Markdown file in `src/content/actualites/` named `<date>-<slug>.md` (e.g. `2026-11-06-projection-permaculture.md`, slug in lowercase kebab-case). The frontmatter holds the metadata, the body is the full text:

```markdown
---
id: 16
date: "2026-11-06"
time: "19:30"
lieu: "Salle communale de Pontcirq"
title: "Projection « Permaculture, la voie de l'autonomie »"
excerpt: "Une phrase courte pour les cartes."
image: "mois-du-doc-2026.png"
associations:
  - name: "Bibliothèque de Pontcirq"
    anchor: assoc-bibliotheque-de-pontcirq
---

Premier paragraphe du texte complet.

Deuxième paragraphe (une ligne vide entre les paragraphes).
```

- `id`: next integer after the current highest id across all files; it is the URL (`/actualites/<id>/`), so never reuse or change one. The build fails on duplicate ids
- `date` / `endDate`: quoted `"YYYY-MM-DD"` strings (unquoted, YAML turns them into dates and validation fails); `endDate` only for multi-day events and never before `date`
- `time`: optional quoted start time `"HH:MM"` (24h), shown next to the date as `19h30` / `16h`; omit it for multi-day events with several times
- `lieu`: optional place, e.g. `Salle communale de Pontcirq`, `Église Saint-Pierre-ès-Liens`, `Place de la halle, Catus`; shown under the date. Keep stating time and place in the body too
- `excerpt`: one sentence for cards; the body is rendered as Markdown, with a blank line between paragraphs. Smart quotes are disabled, so text renders exactly as typed
- `image`: optional; put the file in `src/assets/actualites/` with a lowercase kebab-case name and set `image` to the file name only (e.g. `image: "mois-du-doc-2026.png"`); rename files the user drops in with spaces or capitals. Formats: jpg, jpeg, png, webp, avif. The build fails if the file is missing. No need to resize or compress it
- `associations`: optional list of `{ name, anchor }` where `anchor` is `associationAnchor(name)` (`assoc-` + `slugify(name)`) of an entry in `src/data/associations.ts`, or `LIBRARY_ANCHOR` (`assoc-bibliotheque-de-pontcirq`) for the library; the build fails on an unknown anchor. Omit the field when no listed association organises the event
- If the user provides a poster, read it and include useful details missing from their message (times, price, duration, contact)
- Write in the past tense when the event date has already passed, in the future tense otherwise

File order does not matter: lists are sorted by date, then by id. `npm run build` reports schema errors with the file name and field.

## Event status and archives

- `getStatus()` returns `upcoming`, `ongoing` or `past`, computed at build time in `Europe/Paris`
- /actualites shows every upcoming event (soonest first), the 5 most recent past events, then archives loaded 5 at a time
- The home page shows the next 3 events, then the most recent past ones
- Because status is computed at build time, the deploy workflow also rebuilds weekly (Monday just after midnight, Paris time)

## Associations

Associations are listed in `src/data/associations.ts` and rendered on /vie-locale with `id={associationAnchor(name)}`; the library card is rendered separately with `id={LIBRARY_ANCHOR}`. `src/data/actualites.ts` checks at build time that every event `associations[].anchor` matches one of these anchors and throws with the event file, id and bad anchor otherwise. So when removing or renaming an association, update the links to it in `src/content/actualites/` (the build tells you which), and check the grid `grid-template-rows` so the two columns stay balanced.

## CI / deployment

- `.github/workflows/deploy.yml` builds and deploys on push to `master`, weekly, and on manual dispatch
- `.github/workflows/ci.yml` runs `npm ci` + `npm run build` on every PR to `master` (job `build`, meant to be a required status check). It uses `pull_request`, never `pull_request_target`, and only `contents: read`
- Actions are pinned to full commit SHAs with a version comment; the runner is pinned to `ubuntu-24.04`; token permissions are per job. Keep it that way when editing or adding workflows, and reuse the same action SHAs across workflows.
- Dependabot (`.github/dependabot.yml`) updates actions and npm weekly with a 7-day cooldown
- When the domain changes, update `site` in `astro.config.mjs`, the sitemap line in `public/robots.txt`, and the custom domain in the repo's Pages settings

## Workflow

- One branch and one PR per change; don't stack unrelated changes on an open PR
- Branch names: `content/...` for site content, `feat/...` for features, `ci/...` for workflow changes, `refactor/...` for code changes with no visible effect
- Open PRs with `gh pr create --assignee @me`
