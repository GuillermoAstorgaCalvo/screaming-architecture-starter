# Troubleshooting Guide

This guide covers common issues and solutions when working with the Screaming Architecture starter.

## Build Errors

### Vite Build Fails with Module Resolution Errors

**Symptoms:**

- Build fails with errors like `Cannot find module '@core/...'` or `Cannot resolve '@app/...'`
- TypeScript path aliases not resolving during build

**Solutions:**

1. **Verify TypeScript path aliases are configured correctly:**
   - Check `tsconfig.base.json` for path mappings
   - Ensure `vite-tsconfig-paths` plugin is installed and configured in `vite.config.ts`
   - Verify the plugin uses the correct project reference: `projects: ['./tsconfig.app.json']`

2. **Clear build cache and rebuild:**

   ```bash
   pnpm run clean
   pnpm install
   pnpm run build
   ```

3. **Check for circular dependencies:**
   - Run `pnpm run lint` to detect import cycles
   - Review module boundaries (domains should not import each other)

### Build Fails with "Cannot find module" for Dependencies

**Symptoms:**

- Build errors referencing missing packages
- `node_modules` appears incomplete

**Solutions:**

1. **Reinstall dependencies:**

   ```bash
   pnpm run clean
   pnpm install
   ```

2. **Verify package manager version:**
   - Ensure you're using the correct pnpm version: `10.22.0+sha512.bf049efe995b28f527fd2b41ae0474ce29186f7edcb3bf545087bd61fbbebb2bf75362d1307fda09c2d288e1e499787ac12d4fcb617a974718a6051f2eee741c`
   - Check `.npmrc` for `package-manager-strict=true` enforcement

3. **Clear pnpm store:**
   ```bash
   pnpm store prune
   pnpm install
   ```

### Build Output Size Warnings

**Symptoms:**

- Warnings about chunk sizes exceeding limits
- Build succeeds but shows performance warnings

**Solutions:**

1. **Review bundle analysis:**
   - Enable bundle analyzer: Set `VITE_ANALYZE=true` in `.env`
   - Run `pnpm run build` to generate `dist/stats.html`
   - Identify large dependencies and consider code splitting

2. **Adjust chunk size warning limit:**
   - Set `VITE_CHUNK_SIZE_WARNING_LIMIT` in `.env` (default: 1000 KB)
   - Increase if warnings are expected for specific chunks

3. **Optimize manual chunks:**
   - Review `vite.config.ts` `getManualChunks()` function
   - Ensure large libraries (e.g., `framer-motion`, `recharts`) are in separate chunks

### Build Fails with TypeScript Errors

**Symptoms:**

- Type errors during build even though IDE shows no errors
- `tsc -b` fails before Vite build

**Solutions:**

1. **Run type checking separately:**

   ```bash
   pnpm run typecheck
   ```

   - This runs `tsc -b` which checks all TypeScript project references
   - Fix any reported errors before building

2. **Verify TypeScript project references:**
   - Check `tsconfig.json` includes all necessary references
   - Ensure `tsconfig.app.json`, `tsconfig.node.json`, and `tsconfig.vitest.json` are properly configured

3. **Clear TypeScript build info:**
   ```bash
   rm -f tsconfig*.tsbuildinfo
   pnpm run typecheck
   ```

### Build Fails with PostCSS/Tailwind Errors

**Symptoms:**

- Errors related to Tailwind CSS compilation
- PostCSS plugin errors

**Solutions:**

1. **Verify Tailwind configuration:**
   - Check `tailwind.config.ts` content paths include all source files
   - Ensure `postcss.config.cjs` includes `@tailwindcss/postcss` plugin

2. **Clear cache and rebuild:**
   ```bash
   rm -rf .vite dist
   pnpm run build
   ```

## Dependency Issues

### Package Manager Version Mismatch

**Symptoms:**

- `pnpm install` fails with version errors
- Corepack or package manager strict mode errors

**Solutions:**

1. **Enable Corepack (if not already enabled):**

   ```bash
   corepack enable
   ```

2. **Use the exact pnpm version:**
   - The project requires: `pnpm@10.22.0+sha512.bf049efe995b28f527fd2b41ae0474ce29186f7edcb3bf545087bd61fbbebb2bf75362d1307fda09c2d288e1e499787ac12d4fcb617a974718a6051f2eee741c`
   - Corepack should automatically use the correct version from `package.json`

3. **Verify `.npmrc` configuration:**
   - Ensure `package-manager-strict=true` and `engine-strict=true` are set
   - These enforce the correct package manager and Node.js versions

### Node.js Version Mismatch

**Symptoms:**

- Installation or build fails
- Errors about unsupported Node.js features

**Solutions:**

