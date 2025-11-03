import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

/**
 * Load environment variables from .env files
 * Load .env first, then .env.local (which overrides .env values)
 * This ensures getBaseUrl() has access to env vars when Playwright config is loaded
 * Note: dotenv's config() doesn't override existing env vars by default,
 * so we load .env.local with override: true to ensure proper precedence
 */
config(); // Loads .env by default
const envLocalPath = resolve(process.cwd(), '.env.local');
if (existsSync(envLocalPath)) {
	config({ path: envLocalPath, override: true }); // .env.local overrides .env
}

/**
 * Get the base URL for E2E tests
 * Uses E2E_BASE_URL if provided, otherwise derives from VITE_PORT and VITE_HOST
 * Defaults to localhost:5173 to match Vite's default port
 */
function getBaseUrl(): string {
	if (process.env['E2E_BASE_URL']) {
		return process.env['E2E_BASE_URL'];
	}
	const port = process.env['VITE_PORT'] ?? '5173';
	const host = process.env['VITE_HOST'] ?? '::';
	// Convert network interface bindings to localhost for URL usage
	// '::' (IPv6 all interfaces) and '0.0.0.0' (IPv4 all interfaces) both map to localhost
	const hostname = host === '::' || host === '0.0.0.0' ? 'localhost' : host;
	return `http://${hostname}:${port}`;
}

const baseUrl = getBaseUrl();

export default defineConfig({
	testDir: './e2e',
	timeout: 30_000,
	fullyParallel: true,
	reporter: [['list'], ['html', { open: 'never' }]],
	use: {
		baseURL: baseUrl,
		trace: 'on-first-retry',
		video: 'retain-on-failure',
		screenshot: 'only-on-failure',
	},
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
		{ name: 'firefox', use: { ...devices['Desktop Firefox'] } },
		{ name: 'webkit', use: { ...devices['Desktop Safari'] } },
	],
	webServer: {
		command: 'pnpm dev',
		url: baseUrl,
		reuseExistingServer: !process.env['CI'],
	},
});
