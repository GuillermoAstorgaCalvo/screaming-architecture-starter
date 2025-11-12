### TypeScript Configuration (tsconfig) — Best Practices (2025)

This repo follows a two-level `tsconfig` setup tuned for React + Vite, strict typing, clean import aliases, and scalable domain boundaries.

#### Goals

- Modern ESM output and resolver aligned with Vite
- Strict and predictable type-safety
- Clear path aliases matching screaming architecture layers
- Fast DX without compromising correctness

#### Files

- `tsconfig.base.json`: shared compiler options and path aliases (extended by all other configs)
- `tsconfig.json`: project references orchestrator (coordinates app, node, and vitest configs)
- `tsconfig.app.json`: main application TypeScript config (used by Vite & IDE for `src/`)
- `tsconfig.node.json`: TypeScript config for Node/Vite config files and scripts (vite.config.ts, vitest.config.ts, playwright.config.ts, etc.)
- `tsconfig.vitest.json`: unit test environment config (Vitest + jsdom for `tests/` and `src/`)
- `tsconfig.build.json`: production build config (emits TypeScript declarations only, used separately in CI/CD)

#### Config Files Overview

| File                   | Purpose                                                           | Extends                | Includes                     |
| ---------------------- | ----------------------------------------------------------------- | ---------------------- | ---------------------------- |
| `tsconfig.base.json`   | Core compiler settings shared across all configs                  | —                      | —                            |
| `tsconfig.json`        | Project references orchestrator                                   | —                      | References app, node, vitest |
| `tsconfig.app.json`    | Main app config (used by Vite & IDE)                              | `./tsconfig.base.json` | `src/`                       |
| `tsconfig.node.json`   | TypeScript for Node/Vite config files (`vite.config.ts`, scripts) | `./tsconfig.base.json` | Config files, scripts        |
| `tsconfig.vitest.json` | Unit test environment config (Vitest + jsdom)                     | `./tsconfig.base.json` | `tests/`, `src/`             |
| `tsconfig.build.json`  | Used only for production builds / CI (emits declarations)         | `./tsconfig.base.json` | `src/` (excludes tests)      |

#### Baseline: tsconfig.base.json

```json
{
	"compilerOptions": {
		"target": "ES2023",
		"module": "ESNext",
		"moduleResolution": "bundler",
		"moduleDetection": "force",
		"verbatimModuleSyntax": true,

		"strict": true,
		"exactOptionalPropertyTypes": true,
		"noUncheckedIndexedAccess": true,
		"noUnusedLocals": false,
		"noUnusedParameters": false,
		"useDefineForClassFields": true,
		"noFallthroughCasesInSwitch": true,
		"noImplicitOverride": true,
		"noImplicitReturns": true,

		"jsx": "react-jsx",
		"resolveJsonModule": true,
		"isolatedModules": true,
		"skipLibCheck": true,
		"forceConsistentCasingInFileNames": true,
		"allowJs": false,
		"checkJs": false,
		"noEmit": true,

		"lib": ["ES2023", "DOM", "DOM.Iterable"],

		"baseUrl": ".",
		"paths": {
			"@app/*": ["src/app/*"],
			"@core/*": ["src/core/*"],
			"@domains/*": ["src/domains/*"],
			"@infra/*": ["src/infrastructure/*"],
			"@shared/*": ["src/shared/*"],
			"@styles/*": ["src/styles/*"],
			"@src-types/*": ["src/types/*"],
			"@tests/*": ["tests/*"]
		}
	}
}
```

#### Project References: tsconfig.json

```json
{
	"files": [],
	"references": [
		{ "path": "./tsconfig.app.json" },
		{ "path": "./tsconfig.node.json" },
		{ "path": "./tsconfig.vitest.json" }
	]
}
```

**Note:** `tsconfig.vitest.json` is included in project references for better IDE support for test files, incremental builds, and proper type checking across the entire project graph. The `tsconfig.build.json` is not included in project references because it's only used for emitting type declarations during CI/CD builds (invoked separately via `tsc -b tsconfig.build.json`).

#### Application: tsconfig.app.json

```json
{
	"extends": "./tsconfig.base.json",
	"compilerOptions": {
		"composite": true,
		"tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
		"types": ["node"],
		"allowImportingTsExtensions": true,
		"noUnusedLocals": true,
		"noUnusedParameters": true,
		"erasableSyntaxOnly": true,
		"noUncheckedSideEffectImports": true,
		"noPropertyAccessFromIndexSignature": true,
		"allowUnusedLabels": false,
		"allowUnreachableCode": false,
		"sourceMap": true
	},
	"include": ["src"],
	"exclude": ["node_modules", "dist", "build", "src/test", "**/*.test.*", "**/*.spec.*"]
}
```

#### Rationale for Key Options

- **moduleResolution: "bundler"**: Matches Vite's ESM resolver; prevents CJS/ESM edge cases.
- **verbatimModuleSyntax**: Preserves `import type` and side effects; improves tree-shaking and correctness.
- **strict + exactOptionalPropertyTypes + noUncheckedIndexedAccess**: Safer, more explicit domain models.
- **isolatedModules + noEmit**: Optimized for Vite; TS only type-checks, Vite emits.
- **skipLibCheck: true**: Faster type checking; libraries are assumed correct (can toggle to `false` for comprehensive dependency type checking if issues arise).
- **composite**: Enables project references for incremental builds and faster IDE feedback.
- **paths/baseUrl**: Enforces clear boundaries via aliases (`@app`, `@core`, `@domains`, `@infra`, `@shared`, `@styles`, `@tests`). Coordinate with ESLint boundaries rules.
- **erasableSyntaxOnly**: Ensures code can be erased to JavaScript (no runtime TypeScript features).
- **noUncheckedSideEffectImports**: Requires explicit side-effect imports (`import "./file"`).