1. **Check Node.js version:**

   ```bash
   node --version
   ```

   - Required: `>=22.21.1` (see `package.json` `engines.node`)

2. **Use version manager:**

   ```bash
   # With nvm
   nvm use
   # or
   nvm install

   # With nodenv
   nodenv install
   nodenv local
   ```

3. **Verify `.nvmrc` file:**
   - Should contain `22.21.1`
   - Version managers automatically detect this file

### Peer Dependency Warnings

**Symptoms:**

- Warnings about missing or incorrect peer dependencies
- Packages not working correctly despite being installed

**Solutions:**

1. **Auto-install peers (enabled by default):**
   - `.npmrc` includes `auto-install-peers=true`
   - If warnings persist, try:
     ```bash
     pnpm install --force
     ```

2. **Check peer dependency requirements:**
   - Review package documentation for required peer dependencies
   - Ensure compatible versions are installed

### Lock File Conflicts

**Symptoms:**

- `pnpm-lock.yaml` conflicts in Git
- Dependencies differ between team members

**Solutions:**

1. **Regenerate lock file:**

   ```bash
   rm pnpm-lock.yaml
   pnpm install
   ```

2. **Resolve conflicts:**
   - Accept incoming changes if unsure
   - Regenerate lock file after resolving
   - Commit the updated `pnpm-lock.yaml`

3. **Ensure consistent package manager:**
   - All team members should use the same pnpm version
   - Use Corepack to enforce version consistency

### Dependency Resolution Errors

**Symptoms:**

- `pnpm install` fails with resolution errors
- Conflicting version requirements

**Solutions:**

1. **Clear pnpm store:**

   ```bash
   pnpm store prune
   pnpm install
   ```

2. **Check for workspace conflicts:**
   - Review `pnpm-workspace.yaml` if using workspaces
   - Ensure `onlyBuiltDependencies` list is correct

3. **Verify registry access:**
   - Ensure npm registry is accessible
   - Check for corporate proxy/firewall issues

## Port Conflicts

### Port 5173 Already in Use

**Symptoms:**

- Dev server fails to start
- Error: `Port 5173 is already in use`

**Solutions:**

1. **Change the port via environment variable:**
   - Create or update `.env` or `.env.local`:
     ```bash
     VITE_PORT=5174
     ```
   - Restart the dev server: `pnpm run dev`

2. **Find and kill the process using the port:**

   ```bash
   # Windows (PowerShell)
   netstat -ano | findstr :5173
   taskkill /PID <PID> /F

   # macOS/Linux
   lsof -ti:5173 | xargs kill -9
   ```

3. **Use a different port temporarily:**
   ```bash
   VITE_PORT=3000 pnpm run dev
   ```

### Multiple Dev Servers Running

**Symptoms:**

- Multiple instances of the app trying to use the same port
- Confusion about which server is active

**Solutions:**

1. **Stop all running dev servers:**
   - Press `Ctrl+C` in all terminal windows running `pnpm run dev`
   - Verify no processes are running on the port

2. **Check for background processes:**
   - Look for Node.js processes in Task Manager (Windows) or Activity Monitor (macOS)
   - Kill any orphaned processes

3. **Use process manager:**
   - Consider using `pm2` or similar for process management
   - Ensures only one instance runs at a time

### Docker Port Conflicts

**Symptoms:**

- Docker container fails to start
- Port mapping conflicts with host

**Solutions:**

1. **Change Docker port mapping:**
   - Edit `docker-compose.yml`:
     ```yaml
     ports:
       - '5174:5173' # Host:Container
     ```
   - Update `VITE_PORT=5174` in container environment if needed

2. **Stop conflicting containers:**

   ```bash
   pnpm run docker:down
   docker ps -a  # Check for other containers
   docker stop <container-id>
   ```

3. **Use different host port:**
   - Map container port 5173 to a different host port
   - Access app via the new host port

## TypeScript Errors

### Type Errors in IDE but Build Succeeds

**Symptoms:**

- IDE shows red squiggles
- `pnpm run typecheck` or `pnpm run build` succeeds

**Solutions:**

1. **Restart TypeScript server:**
   - VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
   - Other IDEs: Restart IDE or TypeScript language service

2. **Verify IDE is using correct TypeScript version:**
   - Check IDE settings for TypeScript version
   - Ensure it uses the project's TypeScript (from `node_modules`)

3. **Check for workspace configuration issues:**
   - Verify `tsconfig.json` project references are correct
   - Ensure all referenced projects exist and are valid

### Module Resolution Errors

**Symptoms:**

- TypeScript cannot resolve path aliases (`@core`, `@app`, etc.)
- Errors like `Cannot find module '@core/...'`

**Solutions:**

