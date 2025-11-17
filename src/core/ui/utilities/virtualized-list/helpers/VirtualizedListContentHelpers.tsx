import { VirtualItem } from '@core/ui/utilities/virtualized-list/components/VirtualItem';
import type { useVirtualizer } from '@tanstack/react-virtual';
import type { CSSProperties, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface GetVirtualItemsStyleParams {
	readonly orientation: 'vertical' | 'horizontal';
	readonly totalSize: number;
}

/**
 * Get styles for the virtualized items container
 */
export function getVirtualItemsStyle({
	orientation,
	totalSize,
}: GetVirtualItemsStyleParams): CSSProperties {
	if (orientation === 'vertical') {
		return {
			height: `${totalSize}px`,
			width: '100%',
			position: 'relative',
		};
	}
	return {
		width: `${totalSize}px`,
		height: '100%',
		position: 'relative',
	};
}

interface RenderVirtualItemParams<T> {
	readonly item: T;
	readonly index: number;
	readonly virtualItem: { index: number; start: number };
	readonly virtualizer: ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>;
	readonly renderItem: (item: T, index: number) => ReactNode;
	readonly getItemKey?: ((item: T, index: number) => string | number) | undefined;
	readonly orientation: 'vertical' | 'horizontal';
}

/**
 * Render a single virtual item
 */
export function renderVirtualItem<T>({
	item,
	index,
	virtualItem,
	virtualizer,
	renderItem,
	getItemKey,
	orientation,
}: RenderVirtualItemParams<T>): ReactNode {
	return (
		<VirtualItem
			key={virtualItem.index}
			item={item}
			index={index}
			virtualItem={virtualItem}
			virtualizer={virtualizer}
			renderItem={renderItem}
			getItemKey={getItemKey}
			orientation={orientation}
		/>
	);
}

interface MapVirtualItemsParams<T> {
	readonly items: readonly T[];
	readonly virtualItems: ReturnType<
		ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>['getVirtualItems']
	>;
	readonly virtualizer: ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>;
	readonly renderItem: (item: T, index: number) => ReactNode;
	readonly getItemKey?: ((item: T, index: number) => string | number) | undefined;
	readonly orientation: 'vertical' | 'horizontal';
}

/**
 * Map virtual items to rendered components
 */
export function mapVirtualItems<T>({
	items,
	virtualItems,
	virtualizer,
	renderItem,
	getItemKey,
	orientation,
}: MapVirtualItemsParams<T>): ReactNode[] {
	return virtualItems.map(virtualItem => {
		const item = items[virtualItem.index];
		if (!item) {
			return null;
		}

		return renderVirtualItem({
			item,
			index: virtualItem.index,
			virtualItem,
			virtualizer,
			renderItem,
			getItemKey,
			orientation,
		});
	});
}

interface GetContainerStyleParams {
	readonly containerSize: number | string;
	readonly orientation: 'vertical' | 'horizontal';
	readonly smoothScroll: boolean;
}

/**
 * Get container styles for the virtualized list
 */
export function getContainerStyle({
	containerSize,
	orientation,
	smoothScroll,
}: GetContainerStyleParams): CSSProperties {
	const size = typeof containerSize === 'number' ? `${containerSize}px` : containerSize;
	return {
		[orientation === 'vertical' ? 'height' : 'width']: size,
		scrollBehavior: smoothScroll ? ('smooth' as const) : ('auto' as const),
	};
}

/**
 * Get container classes for the virtualized list
 */
export function getContainerClasses(className?: string): string {
	return twMerge('overflow-auto', className);
}
