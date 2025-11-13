import { type RefObject, type TouchEvent, useCallback } from 'react';

import {
	calculatePullDistance,
	getFirstTouch,
	getPullState,
	isContainerAtTop,
	resetPullState,
} from './PullToRefreshHelpers';
import { usePullToRefreshState } from './usePullToRefreshState';

/**
 * Options for pull-to-refresh handlers hook
 */
export interface UsePullToRefreshHandlersOptions {
	disabled: boolean;
	threshold: number;
	onRefresh: () => Promise<void> | void;
}

/**
 * Return type for pull-to-refresh handlers hook
 */
export interface UsePullToRefreshHandlersReturn {
	containerRef: RefObject<HTMLDivElement | null>;
	handleTouchStart: (e: TouchEvent<HTMLDivElement>) => void;
	handleTouchMove: (e: TouchEvent<HTMLDivElement>) => void;
	handleTouchEnd: () => void | Promise<void>;
	isRefreshing: boolean;
	canRelease: boolean;
	isIdle: boolean;
	pullDistance: number;
}

/**
 * Hook for managing pull-to-refresh touch handlers
 *
 * @param options - Configuration options for the handlers
 * @returns Touch event handlers and related state
 */
// eslint-disable-next-line max-lines-per-function
export function usePullToRefreshHandlers({
	disabled,
	threshold,
	onRefresh,
}: UsePullToRefreshHandlersOptions): UsePullToRefreshHandlersReturn {
	const {
		setState,
		setPullDistance,
		touchStartY,
		containerRef,
		isRefreshing,
		canRelease,
		isIdle,
		pullDistance,
	} = usePullToRefreshState(threshold);

	const handleTouchStart = useCallback(
		(e: TouchEvent<HTMLDivElement>) => {
			if (disabled || isRefreshing) return;
			const touch = getFirstTouch(e.touches);
			if (touch && isContainerAtTop(containerRef)) {
				touchStartY.current = touch.clientY;
			}
		},
		[disabled, isRefreshing, containerRef, touchStartY]
	);

	const handleTouchMove = useCallback(
		(e: TouchEvent<HTMLDivElement>) => {
			if (disabled || isRefreshing || !touchStartY.current) return;
			const touch = getFirstTouch(e.touches);
			if (touch && isContainerAtTop(containerRef)) {
				const deltaY = touch.clientY - touchStartY.current;
				if (deltaY > 0) {
					const distance = calculatePullDistance(deltaY, threshold);
					setPullDistance(distance);
					setState(getPullState(distance, threshold));
					e.preventDefault();
				}
			}
		},
		[disabled, isRefreshing, threshold, containerRef, touchStartY, setPullDistance, setState]
	);

	const handleTouchEnd = useCallback(async () => {
		if (disabled || isRefreshing || !touchStartY.current) return;
		if (canRelease) {
			setState('refreshing');
			setPullDistance(0);
			try {
				await Promise.resolve(onRefresh());
			} finally {
				resetPullState(setState, setPullDistance, touchStartY);
			}
		} else {
			resetPullState(setState, setPullDistance, touchStartY);
		}
	}, [disabled, isRefreshing, canRelease, touchStartY, onRefresh, setState, setPullDistance]);

	return {
		containerRef,
		handleTouchStart,
		handleTouchMove,
		handleTouchEnd,
		isRefreshing,
		canRelease,
		isIdle,
		pullDistance,
	};
}
