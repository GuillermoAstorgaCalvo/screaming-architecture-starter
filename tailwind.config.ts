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
				primary: designTokens.color.primary,
				surface: designTokens.color.surface,
			},
			borderRadius: {
				sm: designTokens.radius.sm,
				md: designTokens.radius.md,
				lg: designTokens.radius.lg,
			},
			spacing: {
				xs: `${designTokens.spacing.xs}px`,
				sm: `${designTokens.spacing.sm}px`,
				md: `${designTokens.spacing.md}px`,
				lg: `${designTokens.spacing.lg}px`,
				xl: `${designTokens.spacing.xl}px`,
			},
		},
	},
	darkMode: 'class',
	plugins: [],
} satisfies Config;
