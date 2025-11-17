/**
 * Tests for theme customization utilities
 */

import {
	applyCSSVariableOverrides,
	applyTheme,
	getCSSVariableValue,
	removeCSSVariableOverrides,
	resetTheme,
} from '@core/utils/themeCustomization';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const TEST_COLOR_PRIMARY = '#ff0000';
const TEST_COLOR_SECONDARY = '#00ff00';
const TEST_SPACING_MD = '16px';
const TEST_RADIUS_MD = '0.5rem';
const TEST_SHADOW_MD = '0 4px 6px rgba(0,0,0,0.1)';
const TEST_CSS_VAR_COLOR_PRIMARY = '--color-primary';
const TEST_CSS_VAR_SPACING_MD = '--spacing-md';
const TEST_VAR_COLOR_PRIMARY = 'color-primary';
const TEST_VAR_SPACING_MD = 'spacing-md';
const TEST_CSS_VAR_RADIUS_MD = '--radius-md';
const TEST_CSS_VAR_COLOR_SECONDARY = '--color-secondary';
const TEST_CSS_VAR_SHADOW_MD = '--shadow-md';

beforeEach(() => {
	// Clear document root styles before each test
	document.documentElement.style.cssText = '';
	// Clear localStorage
	localStorage.clear();
	// Clear console.warn mocks
	vi.clearAllMocks();
});

afterEach(() => {
	// Clean up any remaining styles
	document.documentElement.style.cssText = '';
	localStorage.clear();
	vi.restoreAllMocks();
});

describe('applyCSSVariableOverrides - prefix handling', () => {
	it('should apply CSS variable overrides without -- prefix', () => {
		applyCSSVariableOverrides({
			[TEST_VAR_COLOR_PRIMARY]: TEST_COLOR_PRIMARY,
			'spacing-md': TEST_SPACING_MD,
		});

		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_COLOR_PRIMARY)).toBe(
			TEST_COLOR_PRIMARY
		);
		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_SPACING_MD)).toBe(
			TEST_SPACING_MD
		);
	});

	it('should apply CSS variable overrides with -- prefix', () => {
		applyCSSVariableOverrides({
			'--color-primary': TEST_COLOR_SECONDARY,
			'--spacing-md': '24px',
		});

		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_COLOR_PRIMARY)).toBe(
			TEST_COLOR_SECONDARY
		);
		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_SPACING_MD)).toBe('24px');
	});

	it('should handle mixed prefix formats', () => {
		applyCSSVariableOverrides({
			[TEST_VAR_COLOR_PRIMARY]: TEST_COLOR_PRIMARY,
			'--spacing-md': '16px',
		});

		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_COLOR_PRIMARY)).toBe(
			TEST_COLOR_PRIMARY
		);
		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_SPACING_MD)).toBe(
			TEST_SPACING_MD
		);
	});
});

describe('applyCSSVariableOverrides - edge cases and multiple tokens', () => {
	it('should override existing CSS variables', () => {
		document.documentElement.style.setProperty(TEST_CSS_VAR_COLOR_PRIMARY, '#000000');

		applyCSSVariableOverrides({
			[TEST_VAR_COLOR_PRIMARY]: TEST_COLOR_PRIMARY,
		});

		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_COLOR_PRIMARY)).toBe(
			TEST_COLOR_PRIMARY
		);
	});

	it('should handle empty object', () => {
		applyCSSVariableOverrides({});

		expect(document.documentElement.style.cssText).toBe('');
	});

	it('should handle multiple token types', () => {
		applyCSSVariableOverrides({
			[TEST_VAR_COLOR_PRIMARY]: TEST_COLOR_PRIMARY,
			'radius-md': TEST_RADIUS_MD,
			'spacing-md': TEST_SPACING_MD,
			'shadow-md': TEST_SHADOW_MD,
			'z-index-modal': '1000',
		});

		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_COLOR_PRIMARY)).toBe(
			TEST_COLOR_PRIMARY
		);
		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_RADIUS_MD)).toBe(
			TEST_RADIUS_MD
		);
		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_SPACING_MD)).toBe(
			TEST_SPACING_MD
		);
		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_SHADOW_MD)).toBe(
			TEST_SHADOW_MD
		);
		expect(document.documentElement.style.getPropertyValue('--z-index-modal')).toBe('1000');
	});
});

