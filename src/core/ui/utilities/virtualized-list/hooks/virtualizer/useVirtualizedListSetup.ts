import { useInitialScroll } from '@core/ui/utilities/virtualized-list/hooks/scroll/useInitialScroll';
import { useScrollHandler } from '@core/ui/utilities/virtualized-list/hooks/scroll/useScrollHandler';
import { useVirtualizerInstance } from '@core/ui/utilities/virtualized-list/hooks/virtualizer/useVirtualizerInstance';
import type { RefObject } from 'react';

interface UseVirtualizedListSetupParams<T> {
	readonly items: readonly T[];
	readonly itemSize: number | ((index: number) => number);
	readonly orientation: 'vertical' | 'horizontal';
	readonly overscan: number;
	readonly getItemKey?: ((item: T, index: number) => string | number) | undefined;
	readonly onScrollChange?: ((scrollOffset: number) => void) | undefined;
	readonly initialScrollOffset: number;
	readonly parentRef: RefObject<HTMLDivElement | null>;
}

/**
 * Hook to set up all virtualized list functionality
 */
export function useVirtualizedListSetup<T>({
	items,
	itemSize,
	orientation,
	overscan,
	getItemKey,
	onScrollChange,
	initialScrollOffset,
	parentRef,
}: UseVirtualizedListSetupParams<T>) {
	const virtualizer = useVirtualizerInstance({
		items,
		itemSize,
		orientation,
		overscan,
		getItemKey,
		parentRef,
	});

	useScrollHandler({ onScrollChange, orientation, parentRef });
	useInitialScroll({ initialScrollOffset, orientation, parentRef });

	return virtualizer;
}
