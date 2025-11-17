/**
 * Tests for theme customization persistence and higher-level utilities
 */

import {
	applyCSSVariableOverrides,
	applyTheme,
	customizeTheme,
	getCSSVariableValue,
	loadPersistedTheme,
	removeCSSVariableOverrides,
} from '@core/utils/themeCustomization';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const TEST_COLOR_PRIMARY = '#ff0000';
const TEST_COLOR_SECONDARY = '#00ff00';
const TEST_SPACING_MD = '16px';
const TEST_CSS_VAR_COLOR_PRIMARY = '--color-primary';
const TEST_CSS_VAR_SPACING_MD = '--spacing-md';
const TEST_VAR_COLOR_PRIMARY = 'color-primary';
const TEST_VAR_SPACING_MD = 'spacing-md';
const TEST_STORAGE_KEY = 'custom-theme';
const TEST_STORAGE_KEY_CUSTOM = 'my-custom-theme';

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

describe('customizeTheme - basic functionality', () => {
	it('should apply CSS variable overrides', () => {
		customizeTheme({
			cssVariables: {
				[TEST_VAR_COLOR_PRIMARY]: TEST_COLOR_PRIMARY,
				'spacing-md': TEST_SPACING_MD,
			},
		});

		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_COLOR_PRIMARY)).toBe(
			TEST_COLOR_PRIMARY
		);
		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_SPACING_MD)).toBe(
			TEST_SPACING_MD
		);
	});

	it('should handle empty cssVariables object', () => {
		customizeTheme({
			cssVariables: {},
		});

		expect(document.documentElement.style.cssText).toBe('');
	});

	it('should handle missing cssVariables option', () => {
		customizeTheme({});

		expect(document.documentElement.style.cssText).toBe('');
	});
});

describe('customizeTheme - persistence', () => {
	it('should persist theme to localStorage when persist is true', () => {
		const theme = {
			[TEST_VAR_COLOR_PRIMARY]: TEST_COLOR_PRIMARY,
			'spacing-md': TEST_SPACING_MD,
		};

		customizeTheme({
			cssVariables: theme,
			persist: true,
		});

		expect(localStorage.getItem(TEST_STORAGE_KEY)).toBe(JSON.stringify(theme));
	});

	it('should use custom storage key when provided', () => {
		const theme = {
			[TEST_VAR_COLOR_PRIMARY]: TEST_COLOR_PRIMARY,
		};

		customizeTheme({
			cssVariables: theme,
			persist: true,
			storageKey: TEST_STORAGE_KEY_CUSTOM,
		});

		expect(localStorage.getItem(TEST_STORAGE_KEY_CUSTOM)).toBe(JSON.stringify(theme));
		expect(localStorage.getItem(TEST_STORAGE_KEY)).toBeNull();
	});

	it('should not persist theme when persist is false', () => {
		customizeTheme({
			cssVariables: {
				[TEST_VAR_COLOR_PRIMARY]: TEST_COLOR_PRIMARY,
			},
			persist: false,
		});

		expect(localStorage.getItem(TEST_STORAGE_KEY)).toBeNull();
	});

	it('should not persist theme when persist is not provided', () => {
		customizeTheme({
			cssVariables: {
				[TEST_VAR_COLOR_PRIMARY]: TEST_COLOR_PRIMARY,
			},
		});

		expect(localStorage.getItem(TEST_STORAGE_KEY)).toBeNull();
	});
});

describe('error handling', () => {
	it('should handle localStorage errors gracefully', () => {
		const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
			// Suppress console output in tests
		});

		// Create a mock localStorage that throws on setItem
		const originalLocalStorage = globalThis.window.localStorage;
		const mockLocalStorage = {
			...originalLocalStorage,
			setItem: vi.fn(() => {
				throw new Error('Storage quota exceeded');
			}),
			getItem: originalLocalStorage.getItem,
			removeItem: originalLocalStorage.removeItem,
			clear: originalLocalStorage.clear,
			key: originalLocalStorage.key,
			length: originalLocalStorage.length,
		};

		Object.defineProperty(globalThis.window, 'localStorage', {
			value: mockLocalStorage,
			writable: true,
			configurable: true,
		});

		customizeTheme({
			cssVariables: {
				[TEST_VAR_COLOR_PRIMARY]: TEST_COLOR_PRIMARY,
			},
			persist: true,
		});

		// Should still apply CSS variables even if persistence fails
		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_COLOR_PRIMARY)).toBe(
			TEST_COLOR_PRIMARY
		);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			'Failed to persist theme customization:',
			expect.any(Error)
		);

		// Restore
		Object.defineProperty(globalThis.window, 'localStorage', {
			value: originalLocalStorage,
			writable: true,
			configurable: true,
		});
		consoleWarnSpy.mockRestore();
	});
});

