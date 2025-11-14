import type { PopoverPositionState } from '@core/ui/overlays/popover/helpers/popoverPosition';
import { componentZIndex } from '@core/ui/theme/tokens';
import type { ReactNode, RefObject } from 'react';

interface PopoverContentProps {
	readonly popoverRef: RefObject<HTMLDivElement>;
	readonly position: PopoverPositionState;
	readonly id: string;
	readonly className?: string;
	readonly children: ReactNode;
}

export function PopoverContent({
	popoverRef,
	position,
	id,
	className,
	children,
}: Readonly<PopoverContentProps>) {
	return (
		<div
			ref={popoverRef}
			id={id}
			className={className}
			style={{
				position: 'absolute',
				top: `${position.top}px`,
				left: `${position.left}px`,
				zIndex: componentZIndex.popover,
			}}
		>
			{children}
		</div>
	);
}
