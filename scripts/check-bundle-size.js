#!/usr/bin/env node

/**
 * Bundle Size Check Script
 *
 * Checks if bundle sizes are within acceptable limits and reports any regressions.
 * This script is designed to run in CI to catch bundle size regressions early.
 *
 * Usage:
 *   node scripts/check-bundle-size.js [--max-main-kb=200] [--max-css-kb=100]
 */

/* eslint-env node */
/* global process, console */

import { readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Default thresholds (in KB, gzipped)
const DEFAULT_THRESHOLDS = {
	mainBundle: 200, // Main bundle should be ≤ 200KB gzipped (per performance budget)
	cssBundle: 100, // CSS should be ≤ 100KB gzipped
	totalAssets: 1000, // Total assets should be ≤ 1000KB gzipped
};

// Parse command line arguments
const args = process.argv.slice(2);
const thresholds = { ...DEFAULT_THRESHOLDS };

for (const arg of args) {
	if (arg.startsWith('--max-main-kb=')) {
		thresholds.mainBundle = Number.parseFloat(arg.split('=')[1]);
	} else if (arg.startsWith('--max-css-kb=')) {
		thresholds.cssBundle = Number.parseFloat(arg.split('=')[1]);
	} else if (arg.startsWith('--max-total-kb=')) {
		thresholds.totalAssets = Number.parseFloat(arg.split('=')[1]);
	}
}

/**
 * Get file size in KB
 */
function getFileSizeKB(filePath) {
	try {
		const stats = statSync(filePath);
		return stats.size / 1024;
	} catch {
		return 0;
	}
}

/**
 * Estimate gzip size (rough approximation: ~30% of original size)
 * This is a conservative estimate. Actual gzip sizes are reported by Vite.
 */
function estimateGzipSize(originalSizeKB) {
	return originalSizeKB * 0.3;
}

/**
 * Find the main bundle and CSS files in dist/assets
 */
function analyzeBundle() {
	// Get project root (parent of scripts directory)
	const projectRoot = join(__dirname, '..');
	const distPath = join(projectRoot, 'dist');
	const assetsPath = join(distPath, 'assets');

	if (!statSync(assetsPath).isDirectory()) {
		throw new Error('dist/assets directory not found. Run `pnpm run build` first.');
	}

	const files = readdirSync(assetsPath);
	const jsFiles = files.filter(f => f.endsWith('.js'));
	const cssFiles = files.filter(f => f.endsWith('.css'));

	// Find main bundle (index-*.js)
	const mainBundle = jsFiles.find(f => f.startsWith('index-') && f.endsWith('.js'));
	const cssBundle = cssFiles.find(f => f.startsWith('index-') && f.endsWith('.css'));

	const results = {
		mainBundle: null,
		cssBundle: null,
		allAssets: [],
		totalSize: 0,
		totalGzipSize: 0,
	};

	// Analyze main bundle
	if (mainBundle) {
		const filePath = join(assetsPath, mainBundle);
		const sizeKB = getFileSizeKB(filePath);
		const gzipSizeKB = estimateGzipSize(sizeKB);

		results.mainBundle = {
			name: mainBundle,
			sizeKB: sizeKB.toFixed(2),
			gzipSizeKB: gzipSizeKB.toFixed(2),
		};
	}

	// Analyze CSS bundle
	if (cssBundle) {
		const filePath = join(assetsPath, cssBundle);
		const sizeKB = getFileSizeKB(filePath);
		const gzipSizeKB = estimateGzipSize(sizeKB);

		results.cssBundle = {
			name: cssBundle,
			sizeKB: sizeKB.toFixed(2),
			gzipSizeKB: gzipSizeKB.toFixed(2),
		};
	}

	// Analyze all assets
	for (const file of [...jsFiles, ...cssFiles]) {
		const filePath = join(assetsPath, file);
		const sizeKB = getFileSizeKB(filePath);
		const gzipSizeKB = estimateGzipSize(sizeKB);

		results.allAssets.push({
			name: file,
			sizeKB: sizeKB.toFixed(2),
			gzipSizeKB: gzipSizeKB.toFixed(2),
		});

		results.totalSize += sizeKB;
		results.totalGzipSize += gzipSizeKB;
	}

	return results;
}

/**
 * Check if bundle sizes are within thresholds
 */
function checkThresholds(results) {
	const errors = [];
	const warnings = [];

	// Check main bundle
	if (results.mainBundle) {
		const gzipSize = Number.parseFloat(results.mainBundle.gzipSizeKB);
		if (gzipSize > thresholds.mainBundle) {
			errors.push(
				`Main bundle (${results.mainBundle.name}) is ${gzipSize.toFixed(2)}KB gzipped, exceeds threshold of ${thresholds.mainBundle}KB`
			);
		} else if (gzipSize > thresholds.mainBundle * 0.9) {
			warnings.push(
				`Main bundle (${results.mainBundle.name}) is ${gzipSize.toFixed(2)}KB gzipped, approaching threshold of ${thresholds.mainBundle}KB`
			);
		}
	} else {
		errors.push('Main bundle not found');
	}

	// Check CSS bundle
	if (results.cssBundle) {
		const gzipSize = Number.parseFloat(results.cssBundle.gzipSizeKB);
		if (gzipSize > thresholds.cssBundle) {
			errors.push(
				`CSS bundle (${results.cssBundle.name}) is ${gzipSize.toFixed(2)}KB gzipped, exceeds threshold of ${thresholds.cssBundle}KB`
			);
		} else if (gzipSize > thresholds.cssBundle * 0.9) {
			warnings.push(
				`CSS bundle (${results.cssBundle.name}) is ${gzipSize.toFixed(2)}KB gzipped, approaching threshold of ${thresholds.cssBundle}KB`
			);
		}
	} else {
		warnings.push('CSS bundle not found');
	}

	// Check total assets
	if (results.totalGzipSize > thresholds.totalAssets) {
		errors.push(
			`Total assets are ${results.totalGzipSize.toFixed(2)}KB gzipped, exceeds threshold of ${thresholds.totalAssets}KB`
		);
	}

	return { errors, warnings };
}

/**
 * Main execution
 */
function main() {
	try {
		console.log('📦 Analyzing bundle sizes...\n');

		const results = analyzeBundle();
		const { errors, warnings } = checkThresholds(results);

		// Print results
		console.log('📊 Bundle Size Report\n');
		console.log('Thresholds:');
		console.log(`  Main bundle: ≤ ${thresholds.mainBundle}KB (gzipped)`);
		console.log(`  CSS bundle: ≤ ${thresholds.cssBundle}KB (gzipped)`);
		console.log(`  Total assets: ≤ ${thresholds.totalAssets}KB (gzipped)\n`);

		if (results.mainBundle) {
			console.log(`Main bundle: ${results.mainBundle.name}`);
			console.log(`  Size: ${results.mainBundle.sizeKB}KB (uncompressed)`);
			console.log(`  Estimated gzip: ${results.mainBundle.gzipSizeKB}KB`);
			console.log(
				`  Status: ${Number.parseFloat(results.mainBundle.gzipSizeKB) <= thresholds.mainBundle ? '✅' : '❌'}`
			);
		}

		if (results.cssBundle) {
			console.log(`\nCSS bundle: ${results.cssBundle.name}`);
			console.log(`  Size: ${results.cssBundle.sizeKB}KB (uncompressed)`);
			console.log(`  Estimated gzip: ${results.cssBundle.gzipSizeKB}KB`);
			console.log(
				`  Status: ${Number.parseFloat(results.cssBundle.gzipSizeKB) <= thresholds.cssBundle ? '✅' : '❌'}`
			);
		}

		console.log(`\nTotal assets: ${results.totalGzipSize.toFixed(2)}KB (estimated gzipped)`);
		console.log(`  Status: ${results.totalGzipSize <= thresholds.totalAssets ? '✅' : '❌'}\n`);

		// Print warnings
		if (warnings.length > 0) {
			console.log('⚠️  Warnings:');
			for (const warning of warnings) {
				console.log(`  - ${warning}`);
			}
			console.log();
		}

		// Print errors and exit with error code if any
		if (errors.length > 0) {
			console.error('❌ Errors:');
			for (const error of errors) {
				console.error(`  - ${error}`);
			}
			console.error('\n💡 Consider:');
			console.error('  - Reviewing recent dependency additions');
			console.error('  - Checking for duplicate dependencies');
			console.error('  - Verifying code splitting is working correctly');
			console.error('  - Running bundle analyzer: VITE_ANALYZE=true pnpm run build');
			process.exit(1);
		}

		console.log('✅ All bundle sizes are within thresholds!\n');
	} catch (error) {
		console.error('❌ Error analyzing bundle:', error.message);
		console.error('\n💡 Make sure to run `pnpm run build` first.');
		process.exit(1);
	}
}

main();
