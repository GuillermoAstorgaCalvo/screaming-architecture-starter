import type { PullState } from '@core/ui/utilities/pull-to-refresh/helpers/PullToRefreshHelpers';
import { type Dispatch, type RefObject, type SetStateAction, useRef, useState } from 'react';

/**
 * Hook return type for pull-to-refresh state
 */
export interface UsePullToRefreshStateReturn {
	state: PullState;
	setState: Dispatch<SetStateAction<PullState>>;
	pullDistance: number;
	setPullDistance: Dispatch<SetStateAction<number>>;
	touchStartY: { current: number | null };
	containerRef: RefObject<HTMLDivElement | null>;
	isRefreshing: boolean;
	canRelease: boolean;
	isIdle: boolean;
}

/**
 * Hook for managing pull-to-refresh state
 *
 * @param threshold - The distance threshold required to trigger refresh
 * @returns State and setters for pull-to-refresh functionality
 */
export function usePullToRefreshState(threshold: number): UsePullToRefreshStateReturn {
	const [state, setState] = useState<PullState>('idle');
	const [pullDistance, setPullDistance] = useState(0);
	const touchStartY = useRef<number | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	return {
		state,
		setState,
		pullDistance,
		setPullDistance,
		touchStartY,
		containerRef,
		isRefreshing: state === 'refreshing',
		canRelease: pullDistance >= threshold,
		isIdle: state === 'idle',
	};
}
