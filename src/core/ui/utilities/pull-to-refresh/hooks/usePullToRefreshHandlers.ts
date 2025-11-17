import {
	calculatePullDistance,
	getFirstTouch,
	getPullState,
	isContainerAtTop,
	type PullState,
	resetPullState,
} from '@core/ui/utilities/pull-to-refresh/helpers/PullToRefreshHelpers';
import {
	usePullToRefreshState,
	type UsePullToRefreshStateReturn,
} from '@core/ui/utilities/pull-to-refresh/hooks/usePullToRefreshState';
import {
	type Dispatch,
	type RefObject,
	type SetStateAction,
	type Touch,
	type TouchEvent,
	useCallback,
} from 'react';

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

export function usePullToRefreshHandlers({
	disabled,
	threshold,
	onRefresh,
}: UsePullToRefreshHandlersOptions): UsePullToRefreshHandlersReturn {
	const state = usePullToRefreshState(threshold);
	const handlers = usePullToRefreshTouchHandlers({
		disabled,
		threshold,
		onRefresh,
		setState: state.setState,
		setPullDistance: state.setPullDistance,
		touchStartY: state.touchStartY,
		containerRef: state.containerRef,
		isRefreshing: state.isRefreshing,
		canRelease: state.canRelease,
	});

	return {
		containerRef: state.containerRef,
		handleTouchStart: handlers.handleTouchStart,
		handleTouchMove: handlers.handleTouchMove,
		handleTouchEnd: handlers.handleTouchEnd,
		isRefreshing: state.isRefreshing,
		canRelease: state.canRelease,
		isIdle: state.isIdle,
		pullDistance: state.pullDistance,
	};
}

type TouchStartRef = UsePullToRefreshStateReturn['touchStartY'];

type PullToRefreshTouchHandlerDeps = UsePullToRefreshHandlersOptions &
	Pick<
		UsePullToRefreshStateReturn,
		'setState' | 'setPullDistance' | 'touchStartY' | 'containerRef' | 'isRefreshing' | 'canRelease'
	>;

function usePullToRefreshTouchHandlers({
	disabled,
	threshold,
	onRefresh,
	setState,
	setPullDistance,
	touchStartY,
	containerRef,
	isRefreshing,
	canRelease,
}: PullToRefreshTouchHandlerDeps): Pick<
	UsePullToRefreshHandlersReturn,
	'handleTouchStart' | 'handleTouchMove' | 'handleTouchEnd'
> {
	const handleTouchStart = useCallback(
		(e: TouchEvent<HTMLDivElement>) => {
			if (isInteractionBlocked(disabled, isRefreshing)) return;
			const touch = getFirstTouch(e.touches);
			recordTouchStart(touch, containerRef, touchStartY);
		},
		[disabled, isRefreshing, containerRef, touchStartY]
	);

	const handleTouchMove = useCallback(
		(e: TouchEvent<HTMLDivElement>) => {
			if (shouldSkipInteraction(disabled, isRefreshing, touchStartY)) return;
			const touch = getFirstTouch(e.touches);
			updatePullProgress({
				touch,
				containerRef,
				touchStartY,
				threshold,
				setPullDistance,
				setState,
				preventDefault: () => e.preventDefault(),
			});
		},
		[disabled, isRefreshing, threshold, containerRef, touchStartY, setPullDistance, setState]
	);

	const handleTouchEnd = useCallback(async () => {
		if (shouldSkipInteraction(disabled, isRefreshing, touchStartY)) return;
		await finalizePullInteraction({
			canRelease,
			onRefresh,
			setState,
			setPullDistance,
			touchStartY,
		});
	}, [disabled, isRefreshing, canRelease, touchStartY, onRefresh, setState, setPullDistance]);

	return { handleTouchStart, handleTouchMove, handleTouchEnd };
}

function isInteractionBlocked(disabled: boolean, isRefreshing: boolean): boolean {
	return disabled || isRefreshing;
}

function recordTouchStart(
	touch: Touch | null,
	containerRef: RefObject<HTMLDivElement | null>,
	touchStartY: TouchStartRef
): void {
	if (!touch || !isContainerAtTop(containerRef)) {
		return;
	}

	touchStartY.current = touch.clientY;
}

function shouldSkipInteraction(
	disabled: boolean,
	isRefreshing: boolean,
	touchStartY: TouchStartRef
): boolean {
	return isInteractionBlocked(disabled, isRefreshing) || !touchStartY.current;
}

interface UpdatePullProgressOptions {
	touch: Touch | null;
	containerRef: RefObject<HTMLDivElement | null>;
	touchStartY: TouchStartRef;
	threshold: number;
	setPullDistance: Dispatch<SetStateAction<number>>;
	setState: Dispatch<SetStateAction<PullState>>;
	preventDefault: () => void;
}

function updatePullProgress({
	touch,
	containerRef,
	touchStartY,
	threshold,
	setPullDistance,
	setState,
	preventDefault,
}: UpdatePullProgressOptions): void {
	if (!touch || !isContainerAtTop(containerRef) || !touchStartY.current) {
		return;
	}

	const deltaY = touch.clientY - touchStartY.current;
	if (deltaY <= 0) return;

	const distance = calculatePullDistance(deltaY, threshold);
	setPullDistance(distance);
	setState(getPullState(distance, threshold));
	preventDefault();
}

interface FinalizePullInteractionOptions {
	canRelease: boolean;
	onRefresh: () => Promise<void> | void;
	setState: Dispatch<SetStateAction<PullState>>;
	setPullDistance: Dispatch<SetStateAction<number>>;
	touchStartY: TouchStartRef;
}

async function finalizePullInteraction({
	canRelease,
	onRefresh,
	setState,
	setPullDistance,
	touchStartY,
}: FinalizePullInteractionOptions): Promise<void> {
	if (!canRelease) {
		resetPullState(setState, setPullDistance, touchStartY);
		return;
	}

	setState('refreshing');
	setPullDistance(0);
	try {
		await Promise.resolve(onRefresh());
	} finally {
		resetPullState(setState, setPullDistance, touchStartY);
	}
}
