### Configuration Files Reference

This document provides an overview of all configuration files in the project and their purpose.

#### TypeScript Configuration

See `docs/tsconfig.md` for detailed TypeScript configuration documentation.

- `tsconfig.base.json`: Base compiler options and path aliases
- `tsconfig.json`: Project references orchestrator
- `tsconfig.app.json`: Application source code config
- `tsconfig.node.json`: Node/Vite config files
- `tsconfig.vitest.json`: Unit tests config
- `tsconfig.build.json`: Build/CI declarations

#### Build & Development

**vite.config.ts**

Vite configuration with environment-aware settings:

**Plugins:**

- `@vitejs/plugin-react-swc`: React with SWC for fast compilation
- `vite-tsconfig-paths`: Automatically resolves TypeScript path aliases via `tsconfig.app.json` (projects: `['./tsconfig.app.json']`)

**Server Configuration:**

- Environment-aware via `getServerConfig(env)` function (uses `loadEnv(mode, process.cwd(), '')`)
- Default port: 5173 (configurable via `VITE_PORT`, default: `'5173'`, parsed as integer)
- Default host: `::` (all interfaces, configurable via `VITE_HOST`)
- Auto-open browser (configurable via `VITE_OPEN`, default: `true` - set to `'false'` to disable)
- CORS enabled
- `strictPort: false` - Allows port fallback if port is in use

**Build Configuration:**

- Environment-aware via `getBuildConfig(env, mode)` function
- Target: ES2023 (configurable via `VITE_BUILD_TARGET`)
- Minification:
  - Production: `'esbuild'` (default)
  - Development: `false` (default)
  - Configurable via `VITE_MINIFY`: `'esbuild'`, `'terser'`, or `'false'`
- Sourcemaps:
  - Development: `'inline'` (default)
  - Production: `false` (default)
  - Configurable via `VITE_SOURCEMAP`: `'true'`, `'false'`, or `'inline'`
- Manual chunk optimization via `getManualChunks()`:
  - `vendor`: `react`, `react-dom`, `react-router-dom`
  - `ui`: `@radix-ui/react-slot` (only includes actually installed packages)
  - `query`: `@tanstack/react-query` (v5.90.8)
- Optimized chunk file naming: `assets/[name]-[hash].js` for chunks and entries, `assets/[name]-[hash].[ext]` for assets
- CSS code splitting: enabled (configurable via `VITE_CSS_CODE_SPLIT`, default: `true` - set to `'false'` to disable)
- Chunk size warning limit: 1000 KB (configurable via `VITE_CHUNK_SIZE_WARNING_LIMIT`, default: `'1000'`, parsed as integer)
- Compressed size reporting: disabled (configurable via `VITE_REPORT_COMPRESSED_SIZE`, default: `'false'` - set to `'true'` to enable)

**Dependency Optimization:**

- Environment-aware via `getOptimizeDepsConfig()` function
- Pre-bundles: `react`, `react-dom`, `react-router-dom`, `@tanstack/react-query` (v5.90.8), `lucide-react`
- `force: true` for consistent pre-bundling across restarts

**ESBuild Configuration:**

- Environment-aware via `getEsbuildConfig()` function
- Target: `'es2023'`
- Format: `'esm'` (ES modules)

**Environment Variables:**

- Uses `loadEnv(mode, process.cwd(), '')` to load environment variables (Vite automatically sets `NODE_ENV` based on mode)
- Supported variables: `VITE_PORT`, `VITE_HOST`, `VITE_OPEN`, `VITE_BUILD_TARGET`, `VITE_MINIFY`, `VITE_SOURCEMAP`, `VITE_CHUNK_SIZE_WARNING_LIMIT`, `VITE_REPORT_COMPRESSED_SIZE`, `VITE_CSS_CODE_SPLIT`
- Note: All client-exposed variables must be prefixed with `VITE_`

**vitest.config.ts**

Vitest test configuration:

**Note**: Example unit tests live under `tests/` (e.g., `tests/shared/components/layout/Layout.test.tsx`, `tests/shared/components/layout/Navbar.test.tsx`, `tests/core/router/routes.gen.test.ts`). The Vitest configuration powers those specs alongside the shared test infrastructure (`setupTests.ts`, factories, mocks, utilities).

- **Plugins**:
  - `@vitejs/plugin-react-swc`: React with SWC for fast compilation
  - `vite-tsconfig-paths`: TypeScript path alias resolution via `tsconfig.vitest.json` (projects: `['./tsconfig.vitest.json']`)
