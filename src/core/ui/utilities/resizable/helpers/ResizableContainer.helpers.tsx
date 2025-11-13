import { ResizeHandle } from '@core/ui/utilities/resizable/components/ResizeHandle';
import type {
	ContainerClassesParams,
	ContainerStylesParams,
	PrepareContainerParams,
	PrepareDataParams,
	PreparedContainerData,
	PreparedData,
} from '@core/ui/utilities/resizable/types/ResizableContainer.types';
import type { ResizableDirection } from '@src-types/ui/overlays/containers';
import type { CSSProperties } from 'react';
import { twMerge } from 'tailwind-merge';

export function getResizeHandleClasses(direction: ResizableDirection, disabled: boolean): string {
	const baseClasses = 'absolute bg-gray-300 dark:bg-gray-600 transition-colors';
	const hoverClasses = disabled ? '' : 'hover:bg-gray-400 dark:hover:bg-gray-500';

	if (direction === 'horizontal') {
		return twMerge(baseClasses, hoverClasses, 'right-0 top-0 bottom-0 w-1 cursor-ew-resize');
	}
	if (direction === 'vertical') {
		return twMerge(baseClasses, hoverClasses, 'bottom-0 left-0 right-0 h-1 cursor-ns-resize');
	}
	// both
	return twMerge(baseClasses, hoverClasses, 'right-0 bottom-0 w-1 h-1 cursor-nwse-resize');
}

export function getContainerClasses({
	isResizing,
	disabled,
	className,
}: ContainerClassesParams): string {
	const baseClasses = 'relative overflow-hidden';
	const resizingClasses = isResizing ? 'select-none' : '';
	const disabledClasses = disabled ? 'opacity-50' : '';

	return twMerge(baseClasses, resizingClasses, disabledClasses, className);
}

export function getSizeStyles(
	direction: ResizableDirection,
	size: number | undefined
): CSSProperties {
	const sizeStyles: CSSProperties = {};
	if (size !== undefined) {
		if (direction === 'horizontal' || direction === 'both') {
			sizeStyles.width = `${size}px`;
		}
		if (direction === 'vertical' || direction === 'both') {
			sizeStyles.height = `${size}px`;
		}
	}
	return sizeStyles;
}

export function getAriaLabel(direction: ResizableDirection): string {
	return `Resize handle (${direction === 'horizontal' ? 'horizontal' : 'vertical'} direction)`;
}

export function getContainerStyles({
	direction,
	size,
	style,
}: ContainerStylesParams): CSSProperties {
	const sizeStyles = getSizeStyles(direction, size);
	return { ...sizeStyles, ...style };
}

export function prepareContainerData({
	direction,
	size,
	style,
	isResizing,
	disabled,
	className,
}: PrepareContainerParams): PreparedContainerData {
	const containerStyle = getContainerStyles({ direction, size, style });
	const containerClasses = getContainerClasses({ isResizing, disabled, className });
	return { containerStyle, containerClasses };
}

export function prepareAllData({
	direction,
	size,
	style,
	isResizing,
	disabled,
	className,
	handleClassName,
	onMouseDown,
}: PrepareDataParams): PreparedData {
	const { containerStyle, containerClasses } = prepareContainerData({
		direction,
		size,
		style,
		isResizing,
		disabled,
		className,
	});

	const handle = (
		<ResizeHandle
			direction={direction}
			disabled={disabled}
			handleClassName={handleClassName}
			onMouseDown={onMouseDown}
		/>
	);

	return { containerStyle, containerClasses, handle };
}
