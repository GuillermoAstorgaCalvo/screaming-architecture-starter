import {
	handleMouseDownLogic,
	handleMouseMoveLogic,
	handleMouseUpLogic,
	isHorizontal,
} from '@core/ui/utilities/resizable/helpers/useResizable.helpers';
import type { ResizableDirection } from '@src-types/ui/overlays/containers';
import { type MouseEvent as ReactMouseEvent, type RefObject, useCallback, useEffect } from 'react';

interface MutableRef<T> {
	current: T;
}

interface UseResizeHandlersParams {
	readonly containerRef: RefObject<HTMLDivElement>;
	readonly direction: ResizableDirection;
	readonly minSize: number;
	readonly maxSize: number | undefined;
	readonly onResize: (size: number) => void;
	readonly disabled: boolean;
	readonly isResizing: boolean;
	readonly setIsResizing: (value: boolean) => void;
	readonly startPosRef: MutableRef<number>;
	readonly startSizeRef: MutableRef<number>;
}

interface SetupResizeEffectParams {
	readonly isResizing: boolean;
	readonly handleMouseMove: (event: MouseEvent) => void;
	readonly handleMouseUp: () => void;
	readonly direction: ResizableDirection;
}

function useResizeEffect({
	isResizing,
	handleMouseMove,
	handleMouseUp,
	direction,
}: SetupResizeEffectParams): void {
	useEffect(() => {
		if (!isResizing) {
			return;
		}

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		document.body.style.cursor = isHorizontal(direction) ? 'ew-resize' : 'ns-resize';
		document.body.style.userSelect = 'none';

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
			document.body.style.cursor = '';
			document.body.style.userSelect = '';
		};
	}, [isResizing, handleMouseMove, handleMouseUp, direction]);
}

interface UseMouseMoveHandlerParams {
	readonly containerRef: RefObject<HTMLDivElement>;
	readonly direction: ResizableDirection;
	readonly minSize: number;
	readonly maxSize: number | undefined;
	readonly onResize: (size: number) => void;
	readonly startPosRef: MutableRef<number>;
	readonly startSizeRef: MutableRef<number>;
}

function useMouseMoveHandler({
	containerRef,
	direction,
	minSize,
	maxSize,
	onResize,
	startPosRef,
	startSizeRef,
}: UseMouseMoveHandlerParams) {
	return useCallback(
		(event: MouseEvent) => {
			const container = containerRef.current;
			handleMouseMoveLogic({
				container,
				event,
				direction,
				minSize,
				maxSize,
				onResize,
				startPos: startPosRef.current,
				startSize: startSizeRef.current,
			});
		},
		[containerRef, direction, minSize, maxSize, onResize, startPosRef, startSizeRef]
	);
}

interface UseMouseUpHandlerParams {
	readonly setIsResizing: (value: boolean) => void;
	readonly startPosRef: MutableRef<number>;
	readonly startSizeRef: MutableRef<number>;
}

function useMouseUpHandler({ setIsResizing, startPosRef, startSizeRef }: UseMouseUpHandlerParams) {
	return useCallback(() => {
		handleMouseUpLogic({
			setIsResizing,
			startPosRef,
			startSizeRef,
		});
	}, [setIsResizing, startPosRef, startSizeRef]);
}

interface UseMouseDownHandlerParams {
	readonly containerRef: RefObject<HTMLDivElement>;
	readonly direction: ResizableDirection;
	readonly setIsResizing: (value: boolean) => void;
	readonly startPosRef: MutableRef<number>;
	readonly startSizeRef: MutableRef<number>;
}

function useMouseDownHandler({
	containerRef,
	direction,
	setIsResizing,
	startPosRef,
	startSizeRef,
}: UseMouseDownHandlerParams) {
	return useCallback(
		(event: ReactMouseEvent<HTMLButtonElement>) => {
			const container = containerRef.current;
			handleMouseDownLogic({
				container,
				event,
				direction,
				setIsResizing,
				startPosRef,
				startSizeRef,
			});
		},
		[containerRef, direction, setIsResizing, startPosRef, startSizeRef]
	);
}

export function useResizeHandlers(params: UseResizeHandlersParams) {
	const {
		containerRef,
		direction,
		minSize,
		maxSize,
		onResize,
		disabled: _disabled,
		isResizing,
		setIsResizing,
		startPosRef,
		startSizeRef,
	} = params;

	const handleMouseMove = useMouseMoveHandler({
		containerRef,
		direction,
		minSize,
		maxSize,
		onResize,
		startPosRef,
		startSizeRef,
	});
	const handleMouseUp = useMouseUpHandler({ setIsResizing, startPosRef, startSizeRef });
	useResizeEffect({ isResizing, handleMouseMove, handleMouseUp, direction });
	const handleMouseDown = useMouseDownHandler({
		containerRef,
		direction,
		setIsResizing,
		startPosRef,
		startSizeRef,
	});

	return handleMouseDown;
}
