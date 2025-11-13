import { useSplitterContext } from '@core/ui/utilities/splitter/components/SplitterContext';
import { isHorizontal } from '@core/ui/utilities/splitter/helpers/useSplitter.helpers';
import type { SplitterOrientation } from '@src-types/ui/layout/splitter';
import { forwardRef, type MouseEvent } from 'react';
import { twMerge } from 'tailwind-merge';

export interface SplitterHandleProps {
	readonly panelIndex: number;
	readonly className?: string;
}

function getHandleClasses(orientation: SplitterOrientation, disabled: boolean): string {
	const baseClasses =
		'bg-gray-300 dark:bg-gray-600 transition-colors flex items-center justify-center';
	const hoverClasses = disabled ? '' : 'hover:bg-gray-400 dark:hover:bg-gray-500 cursor-ew-resize';
	const verticalClasses = 'cursor-ns-resize';

	if (orientation === 'horizontal') {
		return twMerge(baseClasses, hoverClasses, 'w-1');
	}
	return twMerge(baseClasses, hoverClasses.replace('cursor-ew-resize', verticalClasses), 'h-1');
}

export const SplitterHandle = forwardRef<HTMLButtonElement, SplitterHandleProps>(
	({ panelIndex, className }, ref) => {
		const { orientation, disabled, handleSize, handleClassName, handleMouseDown } =
			useSplitterContext();

		const handleClasses = getHandleClasses(orientation, disabled);
		const sizeStyle = isHorizontal(orientation)
			? { width: `${handleSize}px` }
			: { height: `${handleSize}px` };

		const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
			event.preventDefault();
			event.stopPropagation();
		};

		return (
			<button
				ref={ref}
				type="button"
				className={twMerge(handleClasses, handleClassName, className)}
				style={sizeStyle}
				onMouseDown={e => {
					handleClick(e);
					handleMouseDown(e, panelIndex);
				}}
				onClick={handleClick}
				disabled={disabled}
				aria-label={`Resize panel ${panelIndex + 1}`}
				tabIndex={disabled ? -1 : 0}
			/>
		);
	}
);

SplitterHandle.displayName = 'SplitterHandle';
