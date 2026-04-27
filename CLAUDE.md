# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Astro HMR, localhost:4321)
npm run build        # Production build (astro build)
npm run preview      # Preview production build locally
npm run typecheck    # astro check — TypeScript + Astro type validation
npm run lint         # ESLint
npm run test         # Vitest (unit tests, run once)
npm run test:watch   # Vitest in watch mode
npm run test:e2e     # Playwright E2E tests (requires built site)
```

## Architecture

**Astro 6** SSG/hybrid SPA with React islands. Entry: `src/pages/index.astro`.

- `output: "hybrid"` — pages are static by default; API routes opt into SSR via `export const prerender = false`
- **Adapter**: `@astrojs/vercel` — deploys to Vercel, serverless functions for API routes
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss` (PostCSS plugin, not the Vite plugin — the Vite plugin has a compatibility bug with Vite 8's rolldown bundler). Configured in `astro.config.ts` under `vite.css.postcss`. No `tailwind.config.js` — configuration lives in `src/styles/global.css` using `@theme {}`. No `@apply` usage.
- **Fonts**: Inter (body) + JetBrains Mono (accent/code) — loaded via Google Fonts in BaseLayout
- **Animations**: GSAP with ScrollTrigger. All animations must check/respect `prefers-reduced-motion`.
- **TypeScript**: strict mode via `astro/tsconfigs/strict`. Path aliases: `@components/*`, `@layouts/*`, `@lib/*`, `@styles/*`.

## Project Structure

```
src/
  components/       # Reusable Astro + React island components
    ui/             # Design system primitives (Button, Input, etc.)
  content/
    config.ts       # Astro content collection schemas
    projects/       # MDX case studies (NDA-safe project write-ups)
  layouts/
    BaseLayout.astro # Root layout: meta, OG tags, JSON-LD, fonts
  lib/
    contact.ts      # Contact form validation (pure, no side effects)
    contact.test.ts # Unit tests for validation
    github.ts       # GitHub API fetch (build-time only)
  pages/
    api/
      contact.ts    # POST endpoint: Resend + Upstash rate limiting
    index.astro     # Home page
  styles/
    global.css      # Tailwind v4 @theme tokens + global resets
e2e/                # Playwright E2E tests
public/             # Static assets (favicon, OG image)
vercel.json         # Security headers (HSTS, CSP, X-Frame-Options, etc.)
env.d.ts            # TypeScript types for import.meta.env
.env.example        # Required env vars (copy to .env and fill in)
```

## Design Tokens

Defined in `src/styles/global.css` under `@theme {}`:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#0d0d0d` | Page background |
| `--color-fg` | `#f0ede8` | Body text |
| `--color-fg-muted` | `#8a8680` | Secondary/caption text |
| `--color-accent` | `#ff3d00` | Electric orange — CTAs, highlights |
| `--color-border` | `#2a2a2a` | Dividers, card borders |
| `--font-sans` | Inter | Body text |
| `--font-mono` | JetBrains Mono | Code labels, metadata, accent text |

## Testing

- **Unit**: Vitest 4 with jsdom. Test files: `src/**/*.test.ts{x}`. Run with `npm test`.
- **E2E**: Playwright 1.59. Test files: `e2e/**/*.spec.ts`. Targets desktop Chrome + mobile (Pixel 5).
- New features should ship with tests. Pure logic (validation, utilities) gets unit tests. User flows get E2E tests.

## Content Collections

Case studies live in `src/content/projects/` as `.mdx` files. Schema defined in `src/content/config.ts`. Fields: `title`, `summary`, `industry`, `stack`, `outcomes`, `featured`, `order`.

## API Route: Contact Form

`src/pages/api/contact.ts` — POST only, SSR. Rate-limited to 5 requests per IP per hour via Upstash Redis. Sends email via Resend. Requires env vars: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

## GitHub Projects

`src/lib/github.ts` fetches public repos for `bittencourt-lucas` at **build time** from the `index.astro` frontmatter. Set `GITHUB_TOKEN` env var to raise rate limit from 60 to 5000 req/hr.

## Key Rules

- Mobile-first in all CSS — base styles target small screens, expand with `md:` / `lg:` prefixes.
- Never add `useMemo`/`useCallback` unless overriding a specific performance issue.
- Do not write comments explaining what code does — only write them for non-obvious *why*.
- All animations must be wrapped with a `prefers-reduced-motion` check or the global CSS reset handles it.
- Do not commit `.env` — only `.env.example`.
