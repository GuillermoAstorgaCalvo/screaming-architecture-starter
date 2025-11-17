import i18n from '@core/i18n/i18n';
import { VirtualizedListContent } from '@core/ui/utilities/virtualized-list/components/VirtualizedListContent';
import {
	getContainerClasses,
	getContainerStyle,
} from '@core/ui/utilities/virtualized-list/helpers/VirtualizedListContentHelpers';
import type { useVirtualizer } from '@tanstack/react-virtual';
import type { HTMLAttributes, ReactNode, RefObject } from 'react';

interface VirtualizedListContainerProps<T> extends HTMLAttributes<HTMLDivElement> {
	readonly items: readonly T[];
	readonly renderItem: (item: T, index: number) => ReactNode;
	readonly virtualizer: ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>;
	readonly getItemKey?: ((item: T, index: number) => string | number) | undefined;
	readonly orientation: 'vertical' | 'horizontal';
	readonly containerSize: number | string;
	readonly smoothScroll: boolean;
	readonly className?: string;
	readonly parentRef: RefObject<HTMLDivElement>;
}

/**
 * Container component for virtualized list with items
 */
export function VirtualizedListContainer<T>({
	items,
	renderItem,
	virtualizer,
	getItemKey,
	orientation,
	containerSize,
	smoothScroll,
	className,
	parentRef,
	...props
}: VirtualizedListContainerProps<T>) {
	const totalSize = virtualizer.getTotalSize();
	const containerStyle = getContainerStyle({ containerSize, orientation, smoothScroll });
	const containerClasses = getContainerClasses(className);

	return (
		<div
			ref={parentRef}
			className={containerClasses}
			style={containerStyle}
			aria-label={i18n.t('a11y.virtualizedList', { ns: 'common' })}
			{...props}
		>
			<VirtualizedListContent
				items={items}
				virtualItems={virtualizer.getVirtualItems()}
				virtualizer={virtualizer}
				renderItem={renderItem}
				getItemKey={getItemKey}
				orientation={orientation}
				totalSize={totalSize}
			/>
		</div>
	);
}