1. **Verify path aliases in `tsconfig.base.json`:**
   - Check `compilerOptions.paths` includes all necessary aliases
   - Ensure paths match the actual directory structure

2. **Check project references:**
   - Verify `tsconfig.app.json` extends `tsconfig.base.json`
   - Ensure `tsconfig.json` includes all necessary project references

3. **Restart TypeScript server:**
   - Often resolves after IDE restart or TS server restart

### Type Errors After Dependency Updates

**Symptoms:**

- Type errors appear after updating packages
- Breaking changes in type definitions

**Solutions:**

1. **Check for breaking changes:**
   - Review package changelogs
   - Check for major version updates that may have breaking changes

2. **Update type definitions:**

   ```bash
   pnpm install --save-dev @types/<package-name>@latest
   ```

3. **Review TypeScript version compatibility:**
   - Ensure TypeScript version (5.9.3) is compatible with updated packages
   - Some packages may require newer TypeScript versions

### Strict Type Checking Errors

**Symptoms:**

- Many type errors after enabling strict mode
- `any` type usage flagged

**Solutions:**

1. **Gradually enable strict options:**
   - Don't enable all strict options at once
   - Start with `strict: true` and disable specific rules if needed

2. **Fix `any` types:**
   - Replace `any` with proper types
   - Use `unknown` for truly unknown types
   - Use type assertions only when necessary

3. **Use type utilities:**
   - Leverage TypeScript utility types (`Partial`, `Pick`, `Omit`, etc.)
   - Create custom type helpers for common patterns

### Import Type Errors

**Symptoms:**

- Errors about type-only imports
- ESLint errors about `import type` usage

**Solutions:**

1. **Use `import type` for type-only imports:**

   ```typescript
   import type { User } from '@domains/users/types';
   import { getUser } from '@domains/users/services';
   ```

2. **Fix ESLint configuration:**
   - Ensure `@typescript-eslint/consistent-type-imports` rule is enabled
   - Run `pnpm run lint:fix` to auto-fix import types

3. **Verify import/export consistency:**
   - Ensure types are properly exported from modules
   - Check for circular type dependencies

## Test Failures

### Vitest Tests Fail on Windows

**Symptoms:**

- Tests fail with `ERR_IPC_CHANNEL_CLOSED` or `EPIPE` errors
- Worker communication errors
- `Error: [vitest-pool]: Timeout starting forks runner.`

**Recommended Solution: Use Docker**

The best solution is to run tests using Docker, which provides a consistent Linux environment:

```bash
# Run tests with Docker
pnpm run docker:test

# Run tests with coverage
pnpm run docker:test -- --coverage

# Run tests in watch mode
pnpm run docker:test:watch
```

See [Docker Setup Guide](docker-setup.md) for complete Docker instructions.

**Alternative Solutions (if Docker is not available):**

1. **Verify Windows-specific configuration:**
   - `vitest.config.ts` should use `pool: 'forks'` on Windows
   - `maxConcurrency: 1` is set for Windows (runs tests serially)
   - This is already configured in the project

2. **If issues persist:**
   - Ensure you're using the latest Vitest version
   - Try running tests with reduced concurrency:
     ```bash
     pnpm run test -- --maxConcurrency=1
     ```
   - Consider using WSL (Windows Subsystem for Linux) as an alternative

### Tests Fail with Module Resolution Errors

**Symptoms:**

- Tests cannot resolve path aliases
- `Cannot find module '@core/...'` in tests

**Solutions:**

1. **Verify Vitest configuration:**
   - Check `vitest.config.ts` includes `vite-tsconfig-paths` plugin
   - Ensure plugin uses `tsconfig.vitest.json` project reference

2. **Check test file location:**
   - Tests should be in `tests/` or match pattern `src/**/*.{test,spec}.{ts,tsx}`
   - Verify `vitest.config.ts` `include` patterns match your test files

3. **Verify `tsconfig.vitest.json`:**
   - Should extend `tsconfig.base.json` to inherit path aliases
   - Check `compilerOptions.paths` are included

### MSW (Mock Service Worker) Not Working

**Symptoms:**

- API calls in tests hit real endpoints
- MSW handlers not intercepting requests

**Solutions:**

1. **Verify MSW setup:**
   - Check `tests/setupTests.ts` initializes MSW server
   - Ensure handlers are imported and registered

2. **Check handler registration:**
   - Verify handlers from `tests/mocks/handlers.ts` are included
   - Add custom handlers if needed:

     ```typescript
     import { server } from '@tests/mocks/server';
     import { http, HttpResponse } from 'msw';

     server.use(http.get('/api/custom', () => HttpResponse.json({ data: 'test' })));
     ```

