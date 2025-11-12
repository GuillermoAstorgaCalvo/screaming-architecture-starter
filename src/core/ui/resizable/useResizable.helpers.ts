import type { ResizableDirection } from '@src-types/ui/overlays';
import type { MouseEvent as ReactMouseEvent } from 'react';

interface MutableRef<T> {
	current: T;
}

export function isHorizontal(direction: ResizableDirection): boolean {
	return direction === 'horizontal' || direction === 'both';
}

interface CalculateSizeParams {
	readonly event: MouseEvent;
	readonly direction: ResizableDirection;
	readonly startPos: number;
	readonly startSize: number;
}

export function calculateNewSize({
	event,
	direction,
	startPos,
	startSize,
}: CalculateSizeParams): number {
	if (isHorizontal(direction)) {
		const deltaX = event.clientX - startPos;
		return startSize + deltaX;
	}
	const deltaY = event.clientY - startPos;
	return startSize + deltaY;
}

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

export function updateContainerSize(
	container: HTMLDivElement,
	direction: ResizableDirection,
	size: number
): void {
	if (isHorizontal(direction)) {
		container.style.width = `${size}px`;
	}
	if (direction === 'vertical' || direction === 'both') {
		container.style.height = `${size}px`;
	}
}

interface InitializeResizeParams {
	readonly event: ReactMouseEvent<HTMLButtonElement>;
	readonly container: HTMLDivElement;
	readonly direction: ResizableDirection;
	readonly startPosRef: MutableRef<number>;
	readonly startSizeRef: MutableRef<number>;
}

export function initializeResizeStart({
	event,
	container,
	direction,
	startPosRef,
	startSizeRef,
}: InitializeResizeParams): void {
	const rect = container.getBoundingClientRect();
	if (isHorizontal(direction)) {
		startPosRef.current = event.clientX;
		startSizeRef.current = rect.width;
	} else {
		startPosRef.current = event.clientY;
		startSizeRef.current = rect.height;
	}
}

interface HandleMouseMoveParams {
	readonly container: HTMLDivElement;
	readonly event: MouseEvent;
	readonly direction: ResizableDirection;
	readonly minSize: number;
	readonly maxSize: number | undefined;
	readonly onResize: (size: number) => void;
	readonly startPos: number;
	readonly startSize: number;
}

export function handleMouseMoveLogic({
	container,
	event,
	direction,
	minSize,
	maxSize,
	onResize,
	startPos,
	startSize,
}: HandleMouseMoveParams): void {
	const rawSize = calculateNewSize({
		event,
		direction,
		startPos,
		startSize,
	});
	const constrainedSize = applySizeConstraints(rawSize, minSize, maxSize);

	updateContainerSize(container, direction, constrainedSize);
	onResize(constrainedSize);
}

interface HandleMouseUpParams {
	readonly setIsResizing: (value: boolean) => void;
	readonly startPosRef: MutableRef<number>;
	readonly startSizeRef: MutableRef<number>;
}

export function handleMouseUpLogic({
	setIsResizing,
	startPosRef,
	startSizeRef,
}: HandleMouseUpParams): void {
	setIsResizing(false);
	startPosRef.current = 0;
	startSizeRef.current = 0;
}

interface HandleMouseDownParams {
	readonly container: HTMLDivElement;
	readonly event: ReactMouseEvent<HTMLButtonElement>;
	readonly direction: ResizableDirection;
	readonly setIsResizing: (value: boolean) => void;
	readonly startPosRef: MutableRef<number>;
	readonly startSizeRef: MutableRef<number>;
}

export function handleMouseDownLogic({
	container,
	event,
	direction,
	setIsResizing,
	startPosRef,
	startSizeRef,
}: HandleMouseDownParams): void {
	event.preventDefault();
	setIsResizing(true);
	initializeResizeStart({ event, container, direction, startPosRef, startSizeRef });
}
