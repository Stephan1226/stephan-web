# Stephan Kim

A small personal publication built with Astro. Notes live as Markdown files in `src/content/notes/`.

## Writing a note

1. Add a Markdown file in `src/content/notes/`, for example `2026-08-25-a-new-note.md`.
2. Add the required frontmatter:

```md
---
title: 새 글의 제목
publishedAt: 2026-08-25
description: 공유와 검색에 쓰일 짧은 소개문입니다.
draft: false
---

본문을 여기에 작성합니다.
```

`draft: true`로 두면 로컬에서는 검증되지만 사이트와 RSS에는 노출되지 않습니다.

## Architecture

Pages never read `astro:content` directly. All note data flows through the
`NotesRepository` interface in `src/lib/notes/`:

- `types.ts` — plain DTOs (`NoteSummary`, `Note`, `ArchiveYear`) with no Astro types.
- `repository.ts` — the `NotesRepository` interface (list, filter by year/month, archive index).
- `content.ts` — the current implementation backed by the Markdown content collection.
- `index.ts` — exports the `notesRepository` singleton, the single swap point.

To move notes into a database later (e.g. Cloudflare D1), implement
`NotesRepository` against the database and swap the export in `index.ts`;
pages, RSS, and the archive UI stay unchanged.

The archive is browsable by URL: `/notes/` (latest year), `/notes/[year]/`,
and `/notes/[year]/[month]/` are statically generated from the archive index.

## Local development

```sh
npm run dev -- --background
```

To stop the Astro background server, run `astro dev stop`.

## Cloudflare Workers

The project is ready for static deployment to Cloudflare Workers.

1. Log in once with `npx wrangler login`.
2. Run `npm run deploy` for the first deployment.
3. In the Cloudflare dashboard, attach `stephan.kim` as the Worker custom domain.

For automatic deployments from GitHub, add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as repository secrets. The included workflow deploys every push to `main`.

To use Cloudflare DNS with a Namecheap-registered domain, replace the domain's Namecheap nameservers with the pair Cloudflare provides after adding the zone. Cloudflare then manages DNS and HTTPS; the registrar can remain Namecheap.
