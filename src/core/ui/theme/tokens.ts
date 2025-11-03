import { designTokens } from '@core/constants/designTokens';

/**
 * Component token bridge
 *
 * This module bridges design tokens to component-specific token values.
 * It avoids magic numbers and provides a centralized place to derive
 * component tokens from the design system.
 *
 * Usage:
 * - Components should reference tokens from this module instead of raw design tokens
 * - This provides a layer of abstraction that makes it easier to adjust component
 *   styling without modifying design tokens directly
 */

/**
 * Component spacing tokens
 * Derived from design token spacing values
 */
export const componentSpacing = {
	xs: `${designTokens.spacing.xs}px`,
	sm: `${designTokens.spacing.sm}px`,
	md: `${designTokens.spacing.md}px`,
	lg: `${designTokens.spacing.lg}px`,
	xl: `${designTokens.spacing.xl}px`,
} as const;

/**
 * Component border radius tokens
 * Derived from design token radius values
 */
export const componentRadius = {
	sm: designTokens.radius.sm,
	md: designTokens.radius.md,
	lg: designTokens.radius.lg,
} as const;

/**
 * Component color tokens
 * Derived from design token color values
 * Provides semantic color mappings for components
 */
export const componentColors = {
	primary: {
		background: designTokens.color.primary.DEFAULT,
		foreground: designTokens.color.primary.foreground,
		hover: designTokens.color.primary.DEFAULT, // Can be adjusted if needed
	},
	surface: {
		light: designTokens.color.surface.DEFAULT,
		dark: designTokens.color.surface.dark,
	},
} as const;

/**
 * Component shadow tokens
 * Common shadow definitions for components
 */
export const componentShadows = {
	sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
	md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
	lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
} as const;

/**
 * Component focus ring tokens
 * Standardized focus ring styles for accessibility
 */
export const componentFocusRing = {
	width: '2px',
	offset: '2px',
	color: designTokens.color.primary.DEFAULT,
} as const;

/**
 * Component transition tokens
 * Standardized transition durations
 */
export const componentTransitions = {
	fast: '150ms',
	normal: '200ms',
	slow: '300ms',
} as const;

/**
 * Component z-index tokens
 * Layering system for components (modals, tooltips, etc.)
 */
export const componentZIndex = {
	base: 0,
	dropdown: 1000,
	sticky: 1100,
	fixed: 1200,
	modalBackdrop: 1300,
	modal: 1400,
	popover: 1500,
	tooltip: 1600,
} as const;
