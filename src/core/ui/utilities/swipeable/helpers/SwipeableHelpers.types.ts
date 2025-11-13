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
