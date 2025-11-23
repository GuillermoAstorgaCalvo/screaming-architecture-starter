import type { useVirtualizer } from '@tanstack/react-virtual';
import type { ReactNode } from 'react';

export interface VirtualizedListContentProps<T> {
	readonly items: readonly T[];
	readonly virtualItems: ReturnType<
		ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>['getVirtualItems']
	>;
	readonly virtualizer: ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>;
	readonly renderItem: (item: T, index: number) => ReactNode;
	readonly getItemKey?: ((item: T, index: number) => string | number) | undefined;
	readonly orientation: 'vertical' | 'horizontal';
	readonly totalSize: number;
	/**
	 * Optional test ID for the list element.
	 * Used for testing implementation details (styles) that can't be accessed semantically.
	 */
	readonly 'data-testid'?: string | undefined;
}
