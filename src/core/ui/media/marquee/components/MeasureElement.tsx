import type { ReactNode, RefObject } from 'react';

interface MeasureElementProps {
	readonly children: ReactNode;
	readonly measureRef: RefObject<HTMLDivElement | null>;
}

/**
 * Render the measure element for calculating duplicate count
 */
export function MeasureElement({ children, measureRef }: Readonly<MeasureElementProps>) {
	return (
		<div ref={measureRef} className="invisible absolute -z-10 flex" aria-hidden="true">
			{children}
		</div>
	);
}
