import { useVirtualizedListSetup } from '@core/ui/utilities/virtualized-list/hooks/virtualizer/useVirtualizedListSetup';
import type { RefObject } from 'react';

interface UseVirtualizedListConfigurationParams<T> {
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
 * Sets up the virtualizer with all necessary configuration
 */
export function useVirtualizedListConfiguration<T>({
	items,
	itemSize,
	orientation,
	overscan,
	getItemKey,
	onScrollChange,
	initialScrollOffset,
	parentRef,
}: UseVirtualizedListConfigurationParams<T>) {
	return useVirtualizedListSetup({
		items,
		itemSize,
		orientation,
		overscan,
		getItemKey,
		onScrollChange,
		initialScrollOffset,
		parentRef,
	});
}
