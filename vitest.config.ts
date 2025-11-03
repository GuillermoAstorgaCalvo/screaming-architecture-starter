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
		coverage: {
			provider: 'v8',
			reporter: ['text', 'lcov', 'html'],
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
