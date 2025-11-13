import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { sourceTagger } from './vite-plugin-source-tagger';

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
		// Virtualization library (used in virtualized list components)
		virtual: ['@tanstack/react-virtual'],
		// Animation library (large, used in motion components)
		motion: ['framer-motion'],
		// Chart library (large, used in chart components)
		charts: ['recharts'],
		// Rich text editor (large, used in editor components)
		editor: ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-placeholder'],
		// Form libraries
		forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
		// I18n libraries
		i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
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

/**
 * Get bundle visualizer plugin configuration
 * Only enabled in production builds or when VITE_ANALYZE is set to 'true'
 */
function getVisualizerPlugin(env: Record<string, string>, mode: string) {
	const shouldAnalyze =
		env['VITE_ANALYZE'] === 'true' || (mode === 'production' && env['VITE_ANALYZE'] !== 'false');

	if (!shouldAnalyze) {
		return null;
	}

	return visualizer({
		filename: 'dist/stats.html',
		open: env['VITE_ANALYZE_OPEN'] === 'true',
		gzipSize: true,
		brotliSize: true,
		template: 'treemap', // 'sunburst' | 'treemap' | 'network'
	});
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	// Load environment variables
	// Note: Vite automatically sets NODE_ENV based on mode, so no manual setting needed
	const env = loadEnv(mode, process.cwd(), '');

	const plugins = [
		sourceTagger(), // Add source file tags in development
		react(),
		tsconfigPaths({
			projects: ['./tsconfig.app.json'],
		}),
	];

	const visualizerPlugin = getVisualizerPlugin(env, mode);
	if (visualizerPlugin) {
		// Type assertion needed due to Rollup/Vite plugin type incompatibility
		plugins.push(visualizerPlugin as Plugin);
	}

	return {
		server: getServerConfig(env),
		plugins,
		build: getBuildConfig(env, mode),
		optimizeDeps: getOptimizeDepsConfig(),
		esbuild: getEsbuildConfig(),
	};
});
