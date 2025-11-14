#!/usr/bin/env node

/* eslint-env node */
/* global process, console */

/**
 * Sync Design Tokens to CSS Variables
 *
 * This script reads design tokens from src/core/constants/designTokens.ts
 * and generates CSS variables in src/styles/globals.css
 *
 * Usage:
 *   pnpm run sync-tokens
 *
 * This ensures CSS variables stay in sync with design tokens.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

/**
 * Convert camelCase to kebab-case
 * Handles cases like: modalBackdrop -> modal-backdrop, zIndex -> z-index
 */
function camelToKebab(str) {
	// Replace any uppercase letter that follows a lowercase letter or number with a hyphen + lowercase
	// Then convert the entire string to lowercase
	// Note: Using replace() with regex, not replaceAll() - replaceAll() doesn't support regex patterns
	return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Convert design token value to CSS variable format
 */
function tokenToCSSVar(category, key, subKey = null) {
	// Convert camelCase category to kebab-case (e.g., zIndex -> z-index)
	const kebabCategory = camelToKebab(category);
	const parts = [kebabCategory, key];
	if (subKey && subKey !== 'DEFAULT') {
		// Convert camelCase to kebab-case for CSS variable names
		parts.push(camelToKebab(subKey));
	}
	return `--${parts.join('-')}`;
}

/**
 * Convert design token value to CSS value
 */
function tokenToCSSValue(value) {
	if (typeof value === 'number') {
		return `${value}px`;
	}
	if (typeof value === 'string') {
		return value;
	}
	if (Array.isArray(value)) {
		// Typography fontSize format: ['0.75rem', { lineHeight: '1rem' }]
		if (value.length === 2 && typeof value[1] === 'object') {
			return value[0];
		}
		return value.join(', ');
	}
	return String(value);
}

/**
 * Process color tokens
 */
function processColorTokens(tokens, cssVars) {
	if (!tokens.color) {
		return;
	}

	for (const [key, value] of Object.entries(tokens.color)) {
		if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
			for (const [subKey, subValue] of Object.entries(value)) {
				const cssVar = tokenToCSSVar('color', key, subKey);
				const cssValue = tokenToCSSValue(subValue);
				cssVars.push({ var: cssVar, value: cssValue, category: 'color' });
			}
		}
	}
}

/**
 * Process simple token category (radius, spacing, shadow, z-index, opacity, borderWidth, backdropBlur, breakpoint)
 */
function processSimpleTokens(tokens, category, cssVars) {
	const tokenData = tokens[category];
	if (!tokenData) {
		return;
	}

	for (const [key, value] of Object.entries(tokenData)) {
		if (category === 'shadow' && key === 'dark') {
			// Dark mode shadows are handled separately in CSS
			continue;
		}
		// Handle nested objects (e.g., opacity.overlay)
		if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
			for (const [subKey, subValue] of Object.entries(value)) {
				const kebabKey = camelToKebab(key);
				const kebabSubKey = camelToKebab(subKey);
				const cssVar = tokenToCSSVar(category, kebabKey, kebabSubKey);
				const cssValue = tokenToCSSValue(subValue);
				cssVars.push({ var: cssVar, value: cssValue, category });
			}
		} else {
			// Convert camelCase keys to kebab-case for CSS variable names
			const kebabKey = camelToKebab(key);
			const cssVar = tokenToCSSVar(category, kebabKey);
			// Z-index values should be unitless numbers, not pixels
			const cssValue =
				category === 'zIndex' && typeof value === 'number' ? String(value) : tokenToCSSValue(value);
			cssVars.push({ var: cssVar, value: cssValue, category });
		}
	}
}

/**
 * Process transition tokens
 */
function processTransitionTokens(tokens, cssVars) {
	if (!tokens.transition) {
		return;
	}

	if (tokens.transition.duration) {
		for (const [key, value] of Object.entries(tokens.transition.duration)) {
			const cssVar = tokenToCSSVar('transition-duration', key);
			const cssValue = tokenToCSSValue(value);
			cssVars.push({ var: cssVar, value: cssValue, category: 'transition' });
		}
	}

	if (tokens.transition.timing) {
		for (const [key, value] of Object.entries(tokens.transition.timing)) {
			const cssVar = tokenToCSSVar('transition-timing', key);
			const cssValue = tokenToCSSValue(value);
			cssVars.push({ var: cssVar, value: cssValue, category: 'transition' });
		}
	}
}

