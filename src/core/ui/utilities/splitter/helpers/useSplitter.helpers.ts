import type { SplitterOrientation, SplitterSize } from '@src-types/ui/layout/splitter';
import type { CSSProperties } from 'react';

/**
 * Parse a size value (string or number) to pixels
 */
export function parseSize(size: SplitterSize | undefined, containerSize: number): number {
	if (size === undefined) {
		return 0;
	}
	if (typeof size === 'number') {
		return size;
	}
	// Handle percentage
	if (size.endsWith('%')) {
		const percentage = Number.parseFloat(size);
		return (containerSize * percentage) / 100;
	}
	// Handle pixels
	if (size.endsWith('px')) {
		return Number.parseFloat(size);
	}
	// Try to parse as number
	const parsed = Number.parseFloat(size);
	return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Check if orientation is horizontal
 */
export function isHorizontal(orientation: SplitterOrientation): boolean {
	return orientation === 'horizontal';
}

/**
 * Calculate new size based on mouse position
 */
export function calculateNewSize({
	event,
	orientation,
	startPos,
	startSize,
}: {
	readonly event: MouseEvent;
	readonly orientation: SplitterOrientation;
	readonly startPos: number;
	readonly startSize: number;
}): number {
	if (isHorizontal(orientation)) {
		const deltaX = event.clientX - startPos;
		return startSize + deltaX;
	}
	const deltaY = event.clientY - startPos;
	return startSize + deltaY;
}

/**
 * Apply size constraints (min/max)
 */
export function applySizeConstraints(
	size: number,
	minSize: number,
	maxSize: number | undefined
): number {
	if (size < minSize) {
		return minSize;
	}
	if (maxSize !== undefined && size > maxSize) {
		return maxSize;
	}
	return size;
}

/**
 * Convert size to CSS value
 */
export function sizeToCSS(size: number | undefined): string {
	if (size === undefined) {
		return 'auto';
	}
	return `${size}px`;
}

/**
 * Get the dimension (width or height) based on orientation
 */
export function getDimension(orientation: SplitterOrientation, element: HTMLElement): number {
	return isHorizontal(orientation) ? element.offsetWidth : element.offsetHeight;
}

/**
 * Set the dimension (width or height) based on orientation
 */
export function setDimension(
	orientation: SplitterOrientation,
	element: HTMLElement,
	size: number
): void {
	if (isHorizontal(orientation)) {
		element.style.width = `${size}px`;
	} else {
		element.style.height = `${size}px`;
	}
}

/**
 * Parse default size value to pixels
 */
export function parseDefaultSize(
	defaultSize: SplitterSize,
	orientation: SplitterOrientation,
	element: HTMLElement
): number | null {
	if (typeof defaultSize === 'number') {
		return defaultSize;
	}
	if (defaultSize.endsWith('%')) {
		const parent = element.parentElement;
		if (!parent) {
			return null;
		}
		return (getDimension(orientation, parent) * Number.parseFloat(defaultSize)) / 100;
	}
	return Number.parseFloat(defaultSize);
}

/**
 * Get dimension key (width or height) based on orientation
 */
function getDimensionKey(orientation: SplitterOrientation): 'width' | 'height' {
	return orientation === 'horizontal' ? 'width' : 'height';
}

/**
 * Get normal size if panel should use it, otherwise null
 */
function getNormalSize(
	panelState: { size?: number | undefined } | undefined,
	isCollapsed: boolean
): number | null {
	if (panelState?.size !== undefined && !isCollapsed) {
		return panelState.size;
	}
	return null;
}

/**
 * Check if panel should be collapsed
 */
function shouldCollapse(isCollapsed: boolean, collapsible: boolean): boolean {
	return isCollapsed && collapsible;
}

/**
 * Calculate panel style based on state
 */
export function calculatePanelStyle({
	orientation,
	panelState,
	isCollapsed,
	collapsible,
	collapsedSize,
	style,
}: {
	readonly orientation: SplitterOrientation;
	readonly panelState?: { size?: number | undefined } | undefined;
	readonly isCollapsed: boolean;
	readonly collapsible: boolean;
	readonly collapsedSize: number;
	readonly style?: CSSProperties | undefined;
}): CSSProperties {
	const dimensionKey = getDimensionKey(orientation);
	const panelStyle: CSSProperties = { ...style };

	const normalSize = getNormalSize(panelState, isCollapsed);
	if (normalSize !== null) {
		panelStyle[dimensionKey] = sizeToCSS(normalSize);
	}

	if (shouldCollapse(isCollapsed, collapsible)) {
		panelStyle[dimensionKey] = `${collapsedSize}px`;
	}

	return panelStyle;
}
