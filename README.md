# lbittencourt.dev.br

Personal portfolio and website. Built with Astro 6, React 19, Tailwind CSS v4, and GSAP. Deployed on Vercel.

## Tech Stack

- **Framework**: [Astro 6](https://astro.build) — hybrid SSG with React islands
- **UI**: [React 19](https://react.dev) for interactive components
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) via PostCSS — configured in `src/styles/global.css`
- **Animations**: [GSAP](https://gsap.com) with ScrollTrigger
- **Email**: [Resend](https://resend.com) for contact form delivery
- **Rate limiting**: [Upstash Redis](https://upstash.com)
- **Deployment**: [Vercel](https://vercel.com)

## Getting Started

```bash
npm install
cp .env.example .env   # fill in required env vars
npm run dev            # http://localhost:4321
```

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run typecheck` | TypeScript + Astro type validation |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit tests (run once) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright E2E tests (requires built site) |

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend API key for contact form emails |
| `RESEND_FROM_EMAIL` | Sender address |
| `RESEND_TO_EMAIL` | Recipient address |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |
| `GITHUB_TOKEN` | (Optional) Raises GitHub API rate limit from 60 to 5000 req/hr |

## Project Structure

```
src/
  components/       # Reusable Astro + React island components
    ui/             # Design system primitives (Button, Input, etc.)
  content/
    config.ts       # Astro content collection schemas
    projects/       # MDX case studies
  layouts/
    BaseLayout.astro # Root layout: meta, OG tags, JSON-LD, fonts
  lib/
    contact.ts      # Contact form validation
    github.ts       # GitHub API fetch (build-time only)
  pages/
    api/
      contact.ts    # POST endpoint: Resend + rate limiting
    index.astro     # Home page
  styles/
    global.css      # Tailwind v4 @theme tokens + global resets
e2e/                # Playwright E2E tests
public/             # Static assets
vercel.json         # Security headers (HSTS, CSP, X-Frame-Options)
```
