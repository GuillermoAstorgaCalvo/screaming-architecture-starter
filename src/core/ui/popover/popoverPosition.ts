import type { PopoverPosition } from '@src-types/ui/overlays';

export interface PopoverPositionState {
	readonly top: number;
	readonly left: number;
}

const VIEWPORT_PADDING = 8;

interface CalculateVerticalPositionOptions {
	readonly triggerRect: DOMRect;
	readonly popoverHeight: number;
	readonly scrollY: number;
	readonly position: PopoverPosition;
}

/**
 * Calculates vertical position for popover
 */
function calculateVerticalPosition({
	triggerRect,
	popoverHeight,
	scrollY,
	position,
}: CalculateVerticalPositionOptions): number {
	if (position.startsWith('top')) {
		return triggerRect.top + scrollY - popoverHeight;
	}

	if (position.startsWith('bottom')) {
		return triggerRect.bottom + scrollY;
	}

	// For left/right, center vertically
	return triggerRect.top + scrollY + triggerRect.height / 2 - popoverHeight / 2;
}

interface CalculateHorizontalPositionOptions {
	readonly triggerRect: DOMRect;
	readonly popoverWidth: number;
	readonly scrollX: number;
	readonly position: PopoverPosition;
}

/**
 * Calculates horizontal position for popover
 */
function calculateHorizontalPosition({
	triggerRect,
	popoverWidth,
	scrollX,
	position,
}: CalculateHorizontalPositionOptions): number {
	if (position.startsWith('left')) {
		return triggerRect.left + scrollX - popoverWidth;
	}

	if (position.startsWith('right')) {
		return triggerRect.right + scrollX;
	}

	// For top/bottom, handle alignment
	if (position.endsWith('-start')) {
		return triggerRect.left + scrollX;
	}

	if (position.endsWith('-end')) {
		return triggerRect.right + scrollX - popoverWidth;
	}

	// Default: center
	return triggerRect.left + scrollX + triggerRect.width / 2 - popoverWidth / 2;
}

interface AdjustPositionForViewportOptions {
	readonly position: PopoverPositionState;
	readonly popoverRect: DOMRect;
	readonly scrollX: number;
	readonly scrollY: number;
}

/**
 * Adjusts position to stay within viewport bounds
 */
function adjustPositionForViewport({
	position,
	popoverRect,
	scrollX,
	scrollY,
}: AdjustPositionForViewportOptions): PopoverPositionState {
	const viewportWidth = globalThis.window.innerWidth;
	const viewportHeight = globalThis.window.innerHeight;
	let { top, left } = position;

	if (left < scrollX) {
		left = scrollX + VIEWPORT_PADDING;
	} else if (left + popoverRect.width > scrollX + viewportWidth) {
		left = scrollX + viewportWidth - popoverRect.width - VIEWPORT_PADDING;
	}

	if (top < scrollY) {
		top = scrollY + VIEWPORT_PADDING;
	} else if (top + popoverRect.height > scrollY + viewportHeight) {
		top = scrollY + viewportHeight - popoverRect.height - VIEWPORT_PADDING;
	}

	return { top, left };
}

/**
 * Calculates popover position based on trigger element and position prop
 */
export function calculatePopoverPosition(
	triggerElement: HTMLElement,
	popoverElement: HTMLElement,
	position: PopoverPosition
): PopoverPositionState {
	const triggerRect = triggerElement.getBoundingClientRect();
	const popoverRect = popoverElement.getBoundingClientRect();
	const { scrollX, scrollY } = globalThis.window;

	const top = calculateVerticalPosition({
		triggerRect,
		popoverHeight: popoverRect.height,
		scrollY,
		position,
	});
	const left = calculateHorizontalPosition({
		triggerRect,
		popoverWidth: popoverRect.width,
		scrollX,
		position,
	});

	return adjustPositionForViewport({ position: { top, left }, popoverRect, scrollX, scrollY });
}
