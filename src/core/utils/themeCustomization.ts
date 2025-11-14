/**
 * Theme customization utilities
 *
 * Provides utilities for runtime theme customization via CSS variables
 * and design token overrides.
 */

/**
 * Apply CSS variable overrides to the document root
 *
 * @param overrides - Object mapping CSS variable names (without --) to values
 *
 * @example
 * ```ts
 * applyCSSVariableOverrides({
 *   'color-primary': '#ff0000',
 *   'spacing-md': '16px'
 * });
 * ```
 */
export function applyCSSVariableOverrides(overrides: Record<string, string>): void {
	const root = document.documentElement;

	for (const [key, value] of Object.entries(overrides)) {
		const cssVarName = key.startsWith('--') ? key : `--${key}`;
		root.style.setProperty(cssVarName, value);
	}
}

/**
 * Remove CSS variable overrides
 *
 * @param variableNames - Array of CSS variable names (without --) to remove
 *
 * @example
 * ```ts
 * removeCSSVariableOverrides(['color-primary', 'spacing-md']);
 * ```
 */
export function removeCSSVariableOverrides(variableNames: string[]): void {
	const root = document.documentElement;

	for (const name of variableNames) {
		const cssVarName = name.startsWith('--') ? name : `--${name}`;
		root.style.removeProperty(cssVarName);
	}
}

/**
 * Get current CSS variable value
 *
 * @param variableName - CSS variable name (without --)
 * @returns Current value of the CSS variable or null if not set
 *
 * @example
 * ```ts
 * const primaryColor = getCSSVariableValue('color-primary');
 * ```
 */
export function getCSSVariableValue(variableName: string): string | null {
	const root = document.documentElement;
	const cssVarName = variableName.startsWith('--') ? variableName : `--${variableName}`;
	return getComputedStyle(root).getPropertyValue(cssVarName).trim() || null;
}

/**
 * Apply a complete theme preset
 *
 * @param theme - Theme object with CSS variable overrides
 *
 * @example
 * ```ts
 * applyTheme({
 *   'color-primary': '#ff0000',
 *   'color-secondary': '#00ff00',
 *   'radius-md': '0.5rem'
 * });
 * ```
 */
export function applyTheme(theme: Record<string, string>): void {
	applyCSSVariableOverrides(theme);
}

/**
 * Reset all CSS variable overrides to default values
 * Removes all custom CSS variables, restoring defaults from globals.css
 */
export function resetTheme(): void {
	const root = document.documentElement;
	const tokenPrefixes = [
		'--color-',
		'--radius-',
		'--spacing-',
		'--shadow-',
		'--z-index-',
		'--transition-',
		'--animation-',
		'--font-',
		'--line-height-',
		'--font-weight-',
		'--letter-spacing-',
		'--opacity-',
		'--border-width-',
		'--backdrop-blur-',
		'--filter-blur-',
		'--component-size-',
		'--breakpoint-',
	];

	const cssVariables = getAllCSSVariables();

	for (const prop of cssVariables) {
		if (tokenPrefixes.some(prefix => prop.startsWith(prefix))) {
			root.style.removeProperty(prop);
		}
	}
}

/**
 * Get all CSS variables defined in stylesheets
 */
function getAllCSSVariables(): string[] {
	return Array.from(document.styleSheets)
		.flatMap(sheet => {
			try {
				return Array.from(sheet.cssRules);
			} catch {
				return [];
			}
		})
		.filter(
			(rule): rule is CSSStyleRule => rule instanceof CSSStyleRule && rule.selectorText === ':root'
		)
		.flatMap(rule => Array.from(rule.style).filter(prop => prop.startsWith('--')));
}

/**
 * Type for theme customization options
 */
export interface ThemeCustomizationOptions {
	/**
	 * CSS variable overrides
	 */
	readonly cssVariables?: Record<string, string>;

	/**
	 * Whether to persist theme to localStorage
	 * @default false
	 */
	readonly persist?: boolean;

	/**
	 * Storage key for persisting theme
	 * @default 'custom-theme'
	 */
	readonly storageKey?: string;
}

/**
 * Apply theme customization with optional persistence
 *
 * @param options - Customization options
 *
 * @example
 * ```ts
 * customizeTheme({
 *   cssVariables: {
 *     'color-primary': '#ff0000'
 *   },
 *   persist: true
 * });
 * ```
 */
export function customizeTheme(options: ThemeCustomizationOptions): void {
	const { cssVariables = {}, persist = false, storageKey = 'custom-theme' } = options;

	if (Object.keys(cssVariables).length > 0) {
		applyCSSVariableOverrides(cssVariables);
	}

	if (persist) {
		persistTheme(cssVariables, storageKey);
	}
}

/**
 * Persist theme to localStorage
 */
function persistTheme(cssVariables: Record<string, string>, storageKey: string): void {
	try {
		globalThis.window.localStorage.setItem(storageKey, JSON.stringify(cssVariables));
	} catch (error) {
		console.warn('Failed to persist theme customization:', error);
	}
}

/**
 * Load persisted theme customization
 *
 * @param storageKey - Storage key to load from
 * @default 'custom-theme'
 * @returns Theme overrides or null if not found
 */
export function loadPersistedTheme(storageKey = 'custom-theme'): Record<string, string> | null {
	try {
		const stored = globalThis.window.localStorage.getItem(storageKey);
		if (stored) {
			return JSON.parse(stored) as Record<string, string>;
		}
	} catch (error) {
		console.warn('Failed to load persisted theme:', error);
	}

	return null;
}
