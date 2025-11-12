import { designTokens } from '@core/constants/designTokens';
import type { Config } from 'tailwindcss';

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
					// Additional shades derived from tokens
					500: designTokens.color.primary.DEFAULT,
					600: '#1d4ed8', // Slightly darker shade for hover states
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
				none: designTokens.radius.none,
				sm: designTokens.radius.sm,
				md: designTokens.radius.md,
				lg: designTokens.radius.lg,
				xl: designTokens.radius.xl,
				'2xl': designTokens.radius['2xl'],
				full: designTokens.radius.full,
			},
			spacing: {
				xs: `${designTokens.spacing.xs}px`,
				sm: `${designTokens.spacing.sm}px`,
				md: `${designTokens.spacing.md}px`,
				lg: `${designTokens.spacing.lg}px`,
				xl: `${designTokens.spacing.xl}px`,
				'2xl': `${designTokens.spacing['2xl']}px`,
				'3xl': `${designTokens.spacing['3xl']}px`,
				'4xl': `${designTokens.spacing['4xl']}px`,
			},
			boxShadow: {
				none: designTokens.shadow.none,
				sm: designTokens.shadow.sm,
				md: designTokens.shadow.md,
				lg: designTokens.shadow.lg,
				xl: designTokens.shadow.xl,
				'2xl': designTokens.shadow['2xl'],
				inner: designTokens.shadow.inner,
			},
			fontFamily: {
				sans: [designTokens.typography.fontFamily.sans],
				mono: [designTokens.typography.fontFamily.mono],
			},
			fontSize: designTokens.typography.fontSize,
			fontWeight: {
				normal: designTokens.typography.fontWeight.normal,
				medium: designTokens.typography.fontWeight.medium,
				semibold: designTokens.typography.fontWeight.semibold,
				bold: designTokens.typography.fontWeight.bold,
			},
			letterSpacing: designTokens.typography.letterSpacing,
			zIndex: {
				base: designTokens.zIndex.base,
				dropdown: designTokens.zIndex.dropdown,
				sticky: designTokens.zIndex.sticky,
				fixed: designTokens.zIndex.fixed,
				'modal-backdrop': designTokens.zIndex.modalBackdrop,
				modal: designTokens.zIndex.modal,
				popover: designTokens.zIndex.popover,
				tooltip: designTokens.zIndex.tooltip,
			},
			transitionDuration: {
				fast: designTokens.transition.duration.fast,
				normal: designTokens.transition.duration.normal,
				slow: designTokens.transition.duration.slow,
				slower: designTokens.transition.duration.slower,
			},
			transitionTimingFunction: {
				ease: designTokens.transition.timing.ease,
				'ease-in': designTokens.transition.timing['ease-in'],
				'ease-out': designTokens.transition.timing['ease-out'],
				'ease-in-out': designTokens.transition.timing['ease-in-out'],
			},
		},
	},
	darkMode: 'class',
	plugins: [],
} satisfies Config;
