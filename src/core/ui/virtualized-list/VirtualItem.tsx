import type { useVirtualizer } from '@tanstack/react-virtual';
import type { ReactNode } from 'react';

interface VirtualItemProps<T> {
	readonly item: T;
	readonly index: number;
	readonly virtualItem: { index: number; start: number };
	readonly virtualizer: ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>;
	readonly renderItem: (item: T, index: number) => ReactNode;
	readonly getItemKey?: ((item: T, index: number) => string | number) | undefined;
	readonly orientation: 'vertical' | 'horizontal';
}

/**
 * Individual virtualized item component
 *
 * Renders a single item in the virtualized list with proper positioning
 * based on the virtualizer's calculated start position.
 */
export function VirtualItem<T>({
	item,
	index,
	virtualItem,
	virtualizer,
	renderItem,
	getItemKey,
	orientation,
}: VirtualItemProps<T>) {
	const itemKey = getItemKey ? getItemKey(item, index) : index;
	const itemContent = renderItem(item, index);

	const itemStyle = {
		position: 'absolute' as const,
		top: orientation === 'vertical' ? 0 : undefined,
		left: orientation === 'horizontal' ? 0 : undefined,
		width: orientation === 'vertical' ? '100%' : undefined,
		height: orientation === 'horizontal' ? '100%' : undefined,
		transform:
			orientation === 'vertical'
				? `translateY(${virtualItem.start}px)`
				: `translateX(${virtualItem.start}px)`,
	};

	return (
		// eslint-disable-next-line react-hooks/refs -- measureElement is a ref callback function from TanStack Virtual, safe to use in render
		<li key={itemKey} data-index={index} ref={virtualizer.measureElement} style={itemStyle}>
			{itemContent}
		</li>
	);
}
