import { prepareWrapperProps } from '@core/ui/utilities/virtualized-list/helpers/VirtualizedListPropsHelpers';
import { useVirtualizedListConfiguration } from '@core/ui/utilities/virtualized-list/hooks/configuration/useVirtualizedListConfiguration';
import type { useVirtualizedListSetup } from '@core/ui/utilities/virtualized-list/hooks/virtualizer/useVirtualizedListSetup';
import type { UseVirtualizedListSetupAndPropsParams } from '@core/ui/utilities/virtualized-list/types/VirtualizedListTypes';

/**
 * Prepares wrapper props from virtualizer and params
 */
function prepareWrapperPropsFromVirtualizer<T>(
	virtualizer: ReturnType<typeof useVirtualizedListSetup>,
	params: UseVirtualizedListSetupAndPropsParams<T>
) {
	const {
		items,
		renderItem,
		orientation,
		containerSize,
		getItemKey,
		smoothScroll,
		emptyMessage,
		className,
		parentRef,
		restProps,
	} = params;

	return prepareWrapperProps({
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
		...restProps,
	});
}

/**
 * Sets up the virtualizer and prepares wrapper props
 */
export function useVirtualizedListSetupAndProps<T>(
	params: UseVirtualizedListSetupAndPropsParams<T>
) {
	const {
		items,
		itemSize,
		orientation,
		overscan,
		getItemKey,
		onScrollChange,
		initialScrollOffset,
		parentRef,
	} = params;

	const virtualizer = useVirtualizedListConfiguration({
		items,
		itemSize,
		orientation,
		overscan,
		getItemKey,
		onScrollChange,
		initialScrollOffset,
		parentRef,
	});

	return prepareWrapperPropsFromVirtualizer(virtualizer, params);
}
