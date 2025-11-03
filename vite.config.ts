import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Server configuration with environment variable support
 */
function getServerConfig(env: Record<string, string>) {
	const port = Number.parseInt(env['VITE_PORT'] ?? '5173', 10);
	const host = env['VITE_HOST'] ?? '::';

	return {
		host,
		port,
		open: env['VITE_OPEN'] !== 'false',
		cors: true,
		strictPort: false,
	};
}

/**
 * Core library chunks for better code splitting and caching
 * Only includes packages that are actually installed in the project
 */
function getCoreLibrariesChunks() {
	return {
		// Core React libraries
		vendor: ['react', 'react-dom', 'react-router-dom'],
		// UI libraries (only installed packages)
		ui: ['@radix-ui/react-slot'],
		// Query and state management
		query: ['@tanstack/react-query'],
	};
}

/**
 * Manual chunks configuration for optimized bundle splitting
 */
function getManualChunks() {
	return {
		...getCoreLibrariesChunks(),
	};
}

/**
 * Build configuration with environment-aware settings
 */
function getBuildConfig(env: Record<string, string>, mode: string) {
	const getMinifyOption = (): boolean | 'esbuild' | 'terser' => {
		if (env['VITE_MINIFY'] === 'false') return false;
		if (env['VITE_MINIFY'] === 'esbuild') return 'esbuild';
		if (env['VITE_MINIFY'] === 'terser') return 'terser';
		return mode === 'production' ? 'esbuild' : false;
	};

	const getSourcemapOption = (): boolean | 'inline' => {
		if (env['VITE_SOURCEMAP'] === 'true') return true;
		if (env['VITE_SOURCEMAP'] === 'false') return false;
		if (env['VITE_SOURCEMAP'] === 'inline') return 'inline';
		return mode === 'development' ? 'inline' : false;
	};

	return {
		target: env['VITE_BUILD_TARGET'] ?? 'es2023',
		minify: getMinifyOption(),
		sourcemap: getSourcemapOption(),
		rollupOptions: {
			output: {
				manualChunks: getManualChunks(),
				// Optimize chunk names for better caching
				chunkFileNames: 'assets/[name]-[hash].js',
				entryFileNames: 'assets/[name]-[hash].js',
				assetFileNames: 'assets/[name]-[hash].[ext]',
			},
		},
		// Performance optimizations
		chunkSizeWarningLimit: Number.parseInt(env['VITE_CHUNK_SIZE_WARNING_LIMIT'] ?? '1000', 10),
		reportCompressedSize: env['VITE_REPORT_COMPRESSED_SIZE'] === 'true',
		cssCodeSplit: env['VITE_CSS_CODE_SPLIT'] !== 'false',
	};
}

/**
 * Dependency optimization configuration
 * Pre-bundles commonly used dependencies for faster dev server startup
 */
function getOptimizeDepsConfig() {
	return {
		include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query', 'lucide-react'],
		force: true,
	};
}

/**
 * ESBuild configuration for transpilation
 */
function getEsbuildConfig() {
	return {
		target: 'es2023',
		format: 'esm' as const,
	};
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	// Load environment variables
	// Note: Vite automatically sets NODE_ENV based on mode, so no manual setting needed
	const env = loadEnv(mode, process.cwd(), '');

	return {
		server: getServerConfig(env),
		plugins: [
			react(),
			tsconfigPaths({
				projects: ['./tsconfig.app.json'],
			}),
		],
		build: getBuildConfig(env, mode),
		optimizeDeps: getOptimizeDepsConfig(),
		esbuild: getEsbuildConfig(),
	};
});