- **Environment**: jsdom for DOM testing
- **Globals**: Vitest globals enabled (`describe`, `it`, `expect`, etc.) via `globals: true`
- **Setup**: `tests/setupTests.ts` for test environment initialization
- **Includes**: `tests/**/*.{test,spec}.{ts,tsx}`, `src/**/*.{test,spec}.{ts,tsx}` (no test files currently exist)
- **Excludes**: `node_modules`, `dist`, `e2e`
- **Pool Configuration**:
  - **Windows**: Uses `forks` pool with `maxConcurrency: 1` for better stability (avoids ERR_IPC_CHANNEL_CLOSED/EPIPE errors)
  - **Other platforms**: Uses `threads` pool (default)
  - This prevents worker communication errors that occur with threads pool on Windows
- **Coverage**:
  - Provider: v8
  - Reporters: text, lcov, html
  - Reports directory: `./coverage`
  - Excludes: `node_modules/`, `tests/`, `e2e/`, `**/*.test.{ts,tsx}`, `**/*.spec.{ts,tsx}`, `**/*.config.{ts,js}`, `**/dist/**`, `**/build/**`, `**/coverage/**`, `**/*.d.ts`, `**/vite-env.d.ts`
- **Timeouts**: 10 seconds (10000 ms) for tests (`testTimeout: 10000`) and hooks (`hookTimeout: 10000`)

**Note**: Path aliases are automatically resolved via `vite-tsconfig-paths` plugin using `tsconfig.vitest.json` configuration.

**playwright.config.ts**

Playwright E2E test configuration:

- **Test Directory**: `./e2e`
- **Timeout**: 30 seconds per test (30_000 ms)
- **Parallel Execution**: Fully parallel (`fullyParallel: true`)
- **Reporters**: List (console output) and HTML (saved to `playwright-report`, never auto-opens via `open: 'never'`)
- **Browser Projects**:
  - Chromium (Desktop Chrome)
  - Firefox (Desktop Firefox)
  - WebKit (Desktop Safari)
- **Base URL**: Environment-aware via `getBaseUrl()` function:
  - Uses `E2E_BASE_URL` environment variable if provided
  - Otherwise derives from `VITE_PORT` (default: `'5173'`) and `VITE_HOST` (default: `'::'`)
  - Automatically converts network interface bindings (`'::'` or `'0.0.0.0'`) to `'localhost'` for URL usage
  - Defaults to `localhost:5173` to match Vite's default port
- **Environment Variables**:
  - Loads `.env` first via `config()` (default behavior from `dotenv` package)
  - Then loads `.env.local` with `override: true` if it exists (which overrides `.env` values)
  - Uses `dotenv` package's `config()` function with `existsSync()` check for `.env.local`
  - Note: `dotenv`'s `config()` doesn't override existing env vars by default, so `.env.local` is loaded with `override: true` to ensure proper precedence
- **Default Options**:
  - `trace: 'on-first-retry'` - Captures trace on first retry
  - `video: 'retain-on-failure'` - Keeps video only on test failures
  - `screenshot: 'only-on-failure'` - Captures screenshots only on failures
- **Web Server**:
  - Command: `pnpm dev`
  - URL: Uses the same `baseUrl` as tests
  - `reuseExistingServer: !process.env['CI']` - Reuses existing server in local development, always starts fresh in CI

**Note**: The configuration loads environment variables using `dotenv` with proper precedence (`.env.local` overrides `.env`), ensuring `getBaseUrl()` has access to environment variables when the Playwright config is loaded.

**postcss.config.cjs**

PostCSS configuration:

- **Plugins**: `@tailwindcss/postcss` (Tailwind CSS v4), `autoprefixer`

#### Code Quality

**eslint.config.js**

ESLint flat config (ESLint v9 ESM format) with comprehensive rules:

**Plugins:**

- **TypeScript**: `@typescript-eslint/eslint-plugin` with `@typescript-eslint/parser`
- **React**: `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-plugin-jsx-a11y`
- **Boundaries**: `eslint-plugin-boundaries` for module boundary enforcement
- **Imports**: `eslint-plugin-import`, `eslint-plugin-simple-import-sort`, `eslint-plugin-unused-imports`
- **Quality**: `eslint-plugin-sonarjs`, `eslint-plugin-unicorn`, `eslint-plugin-security`
- **Testing**: `eslint-plugin-testing-library` for test files

