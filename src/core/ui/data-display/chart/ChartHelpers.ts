import type { ChartColorScheme } from '@src-types/ui/data/chart';

/**
 * Default color schemes for charts
 */
const DEFAULT_COLOR_SCHEMES: Record<string, string[]> = {
	default: [
		'#3b82f6', // blue-500
		'#10b981', // emerald-500
		'#f59e0b', // amber-500
		'#ef4444', // red-500
		'#8b5cf6', // violet-500
		'#ec4899', // pink-500
		'#06b6d4', // cyan-500
		'#84cc16', // lime-500
	],
	primary: ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'],
	secondary: ['#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95'],
	success: ['#10b981', '#059669', '#047857', '#065f46', '#064e3b'],
	warning: ['#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f'],
	error: ['#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'],
	info: ['#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63'],
};

/**
 * Get color array from color scheme
 *
 * @param colorScheme - Color scheme name or array of colors
 * @returns Array of color strings
 */
export function getChartColors(colorScheme: ChartColorScheme = 'default'): string[] {
	if (Array.isArray(colorScheme)) {
		return colorScheme;
	}
	const scheme = DEFAULT_COLOR_SCHEMES[colorScheme];
	if (scheme) {
		return scheme;
	}
	// Default scheme is always defined
	return DEFAULT_COLOR_SCHEMES['default'] as string[];
}

/**
 * Get color for a data point by index
 *
 * @param index - Index of the data point
 * @param colorScheme - Color scheme
 * @returns Color string
 */
export function getChartColor(index: number, colorScheme: ChartColorScheme = 'default'): string {
	const colors = getChartColors(colorScheme);
	const color = colors[index % colors.length];
	return color ?? colors[0] ?? '#3b82f6';
}
