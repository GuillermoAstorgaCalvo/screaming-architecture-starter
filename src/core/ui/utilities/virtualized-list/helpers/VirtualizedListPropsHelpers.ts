import type { VirtualizedListWrapperProps } from '@core/ui/utilities/virtualized-list/components/VirtualizedListWrapper';
import type { useVirtualizedListSetup } from '@core/ui/utilities/virtualized-list/hooks/virtualizer/useVirtualizedListSetup';
import type { VirtualizedListProps } from '@src-types/ui/layout/scroll';
import type { ReactNode, RefObject } from 'react';

/**
 * Normalizes the emptyMessage prop to a string or undefined
 * Only string values are passed through; other ReactNode values are ignored
 */
export function normalizeEmptyMessage(emptyMessage?: ReactNode): string | undefined {
	return typeof emptyMessage === 'string' ? emptyMessage : undefined;
}

/**
 * Extracts and normalizes props for the virtualized list
 */
export function extractVirtualizedListProps<T>(props: Readonly<VirtualizedListProps<T>>) {
	const {
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
		...restProps
	} = props;

	const normalizedEmptyMessage = normalizeEmptyMessage(emptyMessage);

	return {
		items,
		renderItem,
		itemSize,
		orientation,
		containerSize,
		overscan,
		getItemKey,
		onScrollChange,
		initialScrollOffset,
		smoothScroll,
		emptyMessage: normalizedEmptyMessage,
		className,
		restProps,
	};
}

/**
 * Prepares props to be passed to VirtualizedListWrapper
 */
export function prepareWrapperProps<T>({
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
	...restProps
}: {
	readonly items: readonly T[];
	readonly renderItem: (item: T, index: number) => ReactNode;
	readonly virtualizer: ReturnType<typeof useVirtualizedListSetup>;
	readonly getItemKey?: ((item: T, index: number) => string | number) | undefined;
	readonly orientation: 'vertical' | 'horizontal';
	readonly containerSize: string | number;
	readonly smoothScroll: boolean;
	readonly emptyMessage?: string | undefined;
	readonly className?: string | undefined;
	readonly parentRef: RefObject<HTMLDivElement | null>;
} & Record<string, unknown>): VirtualizedListWrapperProps<T> & Record<string, unknown> {
	const baseProps: VirtualizedListWrapperProps<T> = {
		items,
		renderItem,
		virtualizer,
		getItemKey,
		orientation,
		containerSize,
		smoothScroll,
		parentRef: parentRef as RefObject<HTMLDivElement>,
		...(emptyMessage !== undefined && { emptyMessage }),
		...(className !== undefined && { className }),
	};

	return { ...baseProps, ...restProps };
}