**Top-Level Ignores:**

- Build outputs: `dist`, `build`, `coverage`, `.vite`, `.vitest`
- Dependencies: `node_modules`
- Lock files: `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`
- Config files: `tsconfig*.json`
- Documentation: `**/*.md`, `**/*.mdc`
- E2E: `e2e/**/*`, `playwright-report/**/*`, `test-results/**/*`
- Generated: `*.min.js`, `*.bundle.js`
- IDE: `.next`, `.storybook`, `storybook-static`

**TypeScript Configuration:**

- Parser: `@typescript-eslint/parser` with `projectService` for performance:
  - `projectService.allowDefaultProject: ['*.js', '*.mjs', '*.cjs']` - Allows default project for JavaScript files
- Language options: Latest ECMAScript (`ecmaVersion: 'latest'`), module source type (`sourceType: 'module'`), JSX enabled (`ecmaFeatures: { jsx: true }`)
- Globals: Browser, Node, ES2023
- Project references for TypeScript resolver:
  - `tsconfig.base.json`
  - `tsconfig.app.json`
  - `tsconfig.node.json`
  - `tsconfig.vitest.json`
  - `noWarnOnMultipleProjects: true` - Suppresses warnings for multiple project references

**Module Boundaries:**

- **app**: may import `app`, `domains`, `shared`, `core`, `infra`
- **domains**: may import `shared`, `core` (NOT `app`, `infra`, or other domains)
- **core**: may import `core` only (framework-agnostic)
- **shared**: may import `shared`, `core` (NOT `app` or `infrastructure`)
- **infra**: may import `infra`, `core` (avoids importing domains)

**Import Restrictions:**

- No relative imports (`../`, `../../`, etc.) - must use path aliases (`@app`, `@core`, `@domains`, `@infra`, `@shared`, `@styles`, `@tests`)
- Import validation: no unresolved imports, no cycles, no self-imports, no duplicates
- Import sorting: automatic sorting via `simple-import-sort`
- Unused imports: automatically flagged and removable

**Complexity Limits (General):**

- Max lines per file: 250 (skip blank/comments)
- Max lines per function: 30 (skip blank/comments)
- Max params: 3
- Complexity: 10
- Max depth: 4
- Max statements: 20
- Max nested callbacks: 3

**File-Specific Complexity Limits:**

- **UI Components** (`src/domains/**/components/**/*.{ts,tsx}`, `src/shared/**/components/**/*.{ts,tsx}`): 200 file, 40 function, 5 params, 15 complexity, 4 depth, 30 statements, 3 nested callbacks
- **Hooks** (`src/domains/**/hooks/**/*.{ts,tsx}`, `src/shared/**/hooks/**/*.{ts,tsx}`): 150 file, 25 function, 3 params, 8 complexity, 3 depth, 15 statements, 2 nested callbacks
- **Services/API** (`src/domains/**/services/**/*.{ts,tsx}`, `src/shared/**/services/**/*.{ts,tsx}`): 200 file, 30 function, 4 params, 12 complexity, 4 depth, 20 statements, 3 nested callbacks
- **Handlers/Utils** (`src/domains/**/handlers/**/*.{ts,tsx}`, `src/domains/**/commands/**/*.{ts,tsx}`, `src/domains/**/queries/**/*.{ts,tsx}`, `src/**/utils/**/*.{ts,tsx}`, `src/**/helpers/**/*.{ts,tsx}`): 150 file, 20 function, 3 params, 6 complexity, 3 depth, 12 statements, 2 nested callbacks
- **Types** (`**/*.types.ts`, `**/*.d.ts`, `**/types/**/*.ts`, `**/models/**/*.ts`): 300 file (warn), others off
- **Stories** (`**/*.stories.{ts,tsx}`, `**/.storybook/**/*.{ts,tsx}`): 400 file, 40 function, 4 params, 10 complexity, 3 depth, 25 statements, 2 nested callbacks (all warn)
- **Tests** (`**/*.test.{ts,tsx}`, `**/__tests__/**/*.{ts,tsx}`, `tests/**/*.{ts,tsx}`):
  - 500 file, 60 function, 5 params, 20 complexity, 5 depth, 40 statements, 4 nested callbacks (all warn)
  - Uses `tsconfig.vitest.json` for parser project (`projectService: false`)
  - Includes Testing Library rules and Vitest globals
  - Relaxed rules: `@typescript-eslint/no-explicit-any` off, `no-magic-numbers` off, `security/detect-object-injection` off, `security/detect-non-literal-regexp` off
  - Testing Library plugin configured with React-specific rules
  - `testing-library/no-manual-cleanup`: error (enforces automatic cleanup)
