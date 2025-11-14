import {
	getArrowClasses,
	getPositionClasses,
} from '@core/ui/overlays/hover-card/helpers/hoverCardUtils';
import { componentZIndex } from '@core/ui/theme/tokens';
import type { HoverCardProps } from '@src-types/ui/overlays/floating';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

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
		'rounded-lg border border-border bg-surface p-4 text-sm text-text-primary shadow-lg dark:border-border dark:bg-surface dark:text-text-primary';
	const contentClasses = twMerge(baseContentClasses, contentClassName);

	return (
		<div
			id={hoverCardId}
			role="tooltip"
			className={`absolute ${positionClasses} pointer-events-none`}
			style={{ zIndex: componentZIndex.tooltip }}
		>
			<div className={contentClasses}>{content}</div>
			{showArrow ? <div className={getArrowClasses(position)} /> : null}
		</div>
	);
}
