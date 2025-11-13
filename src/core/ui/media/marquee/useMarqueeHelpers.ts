import type { MarqueeDirection } from '@src-types/ui/layout/marquee';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Calculate the number of duplicates needed for seamless looping
 */
export function calculateDuplicateCount(
	containerWidth: number,
	contentWidth: number,
	minDuplicates: number = 2
): number {
	if (contentWidth === 0) {
		return minDuplicates;
	}

	// Calculate how many times we need to duplicate to fill container + one extra for seamless loop
	const neededWidth = containerWidth + contentWidth;
	const duplicates = Math.ceil(neededWidth / contentWidth);

	return Math.max(duplicates, minDuplicates);
}

/**
 * Calculate if measure element should be shown
 */
export function shouldShowMeasure(
	loop: boolean,
	providedDuplicateCount: number | undefined
): boolean {
	return loop && providedDuplicateCount === undefined;
}

/**
 * Build animation style for loop mode
 */
export function buildLoopAnimationStyle(
	loop: boolean,
	direction: MarqueeDirection,
	isPaused: boolean
): CSSProperties | undefined {
	if (!loop) {
		return undefined;
	}

	return {
		animation: isPaused
			? 'none'
			: `marquee-${direction} var(--marquee-duration, 20s) linear infinite`,
	};
}

/**
 * Generate duplicated content for seamless loop
 * Note: This returns a factory function that creates JSX elements
 */
export function createDuplicatedContentFactory(children: ReactNode, duplicateCount: number) {
	return Array.from({ length: duplicateCount }, (_, index) => ({
		key: index,
		children,
	}));
}
