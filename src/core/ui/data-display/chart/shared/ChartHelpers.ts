import { designTokens } from '@core/constants/designTokens';
import type { ChartColorScheme } from '@src-types/ui/data/chart';

// Color manipulation constants
const HEX_BASE = 16;
const MAX_RGB_VALUE = 255;
const PERCENT_TO_RGB_FACTOR = 2.55;
const RED_CHANNEL_SHIFT = 16;
const GREEN_CHANNEL_SHIFT = 8;
const GREEN_CHANNEL_MASK = 0x00ff;
const BLUE_CHANNEL_MASK = 0x0000ff;
const FULL_COLOR_SHIFT = 24;
const COLOR_COMPONENT_SHIFT = 16;

// Darkening percentage constants
const DARKEN_PERCENT_20 = 20;
const DARKEN_PERCENT_25 = 25;
const DARKEN_PERCENT_30 = 30;
const DARKEN_PERCENT_35 = 35;
const DARKEN_PERCENT_40 = 40;
const DARKEN_PERCENT_45 = 45;
const DARKEN_PERCENT_50 = 50;
const DARKEN_PERCENT_55 = 55;
const DARKEN_PERCENT_60 = 60;
const DARKEN_PERCENT_65 = 65;
const DARKEN_PERCENT_70 = 70;

/**
 * Helper function to darken a hex color by a percentage
 * Used to generate color shades from design tokens
 */
function darkenColor(hex: string, percent: number): string {
	const num = Number.parseInt(hex.replace('#', ''), HEX_BASE);
	const amt = Math.round(PERCENT_TO_RGB_FACTOR * percent);
	const R = Math.max(0, Math.min(MAX_RGB_VALUE, (num >> RED_CHANNEL_SHIFT) - amt));
	const G = Math.max(
		0,
		Math.min(MAX_RGB_VALUE, ((num >> GREEN_CHANNEL_SHIFT) & GREEN_CHANNEL_MASK) - amt)
	);
	const B = Math.max(0, Math.min(MAX_RGB_VALUE, (num & BLUE_CHANNEL_MASK) - amt));
	return `#${((1 << FULL_COLOR_SHIFT) | (R << COLOR_COMPONENT_SHIFT) | (G << GREEN_CHANNEL_SHIFT) | B).toString(HEX_BASE).slice(1)}`;
}

/**
 * Default color schemes for charts
 * Uses design tokens for semantic color mapping
 * All colors are derived from design tokens for full customization
 */
const DEFAULT_COLOR_SCHEMES: Record<string, string[]> = {
	default: [
		designTokens.color.info.DEFAULT, // info
		designTokens.color.success.DEFAULT, // success
		designTokens.color.warning.DEFAULT, // warning
		designTokens.color.destructive.DEFAULT, // destructive
		designTokens.color.accent.DEFAULT, // accent
		designTokens.color.primary.DEFAULT, // primary
		designTokens.color.secondary.DEFAULT, // secondary
		designTokens.color.muted.DEFAULT, // muted
	],
	primary: [
		designTokens.color.primary.DEFAULT,
		darkenColor(designTokens.color.primary.DEFAULT, DARKEN_PERCENT_20), // 20% darker
		darkenColor(designTokens.color.primary.DEFAULT, DARKEN_PERCENT_35), // 35% darker
		darkenColor(designTokens.color.primary.DEFAULT, DARKEN_PERCENT_50), // 50% darker
		darkenColor(designTokens.color.primary.DEFAULT, DARKEN_PERCENT_65), // 65% darker
	],
	secondary: [
		designTokens.color.secondary.DEFAULT,
		designTokens.color.secondary.dark,
		darkenColor(designTokens.color.secondary.DEFAULT, DARKEN_PERCENT_30), // 30% darker
		darkenColor(designTokens.color.secondary.DEFAULT, DARKEN_PERCENT_50), // 50% darker
		darkenColor(designTokens.color.secondary.DEFAULT, DARKEN_PERCENT_70), // 70% darker
	],
	success: [
		designTokens.color.success.DEFAULT,
		designTokens.color.success.dark,
		darkenColor(designTokens.color.success.DEFAULT, DARKEN_PERCENT_30), // 30% darker
		darkenColor(designTokens.color.success.DEFAULT, DARKEN_PERCENT_45), // 45% darker
		darkenColor(designTokens.color.success.DEFAULT, DARKEN_PERCENT_60), // 60% darker
	],
	warning: [
		designTokens.color.warning.DEFAULT,
		designTokens.color.warning.dark,
		darkenColor(designTokens.color.warning.DEFAULT, DARKEN_PERCENT_25), // 25% darker
		darkenColor(designTokens.color.warning.DEFAULT, DARKEN_PERCENT_40), // 40% darker
		darkenColor(designTokens.color.warning.DEFAULT, DARKEN_PERCENT_55), // 55% darker
	],
	error: [
		designTokens.color.destructive.DEFAULT,
		designTokens.color.destructive.dark,
		darkenColor(designTokens.color.destructive.DEFAULT, DARKEN_PERCENT_20), // 20% darker
		darkenColor(designTokens.color.destructive.DEFAULT, DARKEN_PERCENT_35), // 35% darker
		darkenColor(designTokens.color.destructive.DEFAULT, DARKEN_PERCENT_50), // 50% darker
	],
	info: [
		designTokens.color.info.DEFAULT,
		designTokens.color.info.dark,
		darkenColor(designTokens.color.info.DEFAULT, DARKEN_PERCENT_30), // 30% darker
		darkenColor(designTokens.color.info.DEFAULT, DARKEN_PERCENT_45), // 45% darker
		darkenColor(designTokens.color.info.DEFAULT, DARKEN_PERCENT_60), // 60% darker
	],
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
	return color ?? colors[0] ?? designTokens.color.info.DEFAULT;
}
