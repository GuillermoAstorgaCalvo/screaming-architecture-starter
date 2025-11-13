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
			className={`absolute z-1600 ${positionClasses} pointer-events-none`}
			style={{ zIndex: componentZIndex.tooltip }}
		>
			<div className="rounded-md bg-gray-900 px-2 py-1 text-sm text-white shadow-lg dark:bg-gray-800 dark:text-gray-100">
				{content}
			</div>
			<div className={getArrowClasses(position)} />
		</div>
	);
}
