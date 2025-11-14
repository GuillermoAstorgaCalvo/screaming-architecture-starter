import { ResizableContainer } from '@core/ui/utilities/resizable/components/ResizableContainer';
import { getOptionalProps } from '@core/ui/utilities/resizable/helpers/Resizable.helpers';
import { useResizableComponent } from '@core/ui/utilities/resizable/hooks/useResizableComponent';
import type { ResizableProps } from '@src-types/ui/overlays/containers';
import { type MouseEvent, type RefObject, useId, useRef } from 'react';

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