#### Per-environment Overrides

**Node Config: tsconfig.node.json**

For Node/Vite config files and scripts:

```json
{
	"extends": "./tsconfig.base.json",
	"compilerOptions": {
		"composite": true,
		"tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
		"lib": ["ES2023"],
		"types": ["node"],
		"allowImportingTsExtensions": true,
		"noUnusedLocals": true,
		"noUnusedParameters": true,
		"erasableSyntaxOnly": true,
		"noUncheckedSideEffectImports": true,
		"noPropertyAccessFromIndexSignature": true,
		"allowUnusedLabels": false,
		"allowUnreachableCode": false
	},
	"include": [
		"vite.config.ts",
		"vitest.config.ts",
		"playwright.config.ts",
		"eslint.config.js",
		"tailwind.config.ts",
		"postcss.config.cjs",
		"scripts/**/*.{ts,tsx}",
		// Included because tailwind.config.ts imports from app source
		"src/core/constants/designTokens.ts"
	],
	"exclude": ["node_modules", "dist", "build"]
}
```

**Vitest Config: tsconfig.vitest.json**

For unit tests with Vitest globals:

```json
{
	"extends": "./tsconfig.base.json",
	"compilerOptions": {
		"composite": true,
		"tsBuildInfoFile": "./node_modules/.tmp/tsconfig.vitest.tsbuildinfo",
		"lib": ["ES2023", "DOM", "DOM.Iterable"],
		"types": ["vitest/globals", "@testing-library/jest-dom"],
		"noUnusedLocals": false, // Relaxed for tests (mocks, test utilities may appear unused)
		"noUnusedParameters": false // Relaxed for tests (test helpers may have unused params)
	},
	"include": ["tests", "src"],
	"exclude": ["node_modules", "dist", "build", "e2e"]
}
```

**Build Config: tsconfig.build.json**

For production builds that emit TypeScript declarations:

```json
{
	"extends": "./tsconfig.base.json",
	"compilerOptions": {
		"composite": true,
		"tsBuildInfoFile": "./node_modules/.tmp/tsconfig.build.tsbuildinfo",
		"noEmit": false,
		"declaration": true,
		"declarationMap": false,
		"emitDeclarationOnly": true,
		"declarationDir": "dist/types",
		"sourceMap": false,
		"allowImportingTsExtensions": true,
		"noUnusedLocals": true,
		"noUnusedParameters": true,
		"erasableSyntaxOnly": true,
		"noUncheckedSideEffectImports": true,
		"noPropertyAccessFromIndexSignature": true,
		"allowUnusedLabels": false,
		"allowUnreachableCode": false
	},
	"include": ["src"],
	"exclude": ["**/*.test.*", "**/*.spec.*", "tests", "e2e"]
}
```

**Compiler Options Alignment:** This config includes the same strict compiler options as `tsconfig.app.json` (`allowImportingTsExtensions`, `erasableSyntaxOnly`, `noUncheckedSideEffectImports`, `noPropertyAccessFromIndexSignature`, `allowUnusedLabels`, `allowUnreachableCode`) to ensure consistent type safety between development type-checking and declaration generation. This alignment prevents type mismatches when generating declarations separately from the main development workflow.

#### Monorepo / Project References

This repo uses TypeScript project references via `tsconfig.json` to coordinate `tsconfig.app.json`, `tsconfig.node.json`, and `tsconfig.vitest.json`. The `composite: true` flag enables incremental builds and faster IDE feedback.

**Note:** `tsconfig.build.json` is not included in project references because it's only used for emitting type declarations (`emitDeclarationOnly: true`) and is typically invoked separately during CI/CD builds rather than as part of the main development workflow.

When scaling to workspaces, keep aliases in `tsconfig.base.json` at the repo root. Each package/project `tsconfig.json` should extend the base and narrow `include`/`exclude`. Use `composite` and `references` for library builds; keep app `noEmit: true` except for `tsconfig.build.json` which emits declarations.

#### DX Scripts

- `pnpm typecheck`: `tsc -b` for project references support
- `pnpm build`: `tsc -b && vite build` to ensure type safety before bundling

#### Common Pitfalls

- Mixing CJS and ESM config (keep ESM consistently; align Vite `build.target` with `tsconfig` `target/lib`).
- Long relative imports (`../../..`): prefer aliases; enforce with ESLint.
- Barrel exports that re-export entire folders: avoid to keep dependency graphs explicit. Always import directly from specific files.

#### Status in this Repo

- Docs define the baseline above. If `tsconfig.base.json` / `tsconfig.json` are missing in your local clone, scaffold them using the snippets here and keep them committed.

#### Recent Improvements

**Configuration Alignment (Latest):**

- **`tsconfig.build.json`** now includes the same strict compiler options as `tsconfig.app.json`:
  - `allowImportingTsExtensions`: Enables `.ts` extension imports (aligned with Vite)
  - `erasableSyntaxOnly`: Ensures all TypeScript features can be erased to JavaScript
  - `noUncheckedSideEffectImports`: Requires explicit side-effect imports
  - `noPropertyAccessFromIndexSignature`: Prevents unsafe property access
  - `allowUnusedLabels`: Disabled for cleaner code
  - `allowUnreachableCode`: Disabled for safer code

  This ensures consistent type safety between development type-checking (`tsc -b` with app config) and declaration generation (`tsc -b tsconfig.build.json`).

- **`tsconfig.json`** project references now include `tsconfig.vitest.json` for improved IDE support and incremental builds across test files.