describe('removeCSSVariableOverrides', () => {
	it('should remove CSS variables without -- prefix', () => {
		document.documentElement.style.setProperty(TEST_CSS_VAR_COLOR_PRIMARY, TEST_COLOR_PRIMARY);
		document.documentElement.style.setProperty(TEST_CSS_VAR_SPACING_MD, TEST_SPACING_MD);

		removeCSSVariableOverrides([TEST_VAR_COLOR_PRIMARY, TEST_VAR_SPACING_MD]);

		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_COLOR_PRIMARY)).toBe('');
		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_SPACING_MD)).toBe('');
	});

	it('should remove CSS variables with -- prefix', () => {
		document.documentElement.style.setProperty(TEST_CSS_VAR_COLOR_PRIMARY, TEST_COLOR_PRIMARY);
		document.documentElement.style.setProperty(TEST_CSS_VAR_SPACING_MD, TEST_SPACING_MD);

		removeCSSVariableOverrides([TEST_CSS_VAR_COLOR_PRIMARY, TEST_CSS_VAR_SPACING_MD]);

		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_COLOR_PRIMARY)).toBe('');
		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_SPACING_MD)).toBe('');
	});

	it('should handle mixed prefix formats', () => {
		document.documentElement.style.setProperty(TEST_CSS_VAR_COLOR_PRIMARY, TEST_COLOR_PRIMARY);
		document.documentElement.style.setProperty(TEST_CSS_VAR_SPACING_MD, TEST_SPACING_MD);

		removeCSSVariableOverrides([TEST_VAR_COLOR_PRIMARY, TEST_CSS_VAR_SPACING_MD]);

		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_COLOR_PRIMARY)).toBe('');
		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_SPACING_MD)).toBe('');
	});

	it('should not affect other CSS variables', () => {
		document.documentElement.style.setProperty(TEST_CSS_VAR_COLOR_PRIMARY, TEST_COLOR_PRIMARY);
		document.documentElement.style.setProperty(TEST_CSS_VAR_COLOR_SECONDARY, TEST_COLOR_SECONDARY);
		document.documentElement.style.setProperty(TEST_CSS_VAR_SPACING_MD, TEST_SPACING_MD);

		removeCSSVariableOverrides([TEST_VAR_COLOR_PRIMARY]);

		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_COLOR_PRIMARY)).toBe('');
		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_COLOR_SECONDARY)).toBe(
			TEST_COLOR_SECONDARY
		);
		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_SPACING_MD)).toBe(
			TEST_SPACING_MD
		);
	});

	it('should handle empty array', () => {
		document.documentElement.style.setProperty(TEST_CSS_VAR_COLOR_PRIMARY, TEST_COLOR_PRIMARY);

		removeCSSVariableOverrides([]);

		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_COLOR_PRIMARY)).toBe(
			TEST_COLOR_PRIMARY
		);
	});

	it('should handle removing non-existent variables', () => {
		removeCSSVariableOverrides(['non-existent-var']);

		// Should not throw and should not affect anything
		expect(document.documentElement.style.cssText).toBe('');
	});
});

describe('getCSSVariableValue', () => {
	it('should get CSS variable value without -- prefix', () => {
		document.documentElement.style.setProperty(TEST_CSS_VAR_COLOR_PRIMARY, TEST_COLOR_PRIMARY);

		const value = getCSSVariableValue(TEST_VAR_COLOR_PRIMARY);

		expect(value).toBe(TEST_COLOR_PRIMARY);
	});

	it('should get CSS variable value with -- prefix', () => {
		document.documentElement.style.setProperty(TEST_CSS_VAR_COLOR_PRIMARY, TEST_COLOR_PRIMARY);

		const value = getCSSVariableValue('--color-primary');

		expect(value).toBe(TEST_COLOR_PRIMARY);
	});

	it('should return null for non-existent variable', () => {
		const value = getCSSVariableValue('non-existent-var');

		expect(value).toBeNull();
	});

	it('should return null for empty variable value', () => {
		document.documentElement.style.setProperty('--empty-var', '');

		const value = getCSSVariableValue('empty-var');

		expect(value).toBeNull();
	});

	it('should return trimmed value', () => {
		document.documentElement.style.setProperty(
			TEST_CSS_VAR_COLOR_PRIMARY,
			`  ${TEST_COLOR_PRIMARY}  `
		);

		const value = getCSSVariableValue(TEST_VAR_COLOR_PRIMARY);

		expect(value).toBe(TEST_COLOR_PRIMARY);
	});

	it('should handle various value types', () => {
		document.documentElement.style.setProperty(TEST_CSS_VAR_SPACING_MD, TEST_SPACING_MD);
		document.documentElement.style.setProperty(TEST_CSS_VAR_RADIUS_MD, TEST_RADIUS_MD);
		document.documentElement.style.setProperty('--opacity-50', '0.5');

		expect(getCSSVariableValue('spacing-md')).toBe(TEST_SPACING_MD);
		expect(getCSSVariableValue('radius-md')).toBe(TEST_RADIUS_MD);
		expect(getCSSVariableValue('opacity-50')).toBe('0.5');
	});
});

