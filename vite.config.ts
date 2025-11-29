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
 *
 * Strategy: Split large libraries into separate chunks for better caching and parallel loading
 */
function getCoreLibrariesChunks() {
	return {
		// Split React core libraries for better caching
		// React changes less frequently than app code
		react: ['react', 'react/jsx-runtime'],
		'react-dom': ['react-dom', 'react-dom/client'],
		// React Router is large and can be cached separately
		'react-router': ['react-router-dom', 'react-router'],
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
		// Lucide React icons (large library, split for better code splitting)
		icons: ['lucide-react'],
		// Utility libraries
		utils: ['tailwind-merge', 'class-variance-authority'],
	};
}

/**
 * Check if a module ID matches a package pattern
 */
function matchesPackage(id: string, pkg: string): boolean {
	const packagePattern = `node_modules/${pkg}`;
	if (id.includes(packagePattern)) {
		return true;
	}

	// Handle scoped packages (e.g., @tanstack/react-query)
	if (pkg.startsWith('@')) {
		const [scope, name] = pkg.split('/');
		if (scope && name) {
			const scopedPattern = `node_modules/${scope}/${name}`;
			return id.includes(scopedPattern);
		}
	}

	// Handle non-scoped packages (match first part only)
	const [firstPart] = pkg.split('/');
	if (firstPart) {
		return id.includes(`node_modules/${firstPart}/`);
	}

	return false;
}

/**
 * Check if module belongs to additional utility libraries
 */
function getUtilityChunk(id: string): string | undefined {
	if (!id.includes('node_modules/')) {
		return undefined;
	}

	const utilityChunks: Record<string, string> = {
		'node_modules/zustand': 'zustand',
		'node_modules/sonner': 'sonner',
		'node_modules/react-markdown': 'markdown',
		'node_modules/react-syntax-highlighter': 'syntax-highlighter',
		'node_modules/qrcode.react': 'qrcode',
		'node_modules/web-vitals': 'web-vitals',
		'node_modules/@supabase': 'supabase',
	};

	for (const [pattern, chunkName] of Object.entries(utilityChunks)) {
		if (id.includes(pattern)) {
			return chunkName;
		}
	}

	return undefined;
}

/**
 * Manual chunks configuration for optimized bundle splitting
 *
 * This function creates a custom chunking strategy that:
 * 1. Separates vendor libraries into their own chunks for better caching
 * 2. Groups domain-specific code together
 * 3. Allows dynamic imports to create separate chunks automatically
 * 4. Prevents vendor chunk from becoming too large
 */
function getManualChunks(id: string) {
	// Core library chunks (vendor code)
	const coreChunks = getCoreLibrariesChunks();

	// Check if this module belongs to a core library chunk
	for (const [chunkName, packages] of Object.entries(coreChunks)) {
		for (const pkg of packages) {
			if (matchesPackage(id, pkg)) {
				return chunkName;
			}
		}
	}

	// Check for utility libraries
	const utilityChunk = getUtilityChunk(id);
	if (utilityChunk) {
		return utilityChunk;
	}

	// Domain-specific chunks are handled automatically via dynamic imports
	// Let Vite handle the rest automatically
	return undefined;
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
				manualChunks: getManualChunks,
				// Optimize chunk names for better caching
				chunkFileNames: 'assets/[name]-[hash].js',
				entryFileNames: 'assets/[name]-[hash].js',
				assetFileNames: 'assets/[name]-[hash].[ext]',
			},
			// Tree shaking optimizations for better dead code elimination
			treeshake: {
				moduleSideEffects: false,
				preset: 'smallest' as const,
			},
		},
		// Performance optimizations
		chunkSizeWarningLimit: Number.parseInt(env['VITE_CHUNK_SIZE_WARNING_LIMIT'] ?? '1000', 10),
		// Enable compressed size reporting in production by default for better visibility
		// Can be disabled by setting VITE_REPORT_COMPRESSED_SIZE=false
		reportCompressedSize: env['VITE_REPORT_COMPRESSED_SIZE'] !== 'false' && mode === 'production',
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
		preview: {
			// Ensure preview server properly serves static files and handles SPA routing
			host: env['VITE_PREVIEW_HOST'] ?? 'localhost',
			port: Number.parseInt(env['VITE_PREVIEW_PORT'] ?? '4173', 10),
			cors: true,
			// Enable SPA fallback for client-side routing
			// This ensures all routes are handled by index.html
		},
		plugins,
		build: getBuildConfig(env, mode),
		optimizeDeps: getOptimizeDepsConfig(),
		esbuild: getEsbuildConfig(),
	};
});
