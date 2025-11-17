import { useVirtualizer } from '@tanstack/react-virtual';
import { type RefObject, useMemo } from 'react';

const DEFAULT_OVERSCAN = 2;

interface UseVirtualizerParams<T> {
	readonly items: readonly T[];
	readonly itemSize: number | ((index: number) => number);
	readonly orientation: 'vertical' | 'horizontal';
	readonly overscan?: number;
	readonly getItemKey?: ((item: T, index: number) => string | number) | undefined;
	readonly parentRef: RefObject<HTMLDivElement | null>;
}

/**
 * Hook to create and configure the virtualizer instance.
 *
 * @remarks
 * When passing a function for `itemSize`, memoize it with `useCallback` to avoid
 * unnecessary virtualizer re-instantiation.
 */
export function useVirtualizerInstance<T>({
	items,
	itemSize,
	orientation,
	overscan = DEFAULT_OVERSCAN,
	getItemKey,
	parentRef,
}: UseVirtualizerParams<T>) {
	const getItemSize = useMemo(() => {
		if (typeof itemSize === 'function') {
			return itemSize;
		}
		return () => itemSize;
	}, [itemSize]);

	// eslint-disable-next-line react-hooks/incompatible-library -- TanStack Virtual's useVirtualizer is designed to work this way
	return useVirtualizer<HTMLDivElement, Element>({
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
}