- **Config Files - TypeScript** (`vite.config.ts`, `vitest.config.ts`, `tailwind.config.ts`, `playwright.config.ts`, `**/*.config.ts`):
  - All complexity rules off
  - Uses `tsconfig.node.json` for parser project (`projectService: false`)
  - Includes Node globals
  - Relaxed rules: `no-console` off, `no-magic-numbers` off, security rules disabled for dynamic requires/imports
- **Config Files - JavaScript** (`eslint.config.js`, `postcss.config.*`, `**/*.config.{js,mjs,cjs}`):
  - All complexity rules off
  - Uses `projectService` with `allowDefaultProject: ['*.js', '*.mjs', '*.cjs']` (no TypeScript project reference required, avoiding parser errors for JS files)
  - Uses `@typescript-eslint/parser` but without a TypeScript project reference (via `projectService.allowDefaultProject`)
  - Includes Node globals
  - Relaxed rules: `no-console` off, `no-magic-numbers` off, security rules disabled for dynamic requires/imports
  - TypeScript-specific rules disabled: `@typescript-eslint/no-var-requires` off, `@typescript-eslint/no-require-imports` off

**Key Rules:**

- React: JSX runtime, strict prop validation disabled (TypeScript handles), accessibility rules
- TypeScript: Consistent type imports (prefer `import type`), no explicit `any`, strict promise handling
- Security: Detects object injection, unsafe regex, eval usage, timing attacks
- Unicorn: 60+ best practice rules (prefer modern APIs, better regex, etc.)
- SonarJS: Code quality rules (cognitive complexity, duplicate code detection)
- Accessibility: JSX A11y recommended rules plus custom overrides

**.prettierrc**

Prettier formatting configuration:

```json
{
	"singleQuote": true,
	"semi": true,
	"trailingComma": "es5",
	"printWidth": 100,
	"useTabs": true,
	"tabWidth": 2,
	"endOfLine": "lf",
	"arrowParens": "avoid"
}
```

- **Single quotes**: Use single quotes for strings
- **Semicolons**: Always include semicolons
- **Trailing commas**: ES5-style trailing commas
- **Print width**: 100 characters per line
- **Use tabs**: Use tabs for indentation (not spaces)
- **Tab width**: 2 spaces equivalent
- **End of line**: LF (Unix-style)
- **Arrow parens**: Avoid parentheses around single arrow function parameters
- **Tailwind plugin**: `prettier-plugin-tailwindcss` is installed as a dev dependency and automatically loaded by Prettier (plugins field not needed in config)

**.editorconfig**

Editor configuration for consistent formatting:

```
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = tab
indent_size = 2
trim_trailing_whitespace = true
```

- **Encoding**: UTF-8
- **Line endings**: LF (Unix-style)
- **Indentation**: Tabs, size 2
- **Final newline**: Always insert
- **Trailing whitespace**: Trim

#### Version Control

**.gitignore**

Git ignore patterns:

```
node_modules/
dist/
.DS_Store
.env
.env.local
.env.*.local
coverage/
*.log
*.tsbuildinfo
.vite/
.idea/
.vscode/
```

**.gitattributes**

Git attributes for line ending normalization:

```
* text=auto eol=lf
```

Ensures consistent LF line endings across platforms.

#### Package Management

**package.json**

Project dependencies and scripts:

- **Package Manager**: pnpm 10.22.0+sha512.bf049efe995b28f527fd2b41ae0474ce29186f7edcb3bf545087bd61fbbebb2bf75362d1307fda09c2d288e1e499787ac12d4fcb617a974718a6051f2eee741c (via Corepack)
- **Node Version**: >=22.21.1
- **Scripts**: `dev`, `build`, `preview`, `lint`, `lint:fix`, `format`, `clean`, `typecheck`, `test`, `test:watch`, `test:ui`, `test:coverage`, `test:e2e`, `test:e2e:ui`, `check:bundle-size`, `docker:build`, `docker:dev`, `docker:down`, `docker:test`, `docker:test:watch`, `docker:test:e2e`, `docker:shell`, `docker:prod:build`, `docker:prod:up`, `docker:prod:down`

**pnpm-workspace.yaml**

PNPM workspace configuration:

