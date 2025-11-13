import type { SwipeableAction, SwipeableDirection } from '@src-types/ui/overlays/interactions';

import {
	calculateSwipeDirection,
	getActionsForDirection,
	getDirectionFlags,
} from './SwipeableHelpers.direction';
import { getActionsContainerStyle, getContentStyle } from './SwipeableHelpers.styles';
import type { SwipeState } from './SwipeableHelpers.types';

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
 * Check if left swipe threshold is exceeded
 */
function exceedsLeftThreshold(
	flags: ReturnType<typeof getDirectionFlags>,
	deltaX: number,
	threshold: number
): boolean {
	return flags.isLeft && deltaX < -threshold;
}

/**
 * Check if right swipe threshold is exceeded
 */
function exceedsRightThreshold(
	flags: ReturnType<typeof getDirectionFlags>,
	deltaX: number,
	threshold: number
): boolean {
	return flags.isRight && deltaX > threshold;
}

/**
 * Check if up swipe threshold is exceeded
 */
function exceedsUpThreshold(
	flags: ReturnType<typeof getDirectionFlags>,
	deltaY: number,
	threshold: number
): boolean {
	return flags.isUp && deltaY < -threshold;
}

/**
 * Check if down swipe threshold is exceeded
 */
function exceedsDownThreshold(
	flags: ReturnType<typeof getDirectionFlags>,
	deltaY: number,
	threshold: number
): boolean {
	return flags.isDown && deltaY > threshold;
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
		exceedsLeftThreshold(flags, deltaX, threshold) ||
		exceedsRightThreshold(flags, deltaX, threshold) ||
		exceedsUpThreshold(flags, deltaY, threshold) ||
		exceedsDownThreshold(flags, deltaY, threshold)
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
