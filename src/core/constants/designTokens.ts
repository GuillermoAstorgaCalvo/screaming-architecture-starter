/**
 * Design tokens constants
 * Single source of truth for design tokens (color, radius, spacing)
 * Avoid hardcoding design values elsewhere
 *
 * These tokens should be mirrored in tailwind.config.ts for Tailwind class usage.
 * See: .cursor/rules/ux/theming-tokens.mdc
 */

export const designTokens = {
	color: {
		primary: { DEFAULT: '#2563eb', foreground: '#ffffff' },
		surface: { DEFAULT: '#ffffff', dark: '#0b0f19' },
	},
	radius: { sm: '0.25rem', md: '0.375rem', lg: '0.5rem' },
	spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
} as const;

/**
 * Type for design tokens
 */
export type DesignTokens = typeof designTokens;