3. **Verify MSW version compatibility:**
   - Ensure MSW version (2.12.1) is compatible with your setup
   - Check for breaking changes in MSW updates

### Test Timeout Errors

**Symptoms:**

- Tests fail with timeout errors
- `testTimeout` exceeded

**Solutions:**

1. **Increase timeout for specific tests:**

   ```typescript
   it(
   	'slow test',
   	async () => {
   		// test code
   	},
   	{ timeout: 20000 }
   ); // 20 seconds
   ```

2. **Adjust global timeout:**
   - `vitest.config.ts` has `testTimeout: 10000` (10 seconds)
   - Increase if needed for slower tests

3. **Optimize slow tests:**
   - Mock external dependencies
   - Avoid real network calls
   - Use `vi.useFakeTimers()` for time-dependent tests

### Playwright E2E Tests Fail

**Symptoms:**

- E2E tests fail to start
- Browser not launching
- Tests timeout

**Solutions:**

1. **Install Playwright browsers:**

   ```bash
   npx playwright install
   ```

2. **Verify dev server is running:**
   - Playwright config starts server automatically via `webServer`
   - Check `playwright.config.ts` `webServer.command` is correct
   - Ensure `baseURL` matches dev server URL

3. **Check environment variables:**
   - Verify `E2E_BASE_URL` or `VITE_PORT`/`VITE_HOST` are set correctly
   - Playwright loads `.env` and `.env.local` automatically

4. **Run with UI for debugging:**

   ```bash
   pnpm run test:e2e:ui
   ```

   - Helps identify what's happening during test execution

5. **Check for port conflicts:**
   - Ensure dev server port is available
   - Verify no other process is using the port

### Coverage Report Issues

**Symptoms:**

- Coverage report not generated
- Incorrect coverage percentages
- Tests fail before coverage can be generated

**Solutions:**

1. **On Windows: Use Docker for coverage reports**

   ```bash
   # Run tests with coverage using Docker
   pnpm run docker:test -- --coverage
   ```

   This avoids Windows fork runner issues that prevent coverage generation.

2. **On Mac/Linux: Run coverage natively**

   ```bash
   pnpm run test:coverage
   ```

3. **Verify coverage configuration:**
   - Check `vitest.config.ts` `coverage` section
   - Ensure `provider: 'v8'` is set
   - Verify `include` and `exclude` patterns are correct

4. **Check coverage directory:**
   - Reports are generated in `./coverage`
   - HTML report: `coverage/index.html`
   - Ensure directory is not gitignored if you need to commit reports

### Test Utilities Not Found

**Symptoms:**

- Cannot import from `@tests/utils/testUtils`
- Type errors with test helpers

**Solutions:**

1. **Verify path alias:**
   - Check `tsconfig.base.json` includes `@tests/*` path mapping
   - Ensure `tsconfig.vitest.json` extends base config

2. **Check import paths:**
   - Use `@tests/utils/testUtils` not relative paths
   - Verify file exists at `tests/utils/testUtils.tsx`

3. **Restart TypeScript server:**
   - IDE may need refresh to recognize new test utilities

## General Troubleshooting Tips

### Clear All Caches

When in doubt, clear all caches and rebuild:

```bash
# Clean everything
pnpm run clean

# Reinstall dependencies
pnpm install

# Clear Vite cache
rm -rf .vite

# Clear TypeScript build info
rm -f tsconfig*.tsbuildinfo

# Rebuild
pnpm run build
```

### Verify Environment Setup

1. **Check Node.js version:**

   ```bash
   node --version  # Should be >=22.21.1
   ```

2. **Check pnpm version:**

   ```bash
   pnpm --version  # Should match package.json
   ```

3. **Verify Corepack is enabled:**
   ```bash
   corepack enable
   ```

### Check Configuration Files

1. **Verify all config files exist:**
   - `tsconfig.json`, `tsconfig.base.json`, `tsconfig.app.json`
   - `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts`
   - `eslint.config.js`, `tailwind.config.ts`, `postcss.config.cjs`

2. **Check for syntax errors:**
   - Run `pnpm run lint` to catch configuration issues
   - Verify JSON files are valid

### Review Logs

1. **Check build logs:**
   - Look for specific error messages
   - Check for warnings that might indicate issues

2. **Enable verbose logging:**

   ```bash
   # Vite
   DEBUG=vite:* pnpm run dev

   # TypeScript
   pnpm run typecheck --verbose
   ```

### Get Help

If issues persist:

1. **Check existing documentation:**
   - Review `docs/` directory for detailed guides
   - Check `README.md` for setup instructions

2. **Review error messages:**
   - Copy full error output
   - Search for similar issues in package repositories

3. **Verify against known working state:**
   - Check if issue exists in a fresh clone
   - Compare your changes with the base template