```yaml
ignoredBuiltDependencies: null

onlyBuiltDependencies:
  - '@swc/core'
  - esbuild
  - msw
  - sharp
  - unrs-resolver
```

Specifies which dependencies should be built from source.

**.nvmrc**

Node.js version pin for version managers:

```
22.21.1
```

- **Purpose**: Specifies the Node.js version required for the project
- **Usage**: Automatically detected by `nvm` (Node Version Manager), `nodenv`, and other version managers
- **Compatibility**: Aligns with `package.json` `engines.node` requirement (>=22.21.1)
- **Setup**: Run `nvm use` or `nvm install` in the project root to switch to the correct version

**.npmrc**

NPM/PNPM configuration:

```
# Enforce pnpm as package manager
package-manager-strict=true
engine-strict=true
auto-install-peers=true

# Use workspace protocol when in monorepo (if pnpm-workspace.yaml exists)
prefer-workspace-packages=true
```

Configuration options:

- **package-manager-strict=true**: Ensures `pnpm` (as declared in `package.json`) is used instead of other package managers
- **engine-strict=true**: Enforces strict engine requirements from `package.json`, preventing installation if Node.js or pnpm versions don't match
- **auto-install-peers=true**: Automatically installs peer dependencies, reducing manual dependency management
- **prefer-workspace-packages=true**: When in a monorepo (pnpm-workspace.yaml exists), prefers local workspace packages over versions from npm registry, ensuring consistent local development

This configuration ensures consistent package management across the team and CI/CD pipelines.

#### Styling

**tailwind.config.ts**

Tailwind CSS configuration:

- **Content**: `./index.html`, `./src/**/*.{ts,tsx}`, `./tests/**/*.{ts,tsx}`
- **Dark mode**: Class-based (`dark:` prefix)
- **Theme**: Extendable theme configuration (extends design tokens from `@core/constants/designTokens.ts`)
- **Plugins**: None (using Tailwind CSS v4 PostCSS plugin)

#### Environment

**.env.example**

Template for environment variables. See [Environment Variables Reference](./environment-variables.md) for comprehensive documentation.

**Quick Reference:**

- **Server**: `VITE_PORT`, `VITE_HOST`, `VITE_OPEN`
- **Build**: `VITE_BUILD_TARGET`, `VITE_MINIFY`, `VITE_SOURCEMAP`, `VITE_CSS_CODE_SPLIT`
- **Performance**: `VITE_CHUNK_SIZE_WARNING_LIMIT`, `VITE_REPORT_COMPRESSED_SIZE`
- **E2E Testing**: `E2E_BASE_URL` (optional, overrides auto-detection from `VITE_PORT` and `VITE_HOST` for Playwright)
- **Application**: Custom `VITE_*` variables for app-specific configuration

**Notes:**

- All client-exposed variables must be prefixed with `VITE_`
- `E2E_BASE_URL` is used by Playwright and does not require the `VITE_` prefix
- Playwright loads `.env` first, then `.env.local` (which overrides `.env` values)
- See [Environment Variables Reference](./environment-variables.md) for complete documentation including defaults, runtime configuration, and production setup

#### IDE & Tools

**.cursorignore**

Cursor AI ignore patterns:

- Dependencies: `node_modules/`, `.pnpm-store/`
- Build outputs: `dist/`, `build/`, `.vite/`, `*.tsbuildinfo`
- Coverage: `coverage/`, `.nyc_output/`
- IDE/editor: `.idea/`, `.vscode/`, `*.swp`, `*.swo`, `*~`
- Logs: `*.log`, `npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*`, `pnpm-debug.log*`
- OS artifacts: `.DS_Store`, `Thumbs.db`
- Environment: `.env`, `.env.local`, `.env.*.local` (explicitly keeps `.env.example`)

#### HTML & PWA

**index.html**

Main HTML entry point with comprehensive metadata and PWA configuration:

**Basic HTML:**

- DOCTYPE: HTML5
- Language: `en` (English)
- Charset: UTF-8
- Viewport: `width=device-width, initial-scale=1.0, viewport-fit=cover`

**SEO Metadata:**

- Title: "Screaming Architecture Starter"
- Description: "A modern, scalable React application starter template"
- Robots: `index, follow`
- Canonical URL: `/` (should be absolute on deployment)

**Open Graph (Facebook) Tags:**

