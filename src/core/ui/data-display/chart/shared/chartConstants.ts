import { componentSpacing } from '@core/ui/theme/tokens';

/**
 * Chart margin configuration using design tokens
 * Provides consistent spacing around chart content
 */
export const CHART_MARGIN = {
	top: Number.parseInt(componentSpacing.xs, 10), // 4px
	right: Number.parseInt(componentSpacing['3xl'], 10), // 48px (was 30px, using 3xl for better spacing)
	left: Number.parseInt(componentSpacing['2xl'], 10), // 32px (was 20px, using 2xl for better spacing)
	bottom: Number.parseInt(componentSpacing.xs, 10), // 4px
} as const;
