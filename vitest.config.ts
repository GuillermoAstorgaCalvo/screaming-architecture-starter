import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['tests/setupTests.ts'],
		include: ['tests/**/*.{test,spec}.{ts,tsx}', 'src/**/*.{test,spec}.{ts,tsx}'],
		exclude: ['node_modules', 'dist', 'e2e'],
		// Use forks pool on Windows for better stability (avoids ERR_IPC_CHANNEL_CLOSED/EPIPE)
		// This prevents worker communication errors that occur with threads pool on Windows
		pool: process.platform === 'win32' ? 'forks' : 'threads',
		// Reduce concurrency on Windows to prevent IPC channel and pipe errors
		// Lower values help prevent worker crashes and channel closure errors
		// Setting to 1 runs tests serially, which is most stable on Windows
		...(process.platform === 'win32' && { maxConcurrency: 1 }),
		coverage: {
			provider: 'v8',
			reporter: ['text', 'lcov', 'html'],
			include: ['src/**/*.{ts,tsx}'],
			exclude: [
				'node_modules/',
				'tests/',
				'e2e/',
				'**/*.test.{ts,tsx}',
				'**/*.spec.{ts,tsx}',
				'**/*.config.{ts,js}',
				'**/dist/**',
				'**/build/**',
				'**/coverage/**',
				'**/*.d.ts',
				'**/vite-env.d.ts',
			],
			reportsDirectory: './coverage',
			// Coverage thresholds (optional - uncomment and adjust as needed)
			// thresholds: {
			// 	lines: 80,
			// 	functions: 80,
			// 	branches: 80,
			// 	statements: 80,
			// },
		},
		testTimeout: 10000,
		hookTimeout: 10000,
	},
	plugins: [
		react(),
		tsconfigPaths({
			projects: ['./tsconfig.vitest.json'],
		}),
	],
});
