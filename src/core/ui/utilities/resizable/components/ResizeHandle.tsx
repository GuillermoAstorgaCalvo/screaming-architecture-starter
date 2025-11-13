import {
	getAriaLabel,
	getResizeHandleClasses,
} from '@core/ui/utilities/resizable/helpers/ResizableContainer.helpers';
import type { ResizableDirection } from '@src-types/ui/overlays/containers';
import type { MouseEvent } from 'react';
import { twMerge } from 'tailwind-merge';

export interface ResizeHandleProps {
	readonly direction: ResizableDirection;
	readonly disabled: boolean;
	readonly handleClassName: string | undefined;
	readonly onMouseDown: (event: MouseEvent<HTMLButtonElement>) => void;
}

export function ResizeHandle({
	direction,
	disabled,
	handleClassName,
	onMouseDown,
}: ResizeHandleProps) {
	if (disabled) return null;

	const handleClasses = getResizeHandleClasses(direction, disabled);
	const ariaLabel = getAriaLabel(direction);

	return (
		<button
			type="button"
			className={twMerge(handleClasses, handleClassName)}
			onMouseDown={onMouseDown}
			aria-label={ariaLabel}
			tabIndex={0}
		/>
	);
}
