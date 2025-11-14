import type { CSSProperties, Dispatch, RefObject, SetStateAction, Touch, TouchList } from 'react';

/**
 * Pull to refresh states
 */
export type PullState = 'idle' | 'pulling' | 'release' | 'refreshing';

/**
 * Maximum pull distance multiplier relative to threshold
 */
export const MAX_PULL_MULTIPLIER = 1.5;

/**
 * Pull to refresh indicator classes
 */
export const INDICATOR_BASE_CLASSES =
	'flex items-center justify-center h-12 text-text-muted dark:text-text-muted transition-transform duration-normal';

/**
 * Gets the first touch from a touch event
 */
export function getFirstTouch(touches: TouchList): Touch | undefined {
	return touches[0];
}

/**
 * Calculates the indicator style based on idle state
 */
export function getIndicatorStyle(isIdle: boolean): CSSProperties {
	return {
		transform: isIdle ? 'translateY(-100%)' : 'translateY(0)',
		opacity: isIdle ? 0 : 1,
	};
}

/**
 * Checks if container is at the top (scrollTop === 0)
 */
export function isContainerAtTop(containerRef: RefObject<HTMLDivElement | null>): boolean {
	return containerRef.current?.scrollTop === 0;
}

/**
 * Calculates pull distance with max limit
 */
export function calculatePullDistance(deltaY: number, threshold: number): number {
	return Math.min(deltaY, threshold * MAX_PULL_MULTIPLIER);
}

/**
 * Determines pull state based on distance and threshold
 */
export function getPullState(distance: number, threshold: number): PullState {
	return distance >= threshold ? 'release' : 'pulling';
}

/**
 * Resets pull state to idle
 */
export function resetPullState(
	setState: Dispatch<SetStateAction<PullState>>,
	setPullDistance: Dispatch<SetStateAction<number>>,
	touchStartY: { current: number | null }
): void {
	setState('idle');
	setPullDistance(0);
	touchStartY.current = null;
}
