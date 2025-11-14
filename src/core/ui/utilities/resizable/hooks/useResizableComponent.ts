import { parseSize, type SizeValue } from '@core/ui/utilities/resizable/helpers/Resizable.helpers';
import { useResizable } from '@core/ui/utilities/resizable/hooks/useResizable';
import { useResizableState } from '@core/ui/utilities/resizable/hooks/useResizableState';
import type { ResizableProps } from '@src-types/ui/overlays/containers';
import type { MouseEvent, RefObject } from 'react';

export interface UseResizableComponentParams {
	readonly containerRef: RefObject<HTMLDivElement>;
	readonly defaultSize: SizeValue | undefined;
	readonly controlledSize: SizeValue | undefined;
	readonly direction: ResizableProps['direction'];
	readonly minSize: SizeValue;
	readonly maxSize: SizeValue | undefined;
	readonly onResize: ResizableProps['onResize'];
	readonly disabled: boolean;
}

export interface UseResizableComponentReturn {
	readonly currentSize: number | undefined;
	readonly handleMouseDown: (event: MouseEvent<HTMLButtonElement>) => void;
	readonly isResizing: boolean;
}

/**
 * Main hook for Resizable component that combines state management and resize logic
 */
export function useResizableComponent({
	containerRef,
	defaultSize,
	controlledSize,
	direction,
	minSize,
	maxSize,
	onResize,
	disabled,
}: UseResizableComponentParams): UseResizableComponentReturn {
	const { currentSize, setInternalSize, isControlled } = useResizableState({
		defaultSize,
		controlledSize,
	});

	const { handleMouseDown, isResizing } = useResizable({
		containerRef,
		direction: direction ?? 'horizontal',
		minSize: parseSize(minSize),
		maxSize: maxSize === undefined ? undefined : parseSize(maxSize),
		currentSize,
		onResize: newSize => {
			if (!isControlled) {
				setInternalSize(newSize);
			}
			onResize?.(newSize);
		},
		disabled,
	});

	return { currentSize, handleMouseDown, isResizing };
}
