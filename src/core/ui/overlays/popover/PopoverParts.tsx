import type { ReactNode, RefObject } from 'react';

import type { PopoverPositionState } from './popoverPosition';

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
				zIndex: 1500,
			}}
		>
			{children}
		</div>
	);
}
