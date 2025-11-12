/**
 * Design tokens constants
 * Single source of truth for design tokens (color, radius, spacing, shadows, typography)
 * Avoid hardcoding design values elsewhere
 *
 * These tokens should be mirrored in tailwind.config.ts for Tailwind class usage.
 * See: .cursor/rules/ux/theming-tokens.mdc
 */

export const designTokens = {
	color: {
		// Primary brand color
		primary: { DEFAULT: '#2563eb', foreground: '#ffffff' },

		// Secondary color for supporting actions
		secondary: {
			DEFAULT: '#64748b',
			foreground: '#ffffff',
			light: '#f1f5f9',
			dark: '#475569',
		},

		// Accent color for highlights and emphasis
		accent: {
			DEFAULT: '#8b5cf6',
			foreground: '#ffffff',
			light: '#f3e8ff',
			dark: '#7c3aed',
		},

		// Muted colors for subtle backgrounds and borders
		muted: {
			DEFAULT: '#f1f5f9',
			foreground: '#0f172a',
			dark: '#1e293b',
			darkForeground: '#f1f5f9',
		},

		// Destructive/danger color for errors and destructive actions
		destructive: {
			DEFAULT: '#ef4444',
			foreground: '#ffffff',
			light: '#fee2e2',
			dark: '#dc2626',
		},

		// Success color for positive feedback
		success: {
			DEFAULT: '#10b981',
			foreground: '#ffffff',
			light: '#d1fae5',
			dark: '#059669',
		},

		// Warning color for cautionary states
		warning: {
			DEFAULT: '#f59e0b',
			foreground: '#ffffff',
			light: '#fef3c7',
			dark: '#d97706',
		},

		// Info color for informational states
		info: {
			DEFAULT: '#3b82f6',
			foreground: '#ffffff',
			light: '#dbeafe',
			dark: '#2563eb',
		},

		// Surface colors (backgrounds)
		surface: {
			DEFAULT: '#ffffff',
			dark: '#0b0f19',
			elevated: '#ffffff',
			elevatedDark: '#1a1f2e',
		},

		// Border colors
		border: {
			DEFAULT: '#e2e8f0',
			dark: '#334155',
			light: '#f1f5f9',
			darkLight: '#475569',
		},

		// Text colors
		text: {
			primary: '#0f172a',
			primaryDark: '#f8fafc',
			secondary: '#475569',
			secondaryDark: '#cbd5e1',
			muted: '#64748b',
			mutedDark: '#94a3b8',
			disabled: '#94a3b8',
			disabledDark: '#475569',
			onPrimary: '#ffffff',
			onSecondary: '#ffffff',
			onDestructive: '#ffffff',
		},
	},

	// Border radius tokens
	radius: {
		none: '0',
		sm: '0.25rem',
		md: '0.375rem',
		lg: '0.5rem',
		xl: '0.75rem',
		'2xl': '1rem',
		full: '9999px',
	},

	// Spacing tokens (in pixels)
	spacing: {
		xs: 4,
		sm: 8,
		md: 12,
		lg: 16,
		xl: 24,
		'2xl': 32,
		'3xl': 48,
		'4xl': 64,
	},

	// Shadow/elevation tokens
	shadow: {
		none: 'none',
		sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
		md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
		lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
		xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
		'2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
		inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
		// Dark mode shadows (lighter, more subtle)
		dark: {
			sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
			md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
			lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
			xl: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
			'2xl': '0 25px 50px -12px rgb(0 0 0 / 0.5)',
		},
	},

	// Typography scale tokens
	typography: {
		fontFamily: {
			sans: [
				'ui-sans-serif',
				'system-ui',
				'-apple-system',
				'Segoe UI',
				'Roboto',
				'Helvetica',
				'Arial',
				'sans-serif',
			].join(', '),
			mono: [
				'ui-monospace',
				'SF Mono',
				'Monaco',
				'Consolas',
				'Liberation Mono',
				'Courier New',
				'monospace',
			].join(', '),
		},
		fontSize: {
			xs: ['0.75rem', { lineHeight: '1rem' }],
			sm: ['0.875rem', { lineHeight: '1.25rem' }],
			base: ['1rem', { lineHeight: '1.5rem' }],
			lg: ['1.125rem', { lineHeight: '1.75rem' }],
			xl: ['1.25rem', { lineHeight: '1.75rem' }],
			'2xl': ['1.5rem', { lineHeight: '2rem' }],
			'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
			'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
			'5xl': ['3rem', { lineHeight: '1' }],
			'6xl': ['3.75rem', { lineHeight: '1' }],
		},
		fontWeight: {
			normal: '400',
			medium: '500',
			semibold: '600',
			bold: '700',
		},
		letterSpacing: {
			tighter: '-0.05em',
			tight: '-0.025em',
			normal: '0',
			wide: '0.025em',
			wider: '0.05em',
			widest: '0.1em',
		},
	},

	// Z-index tokens for layering
	zIndex: {
		base: 0,
		dropdown: 1000,
		sticky: 1100,
		fixed: 1200,
		modalBackdrop: 1300,
		modal: 1400,
		popover: 1500,
		tooltip: 1600,
	},

	// Transition tokens
	transition: {
		duration: {
			fast: '150ms',
			normal: '200ms',
			slow: '300ms',
			slower: '500ms',
		},
		timing: {
			ease: 'ease',
			'ease-in': 'ease-in',
			'ease-out': 'ease-out',
			'ease-in-out': 'ease-in-out',
		},
	},

	// Animation tokens
	animation: {
		duration: {
			fast: '150ms',
			normal: '200ms',
			slow: '300ms',
			slower: '500ms',
		},
	},
} as const;

/**
 * Type for design tokens
 */
export type DesignTokens = typeof designTokens;

/**
 * Partial design tokens for customization
 * Allows overriding specific tokens without replacing the entire token set
 */
export type PartialDesignTokens = DeepPartial<DesignTokens>;

/**
 * Deep partial utility type
 */
type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Merge custom tokens with default tokens
 *
 * @param customTokens - Partial tokens to override defaults
 * @returns Merged tokens with custom overrides applied
 *
 * @example
 * ```ts
 * const customTokens = mergeDesignTokens({
 *   color: {
 *     primary: { DEFAULT: '#ff0000' }
 *   }
 * });
 * ```
 */
export function mergeDesignTokens(customTokens: PartialDesignTokens): DesignTokens {
	return deepMerge(designTokens, customTokens);
}

/**
 * Deep merge utility function
 */
function deepMerge<T extends Record<string, unknown>>(target: T, source: DeepPartial<T>): T {
	const output = { ...target };

	for (const key in source) {
		if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
			output[key] = deepMerge(
				target[key] as Record<string, unknown>,
				source[key] as DeepPartial<Record<string, unknown>>
			) as T[Extract<keyof T, string>];
		} else if (source[key] !== undefined) {
			output[key] = source[key] as T[Extract<keyof T, string>];
		}
	}

	return output;
}
