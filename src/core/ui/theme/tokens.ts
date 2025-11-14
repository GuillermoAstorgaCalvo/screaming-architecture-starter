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
	'2xl': `${designTokens.spacing['2xl']}px`,
	'3xl': `${designTokens.spacing['3xl']}px`,
	'4xl': `${designTokens.spacing['4xl']}px`,
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
 * Uses CSS variables for full customization support
 */
export const componentColors = {
	primary: {
		background: 'var(--color-primary)',
		foreground: 'var(--color-primary-foreground)',
		hover: 'var(--color-primary-600)', // Uses customizable 600 shade
	},
	surface: {
		light: 'var(--color-surface)',
		dark: 'var(--color-surface-dark)',
	},
} as const;

/**
 * Component shadow tokens
 * Common shadow definitions for components
 * Uses design tokens for consistency
 */
export const componentShadows = {
	sm: designTokens.shadow.sm,
	md: designTokens.shadow.md,
	lg: designTokens.shadow.lg,
} as const;

/**
 * Component focus ring tokens
 * Standardized focus ring styles for accessibility
 * Uses CSS variables for full customization support
 */
export const componentFocusRing = {
	width: 'var(--focus-ring-width, 2px)',
	offset: 'var(--focus-ring-offset, 2px)',
	color: 'var(--color-primary)',
} as const;

/**
 * Component transition tokens
 * Standardized transition durations
 * Uses design tokens for consistency
 */
export const componentTransitions = {
	fast: designTokens.transition.duration.fast,
	normal: designTokens.transition.duration.normal,
	slow: designTokens.transition.duration.slow,
} as const;

/**
 * Component z-index tokens
 * Layering system for components (modals, tooltips, etc.)
 * Uses design tokens for consistency and customization
 */
export const componentZIndex = {
	base: designTokens.zIndex.base,
	dropdown: designTokens.zIndex.dropdown,
	sticky: designTokens.zIndex.sticky,
	fixed: designTokens.zIndex.fixed,
	modalBackdrop: designTokens.zIndex.modalBackdrop,
	modal: designTokens.zIndex.modal,
	popover: designTokens.zIndex.popover,
	tooltip: designTokens.zIndex.tooltip,
} as const;
