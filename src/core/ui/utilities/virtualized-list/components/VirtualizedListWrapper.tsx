import { VirtualizedListContainer } from '@core/ui/utilities/virtualized-list/components/VirtualizedListContainer';
import { VirtualizedListEmpty } from '@core/ui/utilities/virtualized-list/components/VirtualizedListEmpty';
import type { useVirtualizer } from '@tanstack/react-virtual';
import type { HTMLAttributes, ReactNode, RefObject } from 'react';

export interface VirtualizedListWrapperProps<T> extends HTMLAttributes<HTMLDivElement> {
	readonly items: readonly T[];
	readonly renderItem: (item: T, index: number) => ReactNode;
	readonly virtualizer: ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>;
	readonly getItemKey?: ((item: T, index: number) => string | number) | undefined;
	readonly orientation: 'vertical' | 'horizontal';
	readonly containerSize: number | string;
	readonly smoothScroll: boolean;
	readonly emptyMessage?: string;
	readonly className?: string;
	readonly parentRef: RefObject<HTMLDivElement>;
}

/**
 * Wrapper component that handles both empty and populated states
 */
export function VirtualizedListWrapper<T>({
	items,
	renderItem,
	virtualizer,
	getItemKey,
	orientation,
	containerSize,
	smoothScroll,
	emptyMessage,
	className,
	parentRef,
	...props
}: VirtualizedListWrapperProps<T>) {
	if (items.length === 0) {
		return (
			<VirtualizedListEmpty
				{...(emptyMessage !== undefined && { emptyMessage })}
				containerSize={containerSize}
				orientation={orientation}
				smoothScroll={smoothScroll}
				{...(className !== undefined && { className })}
				{...props}
			/>
		);
	}

	return (
		<VirtualizedListContainer
			items={items}
			renderItem={renderItem}
			virtualizer={virtualizer}
			getItemKey={getItemKey}
			orientation={orientation}
			containerSize={containerSize}
			smoothScroll={smoothScroll}
			{...(className !== undefined && { className })}
			parentRef={parentRef}
			{...props}
		/>
	);
}
