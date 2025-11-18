/* eslint-disable max-lines */
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
		primary: {
			DEFAULT: '#2dd4ff',
			foreground: '#01060f',
			light: '#67e8f9',
			dark: '#0284c7',
		},

		// Secondary color for supporting actions
		secondary: {
			DEFAULT: '#818cf8',
			foreground: '#0f172a',
			light: '#c7d2fe',
			dark: '#4c1d95',
		},

		// Accent color for highlights and emphasis
		accent: {
			DEFAULT: '#f0abfc',
			foreground: '#0f172a',
			light: '#fce7f3',
			dark: '#c026d3',
		},

		// Muted colors for subtle backgrounds and borders
		muted: {
			DEFAULT: '#1e293b',
			foreground: '#e2e8f0',
			dark: '#0b1220',
			darkForeground: '#f8fafc',
		},

		// Destructive/danger color for errors and destructive actions
		destructive: {
			DEFAULT: '#fb7185',
			foreground: '#0f172a',
			light: '#fecdd3',
			dark: '#be123c',
		},

		// Success color for positive feedback
		success: {
			DEFAULT: '#34d399',
			foreground: '#022c22',
			light: '#bbf7d0',
			dark: '#065f46',
		},

		// Warning color for cautionary states
		warning: {
			DEFAULT: '#fbbf24',
			foreground: '#0f172a',
			light: '#fef3c7',
			dark: '#b45309',
		},

		// Info color for informational states
		info: {
			DEFAULT: '#60a5fa',
			foreground: '#0f172a',
			light: '#dbeafe',
			dark: '#1d4ed8',
		},

		// Surface colors (backgrounds)
		surface: {
			DEFAULT: '#0b1220',
			dark: '#03060d',
			elevated: '#0f172a',
			elevatedDark: '#111826',
		},

		// Overlay/backdrop colors for modals, drawers, etc.
		overlay: {
			DEFAULT: 'rgba(1, 6, 15, 0.7)',
			light: 'rgba(1, 6, 15, 0.4)',
			lightDark: 'rgba(1, 6, 15, 0.55)',
			medium: 'rgba(2, 10, 22, 0.7)',
			mediumDark: 'rgba(2, 10, 22, 0.8)',
			dark: 'rgba(2, 6, 15, 0.9)',
			darkDark: 'rgba(2, 6, 15, 0.95)',
			defaultDark: 'rgba(1, 6, 15, 0.85)',
		},

		// Border colors
		border: {
			DEFAULT: '#1e293b',
			dark: '#0f172a',
			light: '#334155',
			darkLight: '#64748b',
		},

		// Text colors
		text: {
			primary: '#f8fafc',
			primaryDark: '#e2e8f0',
			secondary: '#cbd5f5',
			secondaryDark: '#94a3b8',
			muted: '#8aa3c7',
			mutedDark: '#7488a6',
			disabled: '#475569',
			disabledDark: '#1f2937',
			onPrimary: '#020617',
			onSecondary: '#020617',
			onDestructive: '#020617',
		},
	},

	// Border radius tokens
	radius: {
		none: '0',
		sm: '0.375rem',
		md: '0.625rem',
		lg: '0.875rem',
		xl: '1.25rem',
		'2xl': '1.75rem',
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
		sm: '0 10px 20px -10px rgba(15, 23, 42, 0.4)',
		md: '0 20px 45px -25px rgba(15, 23, 42, 0.6)',
		lg: '0 30px 60px -30px rgba(15, 23, 42, 0.65)',
		xl: '0 40px 90px -45px rgba(15, 23, 42, 0.75)',
		'2xl': '0 25px 50px -12px rgba(15, 23, 42, 0.65), 0 35px 80px -20px rgba(45, 212, 191, 0.25)',
		inner: 'inset 0 2px 8px 0 rgba(15, 23, 42, 0.5)',
		// Dark mode shadows (lighter, more subtle)
		dark: {
			sm: '0 10px 20px -12px rgba(2, 6, 23, 0.6)',
			md: '0 18px 40px -20px rgba(2, 6, 23, 0.7)',
			lg: '0 25px 55px -25px rgba(2, 6, 23, 0.75)',
			xl: '0 35px 70px -30px rgba(2, 6, 23, 0.8)',
			'2xl': '0 45px 100px -40px rgba(2, 6, 23, 0.85)',
		},
	},

	// Typography scale tokens
	typography: {
		fontFamily: {
			sans: [
				'Space Grotesk',
				'Inter',
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
				'JetBrains Mono',
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
			xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],
			sm: ['0.875rem', { lineHeight: '1.3rem', letterSpacing: '0.015em' }],
			base: ['1rem', { lineHeight: '1.6rem', letterSpacing: '0.01em' }],
			lg: ['1.125rem', { lineHeight: '1.8rem', letterSpacing: '0.005em' }],
			xl: ['1.35rem', { lineHeight: '2rem', letterSpacing: '-0.005em' }],
			'2xl': ['1.65rem', { lineHeight: '2.2rem', letterSpacing: '-0.01em' }],
			'3xl': ['2rem', { lineHeight: '2.4rem', letterSpacing: '-0.015em' }],
			'4xl': ['2.5rem', { lineHeight: '2.8rem', letterSpacing: '-0.02em' }],
			'5xl': ['3.5rem', { lineHeight: '3.5rem', letterSpacing: '-0.04em' }],
			'6xl': ['4.5rem', { lineHeight: '4.2rem', letterSpacing: '-0.06em' }],
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
			instant: '0ms',
			micro: '100ms',
			fast: '150ms',
			normal: '200ms',
			slow: '300ms',
			slower: '500ms',
			lazy: '700ms',
			extended: '1000ms',
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
		easing: {
			linear: 'linear',
			ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
			'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
			'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
			'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
			'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
			'bounce-out': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
			spring: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
		},
	},

	// Opacity tokens for consistent transparency
	opacity: {
		transparent: '0',
		disabled: '0.5',
		hover: '0.8',
		focus: '0.9',
		overlay: {
			light: '0.3',
			medium: '0.5',
			dark: '0.7',
		},
	},

	// Border width tokens for consistent borders
	borderWidth: {
		none: '0',
		thin: '1px',
		medium: '2px',
		thick: '4px',
	},

	// Backdrop blur tokens for glassmorphism effects
	backdropBlur: {
		none: '0',
		sm: '4px',
		md: '8px',
		lg: '12px',
		xl: '16px',
		'2xl': '24px',
	},

	// Filter blur tokens for animation effects (CSS filter: blur())
	filterBlur: {
		none: '0px',
		sm: '4px',
		md: '8px',
		lg: '12px',
		xl: '16px',
		'2xl': '24px',
		// Common animation blur values
		animation: '10px',
	},

	// Component size tokens for consistent component dimensions
	componentSize: {
		// Button heights
		button: {
			sm: '36px',
			md: '48px',
			lg: '56px',
		},
		// Input heights
		input: {
			sm: '36px',
			md: '48px',
			lg: '56px',
		},
		// Icon sizes
		icon: {
			xs: '14px',
			sm: '18px',
			md: '22px',
			lg: '28px',
			xl: '36px',
		},
		// Avatar sizes
		avatar: {
			sm: '36px',
			md: '48px',
			lg: '60px',
			xl: '80px',
		},
	},

	// Breakpoint tokens for responsive design
	breakpoint: {
		xs: '0px',
		sm: '640px',
		md: '768px',
		lg: '1024px',
		xl: '1280px',
		'2xl': '1536px',
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
