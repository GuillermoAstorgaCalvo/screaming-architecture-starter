import type { Theme } from '@core/constants/theme';

/**
 * ThemeToggle component props
 */
export interface ThemeToggleProps {
	/**
	 * Current theme value
	 */
	readonly theme: Theme;
	/**
	 * Resolved theme (light or dark, accounting for system preference)
	 */
	readonly resolvedTheme: 'light' | 'dark';
	/**
	 * Function to set the theme
	 * @param value - The new theme value
	 */
	readonly setTheme: (_value: Theme) => void;
	/**
	 * Optional custom label for screen readers
	 * @default 'Toggle theme'
	 */
	readonly ariaLabel?: string;
	/**
	 * Custom className for styling
	 */
	readonly className?: string;
}
