import type { SwipeableAction, SwipeableDirection } from '@src-types/ui/overlays/interactions';
import type { CSSProperties } from 'react';

/**
 * Swipe state
 */
export interface SwipeState {
	startX: number;
	startY: number;
	currentX: number;
	currentY: number;
	isSwiping: boolean;
}

/**
 * Reset swipe state
 */
export const RESET_SWIPE_STATE: SwipeState = {
	startX: 0,
	startY: 0,
	currentX: 0,
	currentY: 0,
	isSwiping: false,
};

/**
 * Parameters for calculating swipe direction
 */
interface SwipeDirectionParams {
	absDeltaX: number;
	absDeltaY: number;
	deltaX: number;
	deltaY: number;
}

/**
 * Calculate swipe direction from deltas
 */
export function calculateSwipeDirection(params: SwipeDirectionParams): SwipeableDirection | null {
	const { absDeltaX, absDeltaY, deltaX, deltaY } = params;
	if (absDeltaX > absDeltaY) {
		return deltaX > 0 ? 'right' : 'left';
	}
	if (absDeltaY > absDeltaX) {
		return deltaY > 0 ? 'down' : 'up';
	}
	return null;
}

/**
 * Parameters for getting actions
 */
interface ActionsParams {
	direction: SwipeableDirection | null;
	leftActions: readonly SwipeableAction[];
	rightActions: readonly SwipeableAction[];
	upActions: readonly SwipeableAction[];
	downActions: readonly SwipeableAction[];
}

/**
 * Get actions for a given swipe direction
 */
export function getActionsForDirection(params: ActionsParams): readonly SwipeableAction[] {
	const { direction, leftActions, rightActions, upActions, downActions } = params;
	if (!direction) {
		return [];
	}
	switch (direction) {
		case 'left': {
			return leftActions;
		}
		case 'right': {
			return rightActions;
		}
		case 'up': {
			return upActions;
		}
		case 'down': {
			return downActions;
		}
		default: {
			return [];
		}
	}
}

/**
 * Calculate content transform style
 */
export function getContentStyle(deltaX: number, deltaY: number): CSSProperties {
	return {
		transform: `translate(${deltaX}px, ${deltaY}px)`,
	};
}

/**
 * Parameters for actions container style
 */
interface ActionsContainerStyleParams {
	swipeDirection: SwipeableDirection | null;
	deltaX: number;
	deltaY: number;
	threshold: number;
}

/**
 * Calculate actions container style
 */
export function getActionsContainerStyle(params: ActionsContainerStyleParams): CSSProperties {
	const { swipeDirection, deltaX, deltaY, threshold } = params;
	if (swipeDirection === 'left' || swipeDirection === 'right') {
		const side = swipeDirection === 'left' ? 'left' : 'right';
		return {
			[side]: 0,
			width: `${Math.min(Math.abs(deltaX), threshold * 2)}px`,
		};
	}
	if (swipeDirection === 'up' || swipeDirection === 'down') {
		const side = swipeDirection === 'up' ? 'top' : 'bottom';
		return {
			[side]: 0,
			height: `${Math.min(Math.abs(deltaY), threshold * 2)}px`,
			width: '100%',
		};
	}
	return {};
}

/**
 * Calculate direction flags from direction prop
 */
export function getDirectionFlags(direction: SwipeableDirection) {
	const isHorizontal = direction === 'horizontal' || direction === 'all';
	const isVertical = direction === 'vertical' || direction === 'all';
	return {
		isHorizontal,
		isVertical,
		isLeft: direction === 'left' || isHorizontal,
		isRight: direction === 'right' || isHorizontal,
		isUp: direction === 'up' || isVertical,
		isDown: direction === 'down' || isVertical,
	};
}

/**
 * Parameters for checking if actions should be shown
 */
interface ShouldShowActionsParams {
	hasActions: boolean;
	flags: ReturnType<typeof getDirectionFlags>;
	deltaX: number;
	deltaY: number;
	threshold: number;
}

/**
 * Check if actions should be shown
 */
export function shouldShowActions(params: ShouldShowActionsParams): boolean {
	const { hasActions, flags, deltaX, deltaY, threshold } = params;
	if (!hasActions) {
		return false;
	}
	return (
		(flags.isLeft && deltaX < -threshold) ||
		(flags.isRight && deltaX > threshold) ||
		(flags.isUp && deltaY < -threshold) ||
		(flags.isDown && deltaY > threshold)
	);
}

/**
 * Parameters for calculating swipe values
 */
export interface CalculateSwipeValuesParams {
	swipeState: SwipeState;
	direction: SwipeableDirection;
	leftActions: readonly SwipeableAction[];
	rightActions: readonly SwipeableAction[];
	upActions: readonly SwipeableAction[];
	downActions: readonly SwipeableAction[];
	threshold: number;
}

/**
 * Calculate swipe values from state and props
 */
export function calculateSwipeValues(params: CalculateSwipeValuesParams) {
	const { swipeState, direction, leftActions, rightActions, upActions, downActions, threshold } =
		params;
	const directionFlags = getDirectionFlags(direction);
	const deltaX = swipeState.currentX - swipeState.startX;
	const deltaY = swipeState.currentY - swipeState.startY;
	const absDeltaX = Math.abs(deltaX);
	const absDeltaY = Math.abs(deltaY);
	const swipeDirection = calculateSwipeDirection({ absDeltaX, absDeltaY, deltaX, deltaY });
	const actions = getActionsForDirection({
		direction: swipeDirection,
		leftActions,
		rightActions,
		upActions,
		downActions,
	});
	const hasActions = actions.length > 0;
	const showActions = shouldShowActions({
		hasActions,
		flags: directionFlags,
		deltaX,
		deltaY,
		threshold,
	});
	return { deltaX, deltaY, swipeDirection, actions, showActions };
}

/**
 * Parameters for calculating swipe styles
 */
export interface SwipeStylesParams {
	deltaX: number;
	deltaY: number;
	swipeDirection: SwipeableDirection | null;
	threshold: number;
}

/**
 * Calculate all swipe-related styles
 */
export function calculateSwipeStyles(params: SwipeStylesParams) {
	const { deltaX, deltaY, swipeDirection, threshold } = params;
	const contentStyle = getContentStyle(deltaX, deltaY);
	const actionsContainerStyle = getActionsContainerStyle({
		swipeDirection,
		deltaX,
		deltaY,
		threshold,
	});
	return { contentStyle, actionsContainerStyle };
}
