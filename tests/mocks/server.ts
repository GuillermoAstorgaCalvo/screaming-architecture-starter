/**
 * MSW server setup utilities
 *
 * Provides helpers for setting up MSW in different environments:
 * - Node.js (for Vitest)
 * - Browser (for Playwright E2E tests)
 *
 * Note: MSW needs to be installed before using these utilities.
 * Install with: `pnpm add -D msw`
 */

/**
 * Type definitions for MSW (placeholder until MSW is installed)
 * When MSW is installed, these will be replaced with actual types
 */

export interface SetupServerApi {
	listen: (options?: { onUnhandledRequest?: 'error' | 'warn' | 'bypass' }) => void;
	resetHandlers: (handlers?: unknown[]) => void;
	close: () => void;
	use: (...handlers: unknown[]) => void;
}

/**
 * Setup MSW server for Node.js environment (Vitest)
 *
 * Call this in your test setup file (e.g., tests/setupTests.ts)
 * with the appropriate vitest lifecycle hooks.
 *
 * @example
 * ```ts
 * import { setupServer } from 'msw/node';
 * import { handlers } from '@tests/mocks/handlers';
 *
 * export const server = setupServer(...handlers);
 *
 * beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
 * afterEach(() => server.resetHandlers());
 * afterAll(() => server.close());
 * ```
 *
 * Note: The lifecycle hooks (beforeAll, afterEach, afterAll) must be called
 * directly in your test setup file, not inside this utility function.
 */

/**
 * Get MSW server setup instructions
 * Useful for documentation or README
 */
export function getMSWSetupInstructions(): string {
	return `
# MSW Setup Instructions

## Installation
\`\`\`bash
pnpm add -D msw
\`\`\`

## Setup for Vitest (Unit Tests)

1. Create a service worker file:
\`\`\`bash
pnpm dlx msw init public/ --save
\`\`\`

2. In \`tests/setupTests.ts\`:
\`\`\`ts
import { setupServer } from 'msw/node';
import { handlers } from '@tests/mocks/handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
\`\`\`

## Setup for Playwright (E2E Tests)

1. Install MSW for Playwright:
\`\`\`ts
// In playwright.config.ts or e2e setup file
import { setupServer } from 'msw/node';
import { handlers } from '@tests/mocks/handlers';

const server = setupServer(...handlers);

server.listen();
\`\`\`

## Usage in Tests

\`\`\`ts
import { http, HttpResponse } from 'msw';
import { server } from './setupTests'; // Import from your setup file
import { buildApiResponse } from '@tests/factories/apiFactories';

// Override handler for specific test
server.use(
  http.get('/api/slideshow', () => {
    return HttpResponse.json(buildApiResponse());
  })
);
\`\`\`
`.trim();
}