/**
 * Process animation tokens
 */
function processAnimationTokens(tokens, cssVars) {
	if (!tokens.animation) {
		return;
	}

	if (tokens.animation.duration) {
		for (const [key, value] of Object.entries(tokens.animation.duration)) {
			const cssVar = tokenToCSSVar('animation-duration', key);
			const cssValue = tokenToCSSValue(value);
			cssVars.push({ var: cssVar, value: cssValue, category: 'animation' });
		}
	}

	if (tokens.animation.easing) {
		for (const [key, value] of Object.entries(tokens.animation.easing)) {
			const cssVar = tokenToCSSVar('animation-easing', key);
			const cssValue = tokenToCSSValue(value);
			cssVars.push({ var: cssVar, value: cssValue, category: 'animation' });
		}
	}
}

/**
 * Process component size tokens
 */
function processComponentSizeTokens(tokens, cssVars) {
	if (!tokens.componentSize) {
		return;
	}

	for (const [componentType, sizes] of Object.entries(tokens.componentSize)) {
		if (typeof sizes === 'object' && sizes !== null && !Array.isArray(sizes)) {
			for (const [size, value] of Object.entries(sizes)) {
				const cssVar = tokenToCSSVar('component-size', componentType, size);
				const cssValue = tokenToCSSValue(value);
				cssVars.push({ var: cssVar, value: cssValue, category: 'component-size' });
			}
		}
	}
}

/**
 * Process typography font family tokens
 */
function processTypographyFontFamily(typography, cssVars) {
	if (!typography.fontFamily) {
		return;
	}

	for (const [key, value] of Object.entries(typography.fontFamily)) {
		const cssVar = tokenToCSSVar('font-family', key);
		const cssValue = tokenToCSSValue(value);
		cssVars.push({ var: cssVar, value: cssValue, category: 'typography' });
	}
}

/**
 * Process typography font size tokens
 */
function processTypographyFontSize(typography, cssVars) {
	if (!typography.fontSize) {
		return;
	}

	for (const [key, value] of Object.entries(typography.fontSize)) {
		const fontSizeVar = tokenToCSSVar('font-size', key);
		const lineHeightVar = tokenToCSSVar('line-height', key);
		if (Array.isArray(value) && value.length === 2 && typeof value[1] === 'object') {
			const fontSize = value[0];
			const lineHeight = value[1].lineHeight;
			cssVars.push({ var: fontSizeVar, value: fontSize, category: 'typography' });
			if (lineHeight) {
				cssVars.push({ var: lineHeightVar, value: lineHeight, category: 'typography' });
			}
		}
	}
}

/**
 * Process typography font weight tokens
 */
function processTypographyFontWeight(typography, cssVars) {
	if (!typography.fontWeight) {
		return;
	}

	for (const [key, value] of Object.entries(typography.fontWeight)) {
		const cssVar = tokenToCSSVar('font-weight', key);
		const cssValue = tokenToCSSValue(value);
		cssVars.push({ var: cssVar, value: cssValue, category: 'typography' });
	}
}

/**
 * Process typography letter spacing tokens
 */
function processTypographyLetterSpacing(typography, cssVars) {
	if (!typography.letterSpacing) {
		return;
	}

	for (const [key, value] of Object.entries(typography.letterSpacing)) {
		const cssVar = tokenToCSSVar('letter-spacing', key);
		const cssValue = tokenToCSSValue(value);
		cssVars.push({ var: cssVar, value: cssValue, category: 'typography' });
	}
}

/**
 * Process typography tokens
 */
function processTypographyTokens(tokens, cssVars) {
	if (!tokens.typography) {
		return;
	}

	const { typography } = tokens;
	processTypographyFontFamily(typography, cssVars);
	processTypographyFontSize(typography, cssVars);
	processTypographyFontWeight(typography, cssVars);
	processTypographyLetterSpacing(typography, cssVars);
}

/**
 * Generate CSS variables from design tokens
 */
