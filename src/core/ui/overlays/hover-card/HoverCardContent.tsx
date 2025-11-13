import { componentZIndex } from '@core/ui/theme/tokens';
import type { HoverCardProps } from '@src-types/ui/overlays/floating';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { getArrowClasses, getPositionClasses } from './hoverCardUtils';

interface HoverCardContentProps {
	readonly hoverCardId: string;
	readonly position: HoverCardProps['position'];
	readonly content: ReactNode;
	readonly contentClassName?: string;
	readonly showArrow: boolean;
}

export function HoverCardContent({
	hoverCardId,
	position,
	content,
	contentClassName,
	showArrow,
}: Readonly<HoverCardContentProps>) {
	const positionClasses = getPositionClasses(position);
	const baseContentClasses =
		'rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-900 shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100';
	const contentClasses = twMerge(baseContentClasses, contentClassName);

	return (
		<div
			id={hoverCardId}
			role="tooltip"
			className={`absolute z-1600 ${positionClasses} pointer-events-none`}
			style={{ zIndex: componentZIndex.tooltip }}
		>
			<div className={contentClasses}>{content}</div>
			{showArrow ? <div className={getArrowClasses(position)} /> : null}
		</div>
	);
}