describe('loadPersistedTheme - basic functionality', () => {
	it('should load persisted theme from localStorage', () => {
		const theme = {
			[TEST_VAR_COLOR_PRIMARY]: TEST_COLOR_PRIMARY,
			'spacing-md': TEST_SPACING_MD,
		};

		localStorage.setItem(TEST_STORAGE_KEY, JSON.stringify(theme));

		const loaded = loadPersistedTheme();

		expect(loaded).toEqual(theme);
	});

	it('should use custom storage key when provided', () => {
		const theme = {
			[TEST_VAR_COLOR_PRIMARY]: TEST_COLOR_PRIMARY,
		};

		localStorage.setItem(TEST_STORAGE_KEY_CUSTOM, JSON.stringify(theme));

		const loaded = loadPersistedTheme(TEST_STORAGE_KEY_CUSTOM);

		expect(loaded).toEqual(theme);
	});

	it('should return null when theme is not found', () => {
		const loaded = loadPersistedTheme();

		expect(loaded).toBeNull();
	});

	it('should return null when localStorage is empty', () => {
		localStorage.clear();

		const loaded = loadPersistedTheme();

		expect(loaded).toBeNull();
	});

	it('should handle complex theme objects', () => {
		const theme = {
			[TEST_VAR_COLOR_PRIMARY]: TEST_COLOR_PRIMARY,
			'color-secondary': TEST_COLOR_SECONDARY,
			'radius-md': '0.5rem',
			'spacing-md': TEST_SPACING_MD,
			'shadow-md': '0 4px 6px rgba(0,0,0,0.1)',
		};

		localStorage.setItem(TEST_STORAGE_KEY, JSON.stringify(theme));

		const loaded = loadPersistedTheme();

		expect(loaded).toEqual(theme);
	});
});

describe('loadPersistedTheme - error handling', () => {
	it('should handle invalid JSON gracefully', () => {
		const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
			// Suppress console output in tests
		});

		localStorage.setItem(TEST_STORAGE_KEY, 'invalid json');

		const loaded = loadPersistedTheme();

		expect(loaded).toBeNull();
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			'Failed to load persisted theme:',
			expect.any(Error)
		);

		consoleWarnSpy.mockRestore();
	});

	it('should handle localStorage errors gracefully', () => {
		const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
			// Suppress console output in tests
		});

		// Create a mock localStorage that throws on getItem
		const originalLocalStorage = globalThis.window.localStorage;
		const mockLocalStorage = {
			...originalLocalStorage,
			getItem: vi.fn(() => {
				throw new Error('Storage access denied');
			}),
			setItem: originalLocalStorage.setItem,
			removeItem: originalLocalStorage.removeItem,
			clear: originalLocalStorage.clear,
			key: originalLocalStorage.key,
			length: originalLocalStorage.length,
		};

		Object.defineProperty(globalThis.window, 'localStorage', {
			value: mockLocalStorage,
			writable: true,
			configurable: true,
		});

		const loaded = loadPersistedTheme();

		expect(loaded).toBeNull();
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			'Failed to load persisted theme:',
			expect.any(Error)
		);

		// Restore
		Object.defineProperty(globalThis.window, 'localStorage', {
			value: originalLocalStorage,
			writable: true,
			configurable: true,
		});
		consoleWarnSpy.mockRestore();
	});
});

describe('integration tests', () => {
	it('should apply, persist, and load theme', () => {
		const theme = {
			[TEST_VAR_COLOR_PRIMARY]: TEST_COLOR_PRIMARY,
			'spacing-md': TEST_SPACING_MD,
		};

		// Apply and persist
		customizeTheme({
			cssVariables: theme,
			persist: true,
		});

		// Verify applied
		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_COLOR_PRIMARY)).toBe(
			TEST_COLOR_PRIMARY
		);
		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_SPACING_MD)).toBe(
			TEST_SPACING_MD
		);

		// Load persisted theme
		const loaded = loadPersistedTheme();

		expect(loaded).toEqual(theme);
	});

	it('should apply theme, remove variables, and reset', () => {
		// Apply theme
		applyTheme({
			[TEST_VAR_COLOR_PRIMARY]: TEST_COLOR_PRIMARY,
			'spacing-md': TEST_SPACING_MD,
		});

		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_COLOR_PRIMARY)).toBe(
			TEST_COLOR_PRIMARY
		);
		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_SPACING_MD)).toBe(
			TEST_SPACING_MD
		);

		// Remove specific variable
		removeCSSVariableOverrides([TEST_VAR_COLOR_PRIMARY]);

		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_COLOR_PRIMARY)).toBe('');
		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_SPACING_MD)).toBe(
			TEST_SPACING_MD
		);

		// Remove remaining variable
		removeCSSVariableOverrides([TEST_VAR_SPACING_MD]);

		expect(document.documentElement.style.getPropertyValue(TEST_CSS_VAR_SPACING_MD)).toBe('');
	});

	it('should get, apply, and update CSS variable values', () => {
		// Clear any existing styles first
		document.documentElement.style.cssText = '';

		// Apply value
		applyCSSVariableOverrides({
			[TEST_VAR_COLOR_PRIMARY]: TEST_COLOR_PRIMARY,
		});

		// Get value - should be our applied value
		expect(getCSSVariableValue(TEST_VAR_COLOR_PRIMARY)).toBe(TEST_COLOR_PRIMARY);

		// Update value
		applyCSSVariableOverrides({
			[TEST_VAR_COLOR_PRIMARY]: TEST_COLOR_SECONDARY,
		});

		// Verify updated value
		expect(getCSSVariableValue(TEST_VAR_COLOR_PRIMARY)).toBe(TEST_COLOR_SECONDARY);
	});
});
