import type { ResizableProps } from '@src-types/ui/overlays/containers';
import { type MouseEvent, type RefObject, useId, useRef, useState } from 'react';

import { ResizableContainer } from './ResizableContainer';
import { useResizable } from './useResizable';

type SizeValue = string | number;

/**
 * Parses a size value (string or number) to pixels
 */
function parseSize(size: SizeValue): number {
	if (typeof size === 'number') {
		return size;
	}
	// Remove 'px' or '%' and parse
	return Number.parseFloat(size);
}

interface UseResizableStateParams {
	readonly defaultSize: SizeValue | undefined;
	readonly controlledSize: SizeValue | undefined;
}

function useResizableState({ defaultSize, controlledSize }: UseResizableStateParams) {
	const [internalSize, setInternalSize] = useState<number | undefined>(
		defaultSize === undefined ? undefined : parseSize(defaultSize)
	);

	const currentSize = controlledSize === undefined ? internalSize : parseSize(controlledSize);

	return { currentSize, setInternalSize, isControlled: controlledSize !== undefined };
}

interface UseResizableHookParams {
	readonly containerRef: RefObject<HTMLDivElement>;
	readonly direction: ResizableProps['direction'];
	readonly minSize: SizeValue;
	readonly maxSize: SizeValue | undefined;
	readonly currentSize: number | undefined;
	readonly onResize: ResizableProps['onResize'];
	readonly disabled: boolean;
	readonly isControlled: boolean;
	readonly setInternalSize: (size: number) => void;
}

function useResizableHook({
	containerRef,
	direction,
	minSize,
	maxSize,
	currentSize,
	onResize,
	disabled,
	isControlled,
	setInternalSize,
}: UseResizableHookParams) {
	return useResizable({
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
}

interface UseResizableComponentParams {
	readonly containerRef: RefObject<HTMLDivElement>;
	readonly defaultSize: SizeValue | undefined;
	readonly controlledSize: SizeValue | undefined;
	readonly direction: ResizableProps['direction'];
	readonly minSize: SizeValue;
	readonly maxSize: SizeValue | undefined;
	readonly onResize: ResizableProps['onResize'];
	readonly disabled: boolean;
}

function useResizableComponent({
	containerRef,
	defaultSize,
	controlledSize,
	direction,
	minSize,
	maxSize,
	onResize,
	disabled,
}: UseResizableComponentParams) {
	const { currentSize, setInternalSize, isControlled } = useResizableState({
		defaultSize,
		controlledSize,
	});

	const { handleMouseDown, isResizing } = useResizableHook({
		containerRef,
		direction,
		minSize,
		maxSize,
		currentSize,
		onResize,
		disabled,
		isControlled,
		setInternalSize,
	});

	return { currentSize, handleMouseDown, isResizing };
}

function getOptionalProps(
	className: string | undefined,
	handleClassName: string | undefined,
	style: ResizableProps['style']
) {
	return {
		...(className !== undefined && { className }),
		...(handleClassName !== undefined && { handleClassName }),
		...(style !== undefined && { style }),
	};
}

/**
 * Resizable - Component for creating resizable panels/containers.
 * Supports multiple directions, min/max constraints, controlled/uncontrolled modes.
 *
 * @example
 * ```tsx
 * <Resizable direction="horizontal" defaultSize="50%">
 *   <div>Left panel</div>
 * </Resizable>
 * ```
 */
export default function Resizable({
	children,
	direction = 'horizontal',
	minSize = 0,
	maxSize,
	defaultSize,
	size: controlledSize,
	onResize,
	disabled = false,
	className,
	handleClassName,
	style,
}: Readonly<ResizableProps>) {
	const resizableId = useId();
	const containerRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
	const { currentSize, handleMouseDown, isResizing } = useResizableComponent({
		containerRef,
		defaultSize,
		controlledSize,
		direction,
		minSize,
		maxSize,
		onResize,
		disabled,
	});

	return (
		<ResizableContainer
			ref={containerRef}
			id={resizableId}
			direction={direction}
			size={currentSize}
			isResizing={isResizing}
			disabled={disabled}
			{...getOptionalProps(className, handleClassName, style)}
			onMouseDown={handleMouseDown as (event: MouseEvent<HTMLButtonElement>) => void}
		>
			{children}
		</ResizableContainer>
	);
}
