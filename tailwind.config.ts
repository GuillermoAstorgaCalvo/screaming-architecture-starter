import type { Config } from 'tailwindcss';

import { designTokens } from './src/core/constants/designTokens';

/**
 * Tailwind CSS Configuration
 *
 * CSS Purging: Tailwind automatically purges unused classes based on the `content` paths.
 * Only classes found in the specified files will be included in the final CSS bundle.
 * This ensures optimal bundle size by removing unused utility classes.
 *
 * To verify purging is working:
 * 1. Add a class that doesn't exist in your codebase (e.g., `bg-purple-999`)
 * 2. Build the project: `pnpm run build`
 * 3. Check dist/assets/index-*.css - the class should NOT be present
 */
export default {
	content: [
		'./index.html',
		'./src/**/*.{ts,tsx}',
		// Include test files if they use Tailwind classes
		'./tests/**/*.{ts,tsx}',
	],
	theme: {
		extend: {
			colors: {
				// Primary colors - using CSS variables for runtime theming
				primary: {
					DEFAULT: 'var(--color-primary)',
					foreground: 'var(--color-primary-foreground)',
					// Additional shades use CSS variables for full customization
					500: 'var(--color-primary)',
					// 600 shade uses CSS variable for full customization
					600: 'var(--color-primary-600)',
				},
				// Secondary colors
				secondary: {
					DEFAULT: 'var(--color-secondary)',
					foreground: 'var(--color-secondary-foreground)',
					light: 'var(--color-secondary-light)',
					dark: 'var(--color-secondary-dark)',
				},
				// Accent colors
				accent: {
					DEFAULT: 'var(--color-accent)',
					foreground: 'var(--color-accent-foreground)',
					light: 'var(--color-accent-light)',
					dark: 'var(--color-accent-dark)',
				},
				// Muted colors
				muted: {
					DEFAULT: 'var(--color-muted)',
					foreground: 'var(--color-muted-foreground)',
					dark: 'var(--color-muted-dark)',
					'dark-foreground': 'var(--color-muted-dark-foreground)',
				},
				// Destructive colors
				destructive: {
					DEFAULT: 'var(--color-destructive)',
					foreground: 'var(--color-destructive-foreground)',
					light: 'var(--color-destructive-light)',
					dark: 'var(--color-destructive-dark)',
				},
				// Success colors
				success: {
					DEFAULT: 'var(--color-success)',
					foreground: 'var(--color-success-foreground)',
					light: 'var(--color-success-light)',
					dark: 'var(--color-success-dark)',
				},
				// Warning colors
				warning: {
					DEFAULT: 'var(--color-warning)',
					foreground: 'var(--color-warning-foreground)',
					light: 'var(--color-warning-light)',
					dark: 'var(--color-warning-dark)',
				},
				// Info colors
				info: {
					DEFAULT: 'var(--color-info)',
					foreground: 'var(--color-info-foreground)',
					light: 'var(--color-info-light)',
					dark: 'var(--color-info-dark)',
				},
				// Surface colors
				surface: {
					DEFAULT: 'var(--color-surface)',
					dark: 'var(--color-surface-dark)',
					elevated: 'var(--color-surface-elevated)',
					'elevated-dark': 'var(--color-surface-elevated-dark)',
				},
				// Overlay/backdrop colors
				overlay: {
					DEFAULT: 'var(--color-overlay)',
					light: 'var(--color-overlay-light)',
					'light-dark': 'var(--color-overlay-light-dark)',
					medium: 'var(--color-overlay-medium)',
					'medium-dark': 'var(--color-overlay-medium-dark)',
					dark: 'var(--color-overlay-dark)',
					'dark-dark': 'var(--color-overlay-dark-dark)',
					'default-dark': 'var(--color-overlay-default-dark)',
				},
				// Border colors
				border: {
					DEFAULT: 'var(--color-border)',
					dark: 'var(--color-border-dark)',
					light: 'var(--color-border-light)',
					'dark-light': 'var(--color-border-dark-light)',
				},
				// Text colors
				text: {
					primary: 'var(--color-text-primary)',
					'primary-dark': 'var(--color-text-primary-dark)',
					secondary: 'var(--color-text-secondary)',
					'secondary-dark': 'var(--color-text-secondary-dark)',
					muted: 'var(--color-text-muted)',
					'muted-dark': 'var(--color-text-muted-dark)',
					disabled: 'var(--color-text-disabled)',
					'disabled-dark': 'var(--color-text-disabled-dark)',
					'on-primary': 'var(--color-text-on-primary)',
					'on-secondary': 'var(--color-text-on-secondary)',
					'on-destructive': 'var(--color-text-on-destructive)',
				},
			},
			borderRadius: {
				// Using CSS variables for full runtime customization
				none: 'var(--radius-none)',
				sm: 'var(--radius-sm)',
				md: 'var(--radius-md)',
				lg: 'var(--radius-lg)',
				xl: 'var(--radius-xl)',
				'2xl': 'var(--radius-2xl)',
				full: 'var(--radius-full)',
			},
			spacing: {
				// Using CSS variables for full runtime customization
				xs: 'var(--spacing-xs)',
				sm: 'var(--spacing-sm)',
				md: 'var(--spacing-md)',
				lg: 'var(--spacing-lg)',
				xl: 'var(--spacing-xl)',
				'2xl': 'var(--spacing-2xl)',
				'3xl': 'var(--spacing-3xl)',
				'4xl': 'var(--spacing-4xl)',
			},
			boxShadow: {
				// Using CSS variables for full runtime customization
				none: 'var(--shadow-none)',
				sm: 'var(--shadow-sm)',
				md: 'var(--shadow-md)',
				lg: 'var(--shadow-lg)',
				xl: 'var(--shadow-xl)',
				'2xl': 'var(--shadow-2xl)',
				inner: 'var(--shadow-inner)',
			},
			fontFamily: {
				// Using CSS variables for full runtime customization
				sans: ['var(--font-family-sans)'],
				mono: ['var(--font-family-mono)'],
			},
			fontSize: {
				// Using CSS variables for full runtime customization
				xs: ['var(--font-size-xs)', { lineHeight: 'var(--line-height-xs)' }],
				sm: ['var(--font-size-sm)', { lineHeight: 'var(--line-height-sm)' }],
				base: ['var(--font-size-base)', { lineHeight: 'var(--line-height-base)' }],
				lg: ['var(--font-size-lg)', { lineHeight: 'var(--line-height-lg)' }],
				xl: ['var(--font-size-xl)', { lineHeight: 'var(--line-height-xl)' }],
				'2xl': ['var(--font-size-2xl)', { lineHeight: 'var(--line-height-2xl)' }],
				'3xl': ['var(--font-size-3xl)', { lineHeight: 'var(--line-height-3xl)' }],
				'4xl': ['var(--font-size-4xl)', { lineHeight: 'var(--line-height-4xl)' }],
				'5xl': ['var(--font-size-5xl)', { lineHeight: 'var(--line-height-5xl)' }],
				'6xl': ['var(--font-size-6xl)', { lineHeight: 'var(--line-height-6xl)' }],
			},
			fontWeight: {
				// Using CSS variables for full runtime customization
				normal: 'var(--font-weight-normal)',
				medium: 'var(--font-weight-medium)',
				semibold: 'var(--font-weight-semibold)',
				bold: 'var(--font-weight-bold)',
			},
			letterSpacing: {
				// Using CSS variables for full runtime customization
				tighter: 'var(--letter-spacing-tighter)',
				tight: 'var(--letter-spacing-tight)',
				normal: 'var(--letter-spacing-normal)',
				wide: 'var(--letter-spacing-wide)',
				wider: 'var(--letter-spacing-wider)',
				widest: 'var(--letter-spacing-widest)',
			},
			zIndex: {
				// Using CSS variables for full runtime customization
				base: 'var(--z-index-base)',
				dropdown: 'var(--z-index-dropdown)',
				sticky: 'var(--z-index-sticky)',
				fixed: 'var(--z-index-fixed)',
				'modal-backdrop': 'var(--z-index-modal-backdrop)',
				modal: 'var(--z-index-modal)',
				popover: 'var(--z-index-popover)',
				tooltip: 'var(--z-index-tooltip)',
			},
			transitionDuration: {
				// Using CSS variables for full runtime customization
				instant: 'var(--transition-duration-instant)',
				micro: 'var(--transition-duration-micro)',
				fast: 'var(--transition-duration-fast)',
				normal: 'var(--transition-duration-normal)',
				slow: 'var(--transition-duration-slow)',
				slower: 'var(--transition-duration-slower)',
				lazy: 'var(--transition-duration-lazy)',
				extended: 'var(--transition-duration-extended)',
			},
			transitionTimingFunction: {
				// Using CSS variables for full runtime customization
				ease: 'var(--transition-timing-ease)',
				'ease-in': 'var(--transition-timing-ease-in)',
				'ease-out': 'var(--transition-timing-ease-out)',
				'ease-in-out': 'var(--transition-timing-ease-in-out)',
			},
			opacity: {
				// Using CSS variables for full runtime customization
				transparent: 'var(--opacity-transparent)',
				disabled: 'var(--opacity-disabled)',
				hover: 'var(--opacity-hover)',
				focus: 'var(--opacity-focus)',
				'overlay-light': 'var(--opacity-overlay-light)',
				'overlay-medium': 'var(--opacity-overlay-medium)',
				'overlay-dark': 'var(--opacity-overlay-dark)',
			},
			borderWidth: {
				// Using CSS variables for full runtime customization
				none: 'var(--border-width-none)',
				thin: 'var(--border-width-thin)',
				medium: 'var(--border-width-medium)',
				thick: 'var(--border-width-thick)',
			},
			backdropBlur: {
				// Using CSS variables for full runtime customization
				none: 'var(--backdrop-blur-none)',
				sm: 'var(--backdrop-blur-sm)',
				md: 'var(--backdrop-blur-md)',
				lg: 'var(--backdrop-blur-lg)',
				xl: 'var(--backdrop-blur-xl)',
				'2xl': 'var(--backdrop-blur-2xl)',
			},
			blur: {
				// Filter blur tokens for CSS filter: blur() - using CSS variables for full runtime customization
				none: 'var(--filter-blur-none)',
				sm: 'var(--filter-blur-sm)',
				md: 'var(--filter-blur-md)',
				lg: 'var(--filter-blur-lg)',
				xl: 'var(--filter-blur-xl)',
				'2xl': 'var(--filter-blur-2xl)',
				animation: 'var(--filter-blur-animation)',
			},
			animation: {
				duration: {
					// Using CSS variables for full runtime customization
					fast: 'var(--animation-duration-fast)',
					normal: 'var(--animation-duration-normal)',
					slow: 'var(--animation-duration-slow)',
					slower: 'var(--animation-duration-slower)',
				},
				timingFunction: {
					// Using CSS variables for full runtime customization
					linear: 'var(--animation-easing-linear)',
					ease: 'var(--animation-easing-ease)',
					'ease-in': 'var(--animation-easing-ease-in)',
					'ease-out': 'var(--animation-easing-ease-out)',
					'ease-in-out': 'var(--animation-easing-ease-in-out)',
					'bounce-in': 'var(--animation-easing-bounce-in)',
					'bounce-out': 'var(--animation-easing-bounce-out)',
					spring: 'var(--animation-easing-spring)',
				},
			},
			screens: {
				// Using design tokens directly (Tailwind needs pixel values at build time for media queries)
				// CSS variables are available for runtime customization via --breakpoint-* variables
				xs: designTokens.breakpoint.xs,
				sm: designTokens.breakpoint.sm,
				md: designTokens.breakpoint.md,
				lg: designTokens.breakpoint.lg,
				xl: designTokens.breakpoint.xl,
				'2xl': designTokens.breakpoint['2xl'],
			},
			// Component size tokens for consistent component dimensions
			// Using CSS variables for full runtime customization
			componentSize: {
				button: {
					sm: 'var(--component-size-button-sm)',
					md: 'var(--component-size-button-md)',
					lg: 'var(--component-size-button-lg)',
				},
				input: {
					sm: 'var(--component-size-input-sm)',
					md: 'var(--component-size-input-md)',
					lg: 'var(--component-size-input-lg)',
				},
				icon: {
					xs: 'var(--component-size-icon-xs)',
					sm: 'var(--component-size-icon-sm)',
					md: 'var(--component-size-icon-md)',
					lg: 'var(--component-size-icon-lg)',
					xl: 'var(--component-size-icon-xl)',
				},
				avatar: {
					sm: 'var(--component-size-avatar-sm)',
					md: 'var(--component-size-avatar-md)',
					lg: 'var(--component-size-avatar-lg)',
					xl: 'var(--component-size-avatar-xl)',
				},
			},
		},
	},
	darkMode: 'class',
	plugins: [],
} satisfies Config;
