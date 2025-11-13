import type { SwipeableDirection } from '@src-types/ui/overlays/interactions';
import type { CSSProperties } from 'react';

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
 * Get horizontal actions container style
 */
function getHorizontalActionsStyle(
	swipeDirection: 'left' | 'right',
	deltaX: number,
	threshold: number
): CSSProperties {
	const side = swipeDirection === 'left' ? 'left' : 'right';
	return {
		[side]: 0,
		width: `${Math.min(Math.abs(deltaX), threshold * 2)}px`,
	};
}

/**
 * Get vertical actions container style
 */
function getVerticalActionsStyle(
	swipeDirection: 'up' | 'down',
	deltaY: number,
	threshold: number
): CSSProperties {
	const side = swipeDirection === 'up' ? 'top' : 'bottom';
	return {
		[side]: 0,
		height: `${Math.min(Math.abs(deltaY), threshold * 2)}px`,
		width: '100%',
	};
}

/**
 * Calculate actions container style
 */
export function getActionsContainerStyle(params: ActionsContainerStyleParams): CSSProperties {
	const { swipeDirection, deltaX, deltaY, threshold } = params;
	if (swipeDirection === 'left' || swipeDirection === 'right') {
		return getHorizontalActionsStyle(swipeDirection, deltaX, threshold);
	}
	if (swipeDirection === 'up' || swipeDirection === 'down') {
		return getVerticalActionsStyle(swipeDirection, deltaY, threshold);
	}
	return {};
}