function generateCSSVariables(tokens) {
	const cssVars = [];

	processColorTokens(tokens, cssVars);
	processSimpleTokens(tokens, 'radius', cssVars);
	processSimpleTokens(tokens, 'spacing', cssVars);
	processSimpleTokens(tokens, 'shadow', cssVars);
	processSimpleTokens(tokens, 'zIndex', cssVars);
	processTransitionTokens(tokens, cssVars);
	processAnimationTokens(tokens, cssVars);
	processTypographyTokens(tokens, cssVars);
	processSimpleTokens(tokens, 'opacity', cssVars);
	processSimpleTokens(tokens, 'borderWidth', cssVars);
	processSimpleTokens(tokens, 'backdropBlur', cssVars);
	processSimpleTokens(tokens, 'filterBlur', cssVars);
	processComponentSizeTokens(tokens, cssVars);
	processSimpleTokens(tokens, 'breakpoint', cssVars);

	return cssVars;
}

/**
 * Read design tokens from TypeScript file
 */
function readDesignTokens() {
	const tokensPath = join(projectRoot, 'src/core/constants/designTokens.ts');
	const content = readFileSync(tokensPath, 'utf-8');

	// Extract the designTokens object using a simple regex
	// This is a basic implementation - for production, consider using a TypeScript parser
	const exportMatch = content.match(/export const designTokens = ({[\s\S]*?}) as const;/);
	if (!exportMatch) {
		throw new Error('Could not find designTokens export in designTokens.ts');
	}

	// Evaluate the tokens object (safe because it's from our own codebase)
	// In production, you might want to use a proper TypeScript parser
	const tokensCode = exportMatch[1];
	// Replace TypeScript-specific syntax for evaluation
	// Note: Using replace() with regex is correct here, not replaceAll()
	// replaceAll() doesn't support regex patterns, so we use replace() for regex matches
	// NOSONAR: S7781 - replaceAll() doesn't support regex patterns, replace() is required here
	const cleanedCode = tokensCode
		.replace(/\/\*[\s\S]*?\*\//g, '') // NOSONAR: S7781 - regex pattern requires replace()
		.replace(/\/\/.*$/gm, '') // NOSONAR: S7781 - regex pattern requires replace()
		.replaceAll("'", '"'); // Replace single quotes with double quotes

	try {
		// Use Function constructor to evaluate in a safe context
		const tokens = new Function(`return ${cleanedCode}`)();
		return tokens;
	} catch (error) {
		console.error('Error parsing design tokens:', error);
		throw error;
	}
}

/**
 * Categorize CSS variables
 */
function categorizeCSSVars(cssVars) {
	const categories = {
		color: [],
		radius: [],
		spacing: [],
		shadow: [],
		'z-index': [],
		transition: [],
		animation: [],
		typography: [],
		opacity: [],
		'border-width': [],
		'backdrop-blur': [],
		'filter-blur': [],
		'component-size': [],
		breakpoint: [],
	};

	// Map camelCase category names to kebab-case
	const categoryMap = {
		zIndex: 'z-index',
		borderWidth: 'border-width',
		backdropBlur: 'backdrop-blur',
		filterBlur: 'filter-blur',
		componentSize: 'component-size',
	};

	for (const { var: cssVar, value, category } of cssVars) {
		const normalizedCategory = categoryMap[category] || category;
		if (categories[normalizedCategory]) {
			categories[normalizedCategory].push({ var: cssVar, value });
		} else if (normalizedCategory === 'color') {
			categories.color.push({ var: cssVar, value });
		}
	}

	return categories;
}

/**
 * Generate primary colors CSS
 */
function generatePrimaryColorsCSS(colors) {
	let css = '\t/* Primary colors */\n';
	css += `\t--color-primary: ${colors.find(v => v.var === '--color-primary')?.value || '#2563eb'};\n`;
	css += `\t--color-primary-foreground: ${colors.find(v => v.var === '--color-primary-foreground')?.value || '#ffffff'};\n`;
	css += `\t/* Primary focus ring color (35% opacity) - uses color-mix for modern browsers */\n`;
	css += `\t--color-primary-focus-ring: color-mix(in srgb, var(--color-primary) 35%, transparent);\n`;
	css += `\t/* Primary 600 shade (darker variant for hover/focus states) - customizable */\n`;
	css += `\t--color-primary-600: color-mix(in srgb, var(--color-primary) 85%, black);\n\n`;
	return css;
}

/**
 * Generate other colors CSS
 */
function generateOtherColorsCSS(colors) {
	const otherColors = colors.filter(
		v => !v.var.includes('color-primary') && !v.var.includes('focus-ring')
	);

	if (otherColors.length === 0) {
		return '';
	}

	let css = '';
	let currentGroup = '';
	for (const { var: cssVar, value } of otherColors) {
		const group = cssVar.split('-')[1]; // Extract color name (secondary, accent, etc.)
		if (group !== currentGroup) {
			if (currentGroup) css += '\n';
			css += `\t/* ${group.charAt(0).toUpperCase() + group.slice(1)} colors */\n`;
			currentGroup = group;
		}
		css += `\t${cssVar}: ${value};\n`;
	}
	return css;
}

/**
 * Generate category tokens CSS
 */
function generateCategoryTokensCSS(categories) {
	const categoryOrder = [
		'radius',
		'spacing',
		'shadow',
		'z-index',
		'transition',
		'animation',
		'typography',
		'opacity',
		'border-width',
		'backdrop-blur',
		'filter-blur',
		'component-size',
		'breakpoint',
	];

	let css = '';
	for (const category of categoryOrder) {
		if (categories[category] && categories[category].length > 0) {
			css += `\n\t/* ${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')} tokens */\n`;
			for (const { var: cssVar, value } of categories[category]) {
				css += `\t${cssVar}: ${value};\n`;
			}
		}
	}
	return css;
}

/**
 * Generate CSS content with variables
 */
function generateCSSContent(cssVars) {
	const categories = categorizeCSSVars(cssVars);

	let css = `@import 'tailwindcss';

:root {
	color-scheme: light dark;

	/* Design token values for CSS usage
	 * These should be kept in sync with @core/constants/designTokens.ts
	 * See: .cursor/rules/ux/theming-tokens.mdc
	 *
	 * NOTE: This file is auto-generated by scripts/sync-design-tokens.js
	 * To regenerate, run: pnpm run sync-tokens
	 */\n\n`;

	// Colors
	if (categories.color.length > 0) {
		css += generatePrimaryColorsCSS(categories.color);
		css += generateOtherColorsCSS(categories.color);
	}

	// Other categories
	css += generateCategoryTokensCSS(categories);

	css += `\n\t/* Focus ring tokens - customizable for accessibility */\n`;
	css += `\t--focus-ring-width: 2px;\n`;
	css += `\t--focus-ring-offset: 2px;\n\n`;

	css += `\t/* Animation max-height tokens - for collapsible/accordion animations */\n`;
	css += `\t--animation-max-height-collapsible: 1000px;\n`;
	css += `\t--animation-max-height-tree-view: 10000px;\n`;
	css += `}\n\n`;

	// Dark mode
	css += `/* Dark mode CSS variables */\n`;
	css += `.dark {\n`;
	css += `\t/* Surface color switches to dark variant in dark mode */\n`;
	css += `\t--color-surface: var(--color-surface-dark);\n`;
	css += `\t--color-surface-elevated: var(--color-surface-elevated-dark);\n\n`;
	css += `\t/* Text colors switch in dark mode */\n`;
	css += `\t--color-text-primary: var(--color-text-primary-dark);\n`;
	css += `\t--color-text-secondary: var(--color-text-secondary-dark);\n`;
	css += `\t--color-text-muted: var(--color-text-muted-dark);\n`;
	css += `\t--color-text-disabled: var(--color-text-disabled-dark);\n\n`;
	css += `\t/* Border colors switch in dark mode */\n`;
	css += `\t--color-border: var(--color-border-dark);\n`;
	css += `\t--color-border-light: var(--color-border-dark-light);\n\n`;
	css += `\t/* Muted colors switch in dark mode */\n`;
	css += `\t--color-muted: var(--color-muted-dark);\n`;
	css += `\t--color-muted-foreground: var(--color-muted-dark-foreground);\n\n`;
	css += `\t/* Dark mode shadows (more pronounced) */\n`;
	css += `\t--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);\n`;
	css += `\t--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3);\n`;
	css += `\t--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3);\n`;
	css += `\t--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.3);\n`;
	css += `\t--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.5);\n`;
	css += `}\n\n`;

	// Rest of the CSS (body styles, etc.)
	css += `html,
body,
#root {
	height: 100%;
}

body {
	margin: 0;
	font-family:
		ui-sans-serif,
		system-ui,
		-apple-system,
		Segoe UI,
		Roboto,
		Helvetica,
		Arial,
		'Apple Color Emoji',
		'Segoe UI Emoji';
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

/* Accessibility: Focus styles for keyboard navigation */
/* Note: This provides a fallback for elements without explicit focus styles */
/* Components should use Tailwind's focus:ring utilities for better control */
*:focus-visible:not([class*='focus:ring']) {
	outline: 2px solid var(--color-primary);
	outline-offset: 2px;
}

/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
	*,
	*::before,
	*::after {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
		scroll-behavior: auto !important;
	}
}

/* Slider component styling */
input.slider-thumb::-webkit-slider-runnable-track {
	height: 0.5rem;
	border-radius: var(--radius-full);
	background: transparent;
}

input.slider-thumb::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	height: 1rem;
	width: 1rem;
	border-radius: var(--radius-full);
	background-color: var(--color-primary);
	border: none;
	box-shadow: 0 0 0 2px var(--color-surface);
	transition:
		background-color var(--transition-duration-fast) var(--transition-timing-ease),
		box-shadow var(--transition-duration-fast) var(--transition-timing-ease);
}

input.slider-thumb:focus-visible::-webkit-slider-thumb {
	/* Uses CSS variable for full customization support */
	/* Fallback rgba value matches default primary color (#2563eb) at 35% opacity for older browsers */
	/* Note: When primary color is customized, modern browsers will use --color-primary-focus-ring with color-mix */
	box-shadow: 0 0 0 4px var(--color-primary-focus-ring, rgba(37, 99, 235, 0.35));
}

.dark input.slider-thumb::-webkit-slider-thumb {
	box-shadow: 0 0 0 2px var(--color-surface);
}

input.slider-thumb::-moz-range-track {
	height: 0.5rem;
	border-radius: var(--radius-full);
	background: transparent;
}

input.slider-thumb::-moz-range-thumb {
	height: 1rem;
	width: 1rem;
	border-radius: var(--radius-full);
	background-color: var(--color-primary);
	border: none;
	box-shadow: 0 0 0 2px var(--color-surface);
	transition:
		background-color var(--transition-duration-fast) var(--transition-timing-ease),
		box-shadow var(--transition-duration-fast) var(--transition-timing-ease);
}

input.slider-thumb:focus-visible::-moz-range-thumb {
	/* Uses CSS variable for full customization support */
	/* Fallback rgba value matches default primary color (#2563eb) at 35% opacity for older browsers */
	/* Note: When primary color is customized, modern browsers will use --color-primary-focus-ring with color-mix */
	box-shadow: 0 0 0 4px var(--color-primary-focus-ring, rgba(37, 99, 235, 0.35));
}

.dark input.slider-thumb::-moz-range-thumb {
	box-shadow: 0 0 0 2px var(--color-surface);
}

/* Marquee component animations */
@keyframes marquee-left {
	from {
		transform: translateX(0);
	}
	to {
		transform: translateX(-100%);
	}
}

@keyframes marquee-right {
	from {
		transform: translateX(-100%);
	}
	to {
		transform: translateX(0);
	}
}
`;

	return css;
}

/**
 * Main function
 */
function main() {
	try {
		console.log('Reading design tokens...');
		const tokens = readDesignTokens();

		console.log('Generating CSS variables...');
		const cssVars = generateCSSVariables(tokens);

		console.log('Generating CSS content...');
		const cssContent = generateCSSContent(cssVars);

		const cssPath = join(projectRoot, 'src/styles/globals.css');
		console.log(`Writing to ${cssPath}...`);
		writeFileSync(cssPath, cssContent, 'utf-8');

		console.log(`✅ Successfully synced ${cssVars.length} CSS variables from design tokens!`);
	} catch (error) {
		console.error('❌ Error syncing design tokens:', error);
		process.exit(1);
	}
}

main();
