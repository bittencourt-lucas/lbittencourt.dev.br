# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (Vite HMR)
npm run build     # Type-check + production build (tsc -b && vite build)
npm run lint      # ESLint with TypeScript type-checking
npm run preview   # Preview production build locally
```

No test framework is configured yet.

## Architecture

React 19 + TypeScript 6 + Vite 8 SPA. Entry point is `src/main.tsx` → `src/App.tsx`. No routing framework; single page.

**React Compiler is enabled** (via `@rolldown/plugin-babel` + `babel-plugin-react-compiler`). This means automatic memoization — do not add manual `useMemo`/`useCallback` unless there's a specific reason to override.

**Styling** uses plain CSS with custom properties defined in `src/index.css`. Dark mode is handled via `prefers-color-scheme` media query, not a JS theme toggle. Component-scoped styles go in a `.css` file alongside the component (e.g., `App.css`).

**TypeScript** is in strict mode with `noUnusedLocals` and `noUnusedParameters` enforced — unused variables will fail the build.
