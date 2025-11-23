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
		// Primary brand color - Modern blue with purple gradient
		primary: {
			DEFAULT: '#6366f1', // Indigo-500
			foreground: '#ffffff',
			light: '#818cf8', // Indigo-400
			dark: '#4f46e5', // Indigo-600
		},

		// Secondary color for supporting actions - Purple-blue gradient
		secondary: {
			DEFAULT: '#8b5cf6', // Violet-500
			foreground: '#ffffff',
			light: '#a78bfa', // Violet-400
			dark: '#7c3aed', // Violet-600
		},

		// Accent color for highlights and emphasis - Light purple-blue
		accent: {
			DEFAULT: '#a78bfa', // Violet-400
			foreground: '#ffffff',
			light: '#c4b5fd', // Violet-300
			dark: '#7c3aed', // Violet-600
		},

		// Muted colors for subtle backgrounds and borders
		muted: {
			DEFAULT: 'rgba(255, 255, 255, 0.1)', // Glassmorphism ready
			foreground: '#e2e8f0',
			dark: 'rgba(255, 255, 255, 0.05)',
			darkForeground: '#f8fafc',
		},

		// Destructive/danger color for errors and destructive actions
		destructive: {
			DEFAULT: '#ef4444', // Red-500
			foreground: '#ffffff',
			light: '#f87171', // Red-400
			dark: '#dc2626', // Red-600
		},

		// Success color for positive feedback
		success: {
			DEFAULT: '#10b981', // Emerald-500
			foreground: '#ffffff',
			light: '#34d399', // Emerald-400
			dark: '#059669', // Emerald-600
		},

		// Warning color for cautionary states
		warning: {
			DEFAULT: '#f59e0b', // Amber-500
			foreground: '#ffffff',
			light: '#fbbf24', // Amber-400
			dark: '#d97706', // Amber-600
		},

		// Info color for informational states
		info: {
			DEFAULT: '#3b82f6', // Blue-500
			foreground: '#ffffff',
			light: '#60a5fa', // Blue-400
			dark: '#2563eb', // Blue-600
		},

		// Surface colors (backgrounds) - Deep dark blue
		surface: {
			DEFAULT: '#0a0e27', // Deep dark blue
			dark: '#050816', // Darker variant
			elevated: '#0f1422', // Slightly lighter for elevation
			elevatedDark: '#141a2e',
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

		// Border colors - Subtle with glassmorphism
		border: {
			DEFAULT: 'rgba(255, 255, 255, 0.1)', // Glassmorphism border
			dark: 'rgba(255, 255, 255, 0.05)',
			light: 'rgba(255, 255, 255, 0.2)',
			darkLight: 'rgba(255, 255, 255, 0.15)',
		},

		// Text colors - White and light variants
		text: {
			primary: '#ffffff',
			primaryDark: '#f1f5f9',
			secondary: '#e2e8f0',
			secondaryDark: '#cbd5e1',
			muted: '#94a3b8',
			mutedDark: '#64748b',
			disabled: '#475569',
			disabledDark: '#334155',
			onPrimary: '#ffffff',
			onSecondary: '#ffffff',
			onDestructive: '#ffffff',
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

	// Shadow/elevation tokens - Enhanced for glassmorphism
	shadow: {
		none: 'none',
		sm: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
		md: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
		lg: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
		xl: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
		'2xl':
			'0 30px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.15), 0 0 40px rgba(99, 102, 241, 0.2)',
		inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
		// Glassmorphism shadows
		glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 0 1px rgba(255, 255, 255, 0.1)',
		// Dark mode shadows (more pronounced for depth)
		dark: {
			sm: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
			md: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
			lg: '0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
			xl: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)',
			'2xl':
				'0 30px 60px -15px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.15), 0 0 40px rgba(99, 102, 241, 0.3)',
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

	// Backdrop blur tokens for glassmorphism effects - Enhanced
	backdropBlur: {
		none: '0',
		sm: '4px',
		md: '10px',
		lg: '16px',
		xl: '24px',
		'2xl': '40px',
		glass: '20px', // Standard glassmorphism blur
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
