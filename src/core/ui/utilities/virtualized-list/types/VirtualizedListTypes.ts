import type { ReactNode, RefObject } from 'react';

export interface UseVirtualizedListSetupAndPropsParams<T> {
	readonly items: readonly T[];
	readonly renderItem: (item: T, index: number) => ReactNode;
	readonly itemSize: number | ((index: number) => number);
	readonly orientation: 'vertical' | 'horizontal';
	readonly containerSize: string | number;
	readonly overscan: number;
	readonly getItemKey?: ((item: T, index: number) => string | number) | undefined;
	readonly onScrollChange?: ((scrollOffset: number) => void) | undefined;
	readonly initialScrollOffset: number;
	readonly smoothScroll: boolean;
	readonly emptyMessage?: string | undefined;
	readonly className?: string | undefined;
	readonly parentRef: RefObject<HTMLDivElement | null>;
	readonly restProps: Record<string, unknown>;
}
