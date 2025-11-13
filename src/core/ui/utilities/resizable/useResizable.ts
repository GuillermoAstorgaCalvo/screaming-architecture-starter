import type { ResizableDirection } from '@src-types/ui/overlays/containers';
import { type MouseEvent as ReactMouseEvent, type RefObject, useRef, useState } from 'react';

import { useResizeHandlers } from './useResizable.handlers';

export interface UseResizableOptions {
	readonly containerRef: RefObject<HTMLDivElement>;
	readonly direction: ResizableDirection;
	readonly minSize: number;
	readonly maxSize: number | undefined;
	readonly currentSize: number | undefined;
	readonly onResize: (size: number) => void;
	readonly disabled: boolean;
}

export interface UseResizableReturn {
	readonly handleMouseDown: (event: ReactMouseEvent<HTMLButtonElement>) => void;
	readonly isResizing: boolean;
}

export function useResizable({
	containerRef,
	direction,
	minSize,
	maxSize,
	currentSize: _currentSize,
	onResize,
	disabled,
}: UseResizableOptions): UseResizableReturn {
	const [isResizing, setIsResizing] = useState(false);
	const startPosRef = useRef<number>(0);
	const startSizeRef = useRef<number>(0);

	const handleMouseDown = useResizeHandlers({
		containerRef,
		direction,
		minSize,
		maxSize,
		onResize,
		disabled,
		isResizing,
		setIsResizing,
		startPosRef,
		startSizeRef,
	});

	return {
		handleMouseDown,
		isResizing,
	};
}
