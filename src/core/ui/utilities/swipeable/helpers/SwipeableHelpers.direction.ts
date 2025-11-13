import type { SwipeableAction, SwipeableDirection } from '@src-types/ui/overlays/interactions';

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
 * Direction flags lookup
 */
const DIRECTION_FLAGS: Record<
	SwipeableDirection,
	{
		isHorizontal: boolean;
		isVertical: boolean;
		isLeft: boolean;
		isRight: boolean;
		isUp: boolean;
		isDown: boolean;
	}
> = {
	all: {
		isHorizontal: true,
		isVertical: true,
		isLeft: true,
		isRight: true,
		isUp: true,
		isDown: true,
	},
	horizontal: {
		isHorizontal: true,
		isVertical: false,
		isLeft: true,
		isRight: true,
		isUp: false,
		isDown: false,
	},
	vertical: {
		isHorizontal: false,
		isVertical: true,
		isLeft: false,
		isRight: false,
		isUp: true,
		isDown: true,
	},
	left: {
		isHorizontal: true,
		isVertical: false,
		isLeft: true,
		isRight: false,
		isUp: false,
		isDown: false,
	},
	right: {
		isHorizontal: true,
		isVertical: false,
		isLeft: false,
		isRight: true,
		isUp: false,
		isDown: false,
	},
	up: {
		isHorizontal: false,
		isVertical: true,
		isLeft: false,
		isRight: false,
		isUp: true,
		isDown: false,
	},
	down: {
		isHorizontal: false,
		isVertical: true,
		isLeft: false,
		isRight: false,
		isUp: false,
		isDown: true,
	},
};

/**
 * Calculate direction flags from direction prop
 */
export function getDirectionFlags(direction: SwipeableDirection) {
	return DIRECTION_FLAGS[direction];
}
