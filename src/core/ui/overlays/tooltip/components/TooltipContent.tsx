import {
	getArrowClasses,
	getPositionClasses,
} from '@core/ui/overlays/tooltip/helpers/tooltipUtils';
import { componentZIndex } from '@core/ui/theme/tokens';
import type { TooltipProps } from '@src-types/ui/overlays/floating';
import type { ReactNode } from 'react';

interface TooltipContentProps {
	readonly tooltipId: string;
	readonly position: TooltipProps['position'];
	readonly content: ReactNode;
}

export function TooltipContent({ tooltipId, position, content }: Readonly<TooltipContentProps>) {
	const positionClasses = getPositionClasses(position);
	return (
		<div
			id={tooltipId}
			role="tooltip"
			className={`absolute ${positionClasses} pointer-events-none`}
			style={{ zIndex: componentZIndex.tooltip }}
		>
			<div className="rounded-md bg-surface-elevated px-2 py-1 text-sm text-text-primary shadow-lg dark:bg-surface-elevated dark:text-text-primary">
				{content}
			</div>
			<div className={getArrowClasses(position)} />
		</div>
	);
}
