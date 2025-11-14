/**
 * Breakpoint constants
 *
 * Defines standard responsive breakpoints used across the application.
 * These breakpoints match the BreakpointSize type defined in types/layout.ts.
 *
 * Breakpoints are derived from design tokens for consistency and customization.
 * - xs: 0px (default, no min-width)
 * - sm: 640px
 * - md: 768px
 * - lg: 1024px
 * - xl: 1280px
 * - 2xl: 1536px
 *
 * Usage:
 * ```ts
 * import { breakpoints } from '@core/constants/breakpoints';
 * import { useMediaQuery } from '@core/hooks/useMediaQuery';
 *
 * const isMobile = useMediaQuery(`(max-width: ${breakpoints.sm - 1}px)`);
 * const isDesktop = useMediaQuery(`(min-width: ${breakpoints.lg}px)`);
 * ```
 */

import { designTokens } from '@core/constants/designTokens';
import type { BreakpointSize } from '@src-types/layout';

/**
 * Breakpoint values in pixels
 * Derived from design tokens for consistency and customization
 */
export const breakpoints = {
	xs: Number.parseInt(designTokens.breakpoint.xs, 10),
	sm: Number.parseInt(designTokens.breakpoint.sm, 10),
	md: Number.parseInt(designTokens.breakpoint.md, 10),
	lg: Number.parseInt(designTokens.breakpoint.lg, 10),
	xl: Number.parseInt(designTokens.breakpoint.xl, 10),
	'2xl': Number.parseInt(designTokens.breakpoint['2xl'], 10),
} as const;

/**
 * Type-safe breakpoint size
 */
export type BreakpointValue = keyof typeof breakpoints;

/**
 * Get breakpoint value by size
 *
 * @param size - Breakpoint size name
 * @returns Breakpoint value in pixels
 *
 * @example
 * ```ts
 * const mdBreakpoint = getBreakpoint('md'); // 768
 * ```
 */
export function getBreakpoint(size: BreakpointSize): number {
	return breakpoints[size];
}

/**
 * Create a min-width media query string for a breakpoint
 *
 * @param size - Breakpoint size name
 * @returns Media query string (e.g., "(min-width: 768px)")
 *
 * @example
 * ```ts
 * const query = createMinWidthQuery('md'); // "(min-width: 768px)"
 * const isMdOrLarger = useMediaQuery(query);
 * ```
 */
export function createMinWidthQuery(size: BreakpointSize): string {
	const value = getBreakpoint(size);
	return `(min-width: ${value}px)`;
}

/**
 * Create a max-width media query string for a breakpoint
 *
 * @param size - Breakpoint size name
 * @returns Media query string (e.g., "(max-width: 767px)")
 *
 * @example
 * ```ts
 * const query = createMaxWidthQuery('md'); // "(max-width: 767px)"
 * const isSmallerThanMd = useMediaQuery(query);
 * ```
 */
export function createMaxWidthQuery(size: BreakpointSize): string {
	const value = getBreakpoint(size);
	// Subtract 1px to exclude the breakpoint itself (e.g., max-width: 767px for md: 768px)
	return `(max-width: ${value - 1}px)`;
}

/**
 * Create a range media query string between two breakpoints
 *
 * @param min - Minimum breakpoint size (inclusive)
 * @param max - Maximum breakpoint size (exclusive)
 * @returns Media query string (e.g., "(min-width: 768px) and (max-width: 1023px)")
 *
 * @example
 * ```ts
 * const query = createRangeQuery('md', 'lg'); // "(min-width: 768px) and (max-width: 1023px)"
 * const isTablet = useMediaQuery(query);
 * ```
 */
export function createRangeQuery(min: BreakpointSize, max: BreakpointSize): string {
	const minValue = getBreakpoint(min);
	const maxValue = getBreakpoint(max);
	return `(min-width: ${minValue}px) and (max-width: ${maxValue - 1}px)`;
}
