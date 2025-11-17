# Vercel Deployment Guide

This guide outlines how to deploy the Screaming Architecture Starter to Vercel while following the project’s runtime-configuration model and Vercel best practices.

## 1. Required Project Settings

- **Framework preset:** `Vite`
- **Install command:** `pnpm install --frozen-lockfile`
- **Build command:** `pnpm run build` (the `prebuild` hook automatically injects the correct `runtime-config.json`)
- **Node.js version:** `22.21.1` (matches `package.json` engines to avoid runtime drift)
- **Output directory:** `dist`
- **Default region:** `Paris (cdg1)` – matches the committed `vercel.json` so future Serverless Functions inherit the same region.

## 2. Runtime Configuration Flow

1. Declare per-environment runtime configs under `config/runtime/`:
   - `runtime-config.development.json`
   - `runtime-config.preview.json`
   - `runtime-config.production.json`
2. Set `APP_RUNTIME_ENV` (or `RUNTIME_CONFIG_ENV`) in Vercel → Project → Settings → Environment Variables.
   - Production environment: `APP_RUNTIME_ENV=production`
   - Preview environment: `APP_RUNTIME_ENV=preview`
   - Development (`pnpm run dev`): defaults to `development`
3. During every `pnpm run build`, the `prebuild` script runs `scripts/apply-runtime-config.mjs`, copying the matching file into `public/runtime-config.json`.
   - Keep the committed `public/runtime-config.json` as a placeholder (all values `null`). It will be overwritten during the build, so avoid committing environment-specific artifacts.

> Tip: Run `APP_RUNTIME_ENV=preview pnpm run runtime-config:apply` locally to inspect the generated file before committing.

## 3. Environment Variables

- Keep all build-time variables client-safe by using the `VITE_` prefix and define them per-environment in Vercel (e.g., `VITE_ANALYTICS_ENABLED`, `VITE_APP_NAME`).
- Never place secrets in runtime config; instead, store sensitive values as Vercel Environment Variables and access them server-side (edge functions, API routes).
- Use Preview-specific variables so staging deployments never talk to production services.

## 4. Cache Strategy

`vercel.json` ships two important headers:

- `Cache-Control: public, max-age=31536000, immutable` for hashed assets under `/assets`, maximizing CDN efficiency.
- `Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=60` for `runtime-config.json`, so config updates propagate quickly without sacrificing perceived performance.

Adjust `s-maxage` if your config changes more or less frequently.

## 5. Deployment Checklist

- `pnpm install`
- `pnpm run lint`, `pnpm run typecheck`, and `pnpm run test` (or CI equivalent)
- Ensure `config/runtime/runtime-config.<env>.json` files are up to date and committed
- Push to the relevant branch → Vercel automates Preview/Production deploys with the settings above

## 6. Troubleshooting

- **Wrong API base URL at runtime?** Confirm `APP_RUNTIME_ENV` matches one of the files in `config/runtime/` and redeploy. The build log prints which file was applied.
- **Stale config values?** Reduce the `s-maxage` in `vercel.json` or invalidate the CDN path (`vercel cache ls` / `vercel cache rm`).
- **Needing dynamic toggles?** Promote the configuration to Vercel KV/Object Storage and expose it via an authenticated API. Keep `runtime-config.json` for non-sensitive defaults.
