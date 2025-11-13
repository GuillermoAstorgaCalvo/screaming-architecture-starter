import { VirtualizedListContent } from '@core/ui/utilities/virtualized-list/components/VirtualizedListContent';
import {
	useInitialScroll,
	useScrollHandler,
} from '@core/ui/utilities/virtualized-list/hooks/VirtualizedListHooks';
import type { VirtualizedListProps } from '@src-types/ui/layout/scroll';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMemo, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * VirtualizedList - Efficiently renders large lists using virtualization
 *
 * Features:
 * - Vertical and horizontal scrolling support
 * - Fixed or dynamic item sizes
 * - Overscan for smooth scrolling
 * - Customizable container size
 * - Accessible with proper ARIA attributes
 * - Empty state support
 * - Smooth scrolling option
 *
 * @example
 * ```tsx
 * <VirtualizedList
 *   items={largeArray}
 *   renderItem={(item, index) => <div key={index}>{item.name}</div>}
 *   itemSize={50}
 *   containerSize={400}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <VirtualizedList
 *   items={items}
 *   renderItem={(item) => <ListItem>{item.title}</ListItem>}
 *   itemSize={(index) => index % 2 === 0 ? 60 : 80}
 *   orientation="vertical"
 *   overscan={2}
 * />
 * ```
 */
// eslint-disable-next-line max-lines-per-function -- Complex virtualization component requires more lines
export default function VirtualizedList<T = unknown>({
	items,
	renderItem,
	itemSize,
	orientation = 'vertical',
	containerSize = 400,
	overscan = 1,
	getItemKey,
	onScrollChange,
	initialScrollOffset = 0,
	smoothScroll = false,
	emptyMessage,
	className,
	...props
}: Readonly<VirtualizedListProps<T>>) {
	const parentRef = useRef<HTMLDivElement>(null);

	// Normalize itemSize to a function
	const getItemSize = useMemo(() => {
		if (typeof itemSize === 'function') {
			return itemSize;
		}
		return () => itemSize;
	}, [itemSize]);

	// Create virtualizer instance
	// eslint-disable-next-line react-hooks/incompatible-library -- TanStack Virtual's useVirtualizer is designed to work this way
	const virtualizer = useVirtualizer<HTMLDivElement, Element>({
		count: items.length,
		getScrollElement: () => parentRef.current,
		estimateSize: getItemSize,
		overscan,
		horizontal: orientation === 'horizontal',
		...(getItemKey && {
			getItemKey: index => {
				const item = items[index];
				return item ? getItemKey(item, index) : index;
			},
		}),
	});

	// Handle scroll events
	useScrollHandler({ onScrollChange, orientation, parentRef });

	// Set initial scroll offset
	useInitialScroll({ initialScrollOffset, orientation, parentRef });

	// Calculate total size
	const totalSize = useMemo(() => {
		return virtualizer.getTotalSize();
	}, [virtualizer]);

	// Container styles
	const containerStyle = useMemo(() => {
		const size = typeof containerSize === 'number' ? `${containerSize}px` : containerSize;
		return {
			[orientation === 'vertical' ? 'height' : 'width']: size,
			scrollBehavior: smoothScroll ? ('smooth' as const) : ('auto' as const),
		};
	}, [containerSize, orientation, smoothScroll]);

	// Base classes
	const baseClasses = 'overflow-auto';
	const containerClasses = twMerge(baseClasses, className);

	// Empty state
	if (items.length === 0) {
		return (
			<div
				className={twMerge(
					containerClasses,
					'flex items-center justify-center text-gray-500 dark:text-gray-400'
				)}
				style={containerStyle}
				{...props}
			>
				{emptyMessage ?? <span>No items to display</span>}
			</div>
		);
	}

	// Render virtualized items
	const virtualItems = virtualizer.getVirtualItems();

	return (
		<div
			ref={parentRef}
			className={containerClasses}
			style={containerStyle}
			aria-label="Virtualized list"
			{...props}
		>
			<VirtualizedListContent
				items={items}
				virtualItems={virtualItems}
				virtualizer={virtualizer}
				renderItem={renderItem}
				getItemKey={getItemKey}
				orientation={orientation}
				totalSize={totalSize}
			/>
		</div>
	);
}
