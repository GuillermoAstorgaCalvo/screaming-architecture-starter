import type { SwipeableAction, SwipeableDirection } from '@src-types/ui/overlays/interactions';
import { type Dispatch, type SetStateAction, type TouchEvent, useState } from 'react';

import {
	calculateSwipeStyles,
	calculateSwipeValues,
	RESET_SWIPE_STATE,
	type SwipeState,
} from './SwipeableHelpers';

/**
 * Parameters for touch handlers
 */
interface TouchHandlersParams {
	disabled: boolean;
	swipeState: SwipeState;
	setSwipeState: Dispatch<SetStateAction<SwipeState>>;
	showActions: boolean;
	swipeDirection: SwipeableDirection | null;
	onSwipe: ((direction: SwipeableDirection) => void) | undefined;
}

/**
 * Get first touch from touch event
 */
function getFirstTouch(e: TouchEvent<HTMLDivElement>) {
	const [touch] = Array.from(e.touches);
	return touch;
}

/**
 * Create touch start handler
 */
function createTouchStartHandler(
	disabled: boolean,
	setSwipeState: Dispatch<SetStateAction<SwipeState>>
) {
	return (e: TouchEvent<HTMLDivElement>) => {
		if (disabled) return;
		const touch = getFirstTouch(e);
		if (!touch) return;
		setSwipeState({
			startX: touch.clientX,
			startY: touch.clientY,
			currentX: touch.clientX,
			currentY: touch.clientY,
			isSwiping: true,
		});
	};
}

/**
 * Create touch move handler
 */
function createTouchMoveHandler(
	disabled: boolean,
	swipeState: SwipeState,
	setSwipeState: Dispatch<SetStateAction<SwipeState>>
) {
	return (e: TouchEvent<HTMLDivElement>) => {
		if (disabled || !swipeState.isSwiping) return;
		const touch = getFirstTouch(e);
		if (!touch) return;
		setSwipeState(prev => ({
			...prev,
			currentX: touch.clientX,
			currentY: touch.clientY,
		}));
	};
}

/**
 * Parameters for touch end handler
 */
interface TouchEndHandlerParams {
	disabled: boolean;
	swipeState: SwipeState;
	setSwipeState: Dispatch<SetStateAction<SwipeState>>;
	showActions: boolean;
	swipeDirection: SwipeableDirection | null;
	onSwipe: ((direction: SwipeableDirection) => void) | undefined;
}

/**
 * Create touch end handler
 */
function createTouchEndHandler(params: TouchEndHandlerParams) {
	const { disabled, swipeState, setSwipeState, showActions, swipeDirection, onSwipe } = params;
	return () => {
		if (disabled || !swipeState.isSwiping) return;
		if (showActions && swipeDirection) onSwipe?.(swipeDirection);
		setSwipeState(RESET_SWIPE_STATE);
	};
}

/**
 * Create action click handler
 */
function createActionClickHandler(setSwipeState: Dispatch<SetStateAction<SwipeState>>) {
	return async (action: SwipeableAction) => {
		await action.onAction?.();
		setSwipeState(RESET_SWIPE_STATE);
	};
}

/**
 * Create touch event handlers
 */
function useTouchHandlers(params: TouchHandlersParams) {
	const { disabled, swipeState, setSwipeState, showActions, swipeDirection, onSwipe } = params;

	const handleTouchStart = createTouchStartHandler(disabled, setSwipeState);
	const handleTouchMove = createTouchMoveHandler(disabled, swipeState, setSwipeState);
	const handleTouchEnd = createTouchEndHandler({
		disabled,
		swipeState,
		setSwipeState,
		showActions,
		swipeDirection,
		onSwipe,
	});
	const handleActionClick = createActionClickHandler(setSwipeState);

	return { handleTouchStart, handleTouchMove, handleTouchEnd, handleActionClick };
}

/**
 * Parameters for useSwipeable hook
 */
export interface UseSwipeableParams {
	direction: SwipeableDirection;
	threshold: number;
	leftActions: readonly SwipeableAction[];
	rightActions: readonly SwipeableAction[];
	upActions: readonly SwipeableAction[];
	downActions: readonly SwipeableAction[];
	disabled: boolean;
	onSwipe: ((direction: SwipeableDirection) => void) | undefined;
}

/**
 * Calculate swipe state and derived values
 */
function useSwipeCalculations(
	swipeState: SwipeState,
	params: Omit<UseSwipeableParams, 'disabled' | 'onSwipe'>
) {
	return calculateSwipeValues({
		swipeState,
		...params,
	});
}

/**
 * Parameters for building swipeable return value
 */
interface SwipeableReturnParams {
	handlers: ReturnType<typeof useTouchHandlers>;
	styles: ReturnType<typeof calculateSwipeStyles>;
	actions: readonly SwipeableAction[];
	showActions: boolean;
}

/**
 * Build return value for useSwipeable
 */
function buildSwipeableReturn(params: SwipeableReturnParams) {
	const { handlers, styles, actions, showActions } = params;
	return {
		...handlers,
		...styles,
		actions,
		showActions,
	};
}

/**
 * Custom hook for swipeable functionality
 */
export function useSwipeable(params: UseSwipeableParams) {
	const {
		direction,
		threshold,
		leftActions,
		rightActions,
		upActions,
		downActions,
		disabled,
		onSwipe,
	} = params;
	const [swipeState, setSwipeState] = useState<SwipeState>(RESET_SWIPE_STATE);

	const { deltaX, deltaY, swipeDirection, actions, showActions } = useSwipeCalculations(
		swipeState,
		{ direction, threshold, leftActions, rightActions, upActions, downActions }
	);

	const handlers = useTouchHandlers({
		swipeState,
		setSwipeState,
		disabled,
		showActions,
		swipeDirection,
		onSwipe,
	});

	const styles = calculateSwipeStyles({
		deltaX,
		deltaY,
		swipeDirection,
		threshold,
	});

	return buildSwipeableReturn({ handlers, styles, actions, showActions });
}
