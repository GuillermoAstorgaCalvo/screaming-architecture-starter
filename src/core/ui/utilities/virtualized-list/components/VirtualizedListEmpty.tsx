import i18n from '@core/i18n/i18n';
import {
	getContainerClasses,
	getContainerStyle,
} from '@core/ui/utilities/virtualized-list/helpers/VirtualizedListContentHelpers';
import type { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface VirtualizedListEmptyProps extends HTMLAttributes<HTMLDivElement> {
	readonly emptyMessage?: string;
	readonly containerSize: number | string;
	readonly orientation: 'vertical' | 'horizontal';
	readonly smoothScroll: boolean;
	readonly className?: string;
}

/**
 * Empty state component for virtualized list
 */
export function VirtualizedListEmpty({
	emptyMessage,
	containerSize,
	orientation,
	smoothScroll,
	className,
	...props
}: VirtualizedListEmptyProps) {
	const defaultEmptyMessage = emptyMessage ?? i18n.t('common.noDataAvailable', { ns: 'common' });
	const containerClasses = getContainerClasses(className);
	const containerStyle = getContainerStyle({ containerSize, orientation, smoothScroll });

	return (
		<div
			className={twMerge(containerClasses, 'flex items-center justify-center text-text-muted')}
			style={containerStyle}
			{...props}
		>
			{defaultEmptyMessage}
		</div>
	);
}