- Type: `website`
- Title: "Screaming Architecture Starter"
- Description: "A modern, scalable React application starter template"
- URL: `/` (should be absolute `https://yourdomain.com` on deployment)
- Locale: `en_US`
- Image: `/og-image.png` (1200x630, should be absolute URL on deployment)
- Site name: "Screaming Architecture Starter"

**Twitter Card Tags:**

- Card type: `summary_large_image`
- Title: "Screaming Architecture Starter"
- Description: "A modern, scalable React application starter template"
- Image: `/og-image.png` (should be absolute URL on deployment)

**Theme & Color Scheme:**

- Theme color (light): `#2563eb`
- Theme color (dark): `#0b0f19`
- Color scheme: `light dark`

**PWA Configuration:**

- Apple Mobile Web App: Enabled (`apple-mobile-web-app-capable: yes`)
- Apple status bar style: `black-translucent`
- Apple web app title: `SAS` (short name)
- Mobile web app capable: `yes`
- Format detection: `telephone=no` (prevents auto-detection of phone numbers)

**Icons & Assets:**

- Favicon: `/favicon.ico` (default fallback)
- Standard icons: 96x96, 192x192, 384x384, 512x512 (PNG)
- Apple touch icons: 180x180, 192x192
- Safari pinned tab: `/safari-pinned-tab.svg` (color: `#2563eb`)
- Microsoft tiles: Tile color `#2563eb`, Tile image `/icon-192.png`

**Manifest Link:**

- PWA manifest: `/manifest.json`

**NoScript Fallback:**

- Inline styles for centered layout
- Message: "JavaScript Required" with instructions to enable JavaScript

**Application Entry:**

- Root container: `<div id="root"></div>`
- Entry script: `/src/app/main.tsx` (ES module)

**Deployment Notes:**

- Update Open Graph and Twitter Card URLs to absolute URLs (`https://yourdomain.com`)
- Ensure `og-image.png` is accessible at the absolute URL
- Verify all icon assets are present in the `public/` directory

**public/manifest.json**

Progressive Web App (PWA) manifest configuration:

**App Identity:**

- Name: "Screaming Architecture Starter"
- Short name: "SAS"
- Description: "A modern, scalable React application starter template"
- ID: `/`
- Start URL: `/`
- Scope: `/`

**Display Configuration:**

- Display mode: `standalone` (appears as standalone app, hides browser UI)
- Display override: `["window-controls-overlay", "standalone", "minimal-ui"]`
  - `window-controls-overlay`: Modern PWA window controls (Chromium-based browsers)
  - `standalone`: Fullscreen standalone app
  - `minimal-ui`: Minimal browser UI (fallback)

**Colors:**

- Background color: `#ffffff` (white)
- Theme color: `#2563eb` (blue)

**Orientation & Localization:**

- Orientation: `any` (supports all orientations)
- Language: `en` (English)
- Direction: `ltr` (left-to-right)

**App Categories:**

- Categories: `["productivity", "utilities"]` (for app store listings)

**Icons Array:**
Icons are provided in multiple sizes and purposes:

**Standard Icons (`purpose: "any"`):**

- `/favicon.ico`: 48x48 (fallback)
- `/icon-96.png`: 96x96
- `/icon-180.png`: 180x180
- `/icon-192.png`: 192x192 (minimum for PWA)
- `/icon-384.png`: 384x384
- `/icon-512.png`: 512x512 (splash screen, install prompts)

**Maskable Icons (`purpose: "maskable"`):**

- `/icon-192-maskable.png`: 192x192 (adaptive icon, safe zone for Android)
- `/icon-384-maskable.png`: 384x384
- `/icon-512-maskable.png`: 512x512

**Maskable icons** follow Android adaptive icon guidelines: safe zone (80% of icon area) for system masking and padding. Essential for proper Android home screen appearance.

**Additional Configuration:**

- `prefer_related_applications`: `false` (don't suggest native app alternatives)

**Icon Requirements:**

- Minimum required: 192x192 (any purpose)
- Recommended: All sizes from 96x96 to 512x512
- For best Android support: Include maskable variants (192, 384, 512)

**Deployment Notes:**

- Ensure all icon files exist in `public/` directory
- Verify icon paths are correct (absolute paths from root)
- Test PWA installation flow on Android and iOS
- Validate manifest at: https://manifest-validator.appspot.com/

#### Type Definitions

**src/vite-env.d.ts**

Vite environment type definitions:

```typescript
/// <reference types="vite/client" />
```

Provides TypeScript types for Vite's `import.meta.env` and other Vite-specific features.