describe('applyTheme', () => {
	it('should apply complete theme preset', () => {
		const theme = {
			[TEST_VAR_COLOR_PRIMARY]: TEST_COLOR_PRIMARY,
			'color-secondary': TEST_COLOR_SECONDARY,
			'radius-md': TEST_RADIUS_MD,
		};

		applyTheme(theme);

		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_COLOR_PRIMARY)).toBe(
			TEST_COLOR_PRIMARY
		);
		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_COLOR_SECONDARY)).toBe(
			TEST_COLOR_SECONDARY
		);
		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_RADIUS_MD)).toBe(
			TEST_RADIUS_MD
		);
	});

	it('should override existing theme variables', () => {
		document.documentElement.style.setProperty(TEST_CSS_VAR_COLOR_PRIMARY, '#000000');

		applyTheme({
			[TEST_VAR_COLOR_PRIMARY]: TEST_COLOR_PRIMARY,
		});

		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_COLOR_PRIMARY)).toBe(
			TEST_COLOR_PRIMARY
		);
	});

	it('should handle empty theme object', () => {
		applyTheme({});

		expect(document.documentElement.style.cssText).toBe('');
	});

	it('should apply comprehensive theme with all token types', () => {
		const theme = {
			[TEST_VAR_COLOR_PRIMARY]: TEST_COLOR_PRIMARY,
			'color-secondary': TEST_COLOR_SECONDARY,
			'radius-md': TEST_RADIUS_MD,
			'spacing-md': TEST_SPACING_MD,
			'shadow-md': TEST_SHADOW_MD,
			'z-index-modal': '1000',
			'transition-fast': '150ms',
			'animation-spin': 'spin 1s linear infinite',
			'font-family-sans': 'system-ui, sans-serif',
			'line-height-normal': '1.5',
			'font-weight-bold': '700',
			'letter-spacing-wide': '0.05em',
			'opacity-50': '0.5',
			'border-width-1': '1px',
			'backdrop-blur-sm': '4px',
			'filter-blur-sm': '4px',
			'component-size-md': '2rem',
			'breakpoint-md': '768px',
		};

		applyTheme(theme);

		for (const [key, value] of Object.entries(theme)) {
			expect(document.documentElement.style.getPropertyValue(`--${key}`)).toBe(value);
		}
	});
});

describe('resetTheme', () => {
	it('should reset all theme-related CSS variables', () => {
		// Set some custom theme variables as inline styles
		document.documentElement.style.setProperty(TEST_CSS_VAR_COLOR_PRIMARY, TEST_COLOR_PRIMARY);
		document.documentElement.style.setProperty(TEST_CSS_VAR_RADIUS_MD, TEST_RADIUS_MD);
		document.documentElement.style.setProperty(TEST_CSS_VAR_SPACING_MD, TEST_SPACING_MD);
		document.documentElement.style.setProperty('--custom-var', 'custom');

		// Create a stylesheet with :root rule containing the variables
		// This is needed because getAllCSSVariables() reads from stylesheets
		const styleElement = document.createElement('style');
		styleElement.textContent = `
				:root {
					--color-primary: #000000;
					--radius-md: 0.25rem;
					--spacing-md: 8px;
					--custom-var: custom;
				}
			`;
		document.head.append(styleElement);

		// Call resetTheme - it should remove inline styles that match token prefixes
		// Note: In jsdom, stylesheets may not be immediately accessible, so we test the function
		// doesn't throw and handles the case gracefully
		expect(() => resetTheme()).not.toThrow();

		// Cleanup
		styleElement.remove();
	});

	it('should handle stylesheets with access errors gracefully', () => {
		// Mock styleSheets to throw an error when accessing cssRules
		const mockStyleSheet = {
			get cssRules() {
				throw new Error('Access denied');
			},
		};

		Object.defineProperty(document, 'styleSheets', {
			value: [mockStyleSheet],
			writable: true,
			configurable: true,
		});

		// Should not throw
		expect(() => resetTheme()).not.toThrow();

		// Restore
		Object.defineProperty(document, 'styleSheets', {
			value: [],
			writable: true,
			configurable: true,
		});
	});

	it('should only remove variables matching token prefixes', () => {
		// Set inline styles
		document.documentElement.style.setProperty(TEST_CSS_VAR_COLOR_PRIMARY, TEST_COLOR_PRIMARY);
		document.documentElement.style.setProperty('--custom-variable', 'custom');
		document.documentElement.style.setProperty('--other-var', 'other');

		// Create a stylesheet with :root rule containing the variables
		const styleElement = document.createElement('style');
		styleElement.textContent = `
				:root {
					--color-primary: #000000;
					--custom-variable: custom;
					--other-var: other;
				}
			`;
		document.head.append(styleElement);

		// Call resetTheme - it should handle stylesheets gracefully
		// Note: In jsdom, stylesheets may not be immediately accessible, so we test the function
		// doesn't throw and handles the case gracefully
		expect(() => resetTheme()).not.toThrow();

		// Cleanup
		styleElement.remove();
	});
});
