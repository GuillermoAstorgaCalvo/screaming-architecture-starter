import type { NormalizedInfiniteScrollProps } from '@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollNormalizers';
import type { InfiniteScrollSetupValues } from '@core/ui/utilities/infinite-scroll/hooks/useInfiniteScrollSetup';
import type { InfiniteScrollProps } from '@core/ui/utilities/infinite-scroll/types/InfiniteScrollRenderers.types';

/**
 * Prepares render parameters for the infinite scroll component
 *
 * Combines normalized props and setup values into a single object
 * that matches the expected renderer props interface.
 */
export function prepareRenderParams(
	normalizedProps: NormalizedInfiniteScrollProps,
	setupValues: InfiniteScrollSetupValues
): InfiniteScrollProps {
	return {
		showEmpty: normalizedProps.showEmpty,
		children: normalizedProps.children,
		emptyComponent: normalizedProps.emptyComponent,
		infiniteScrollId: setupValues.infiniteScrollId,
		containerClasses: setupValues.containerClasses,
		restProps: normalizedProps.restProps,
		hasError: normalizedProps.hasError,
		errorMessage: normalizedProps.errorMessage,
		onRetry: normalizedProps.onRetry,
		isLoading: normalizedProps.isLoading,
		loadingComponent: normalizedProps.loadingComponent,
		loadingText: normalizedProps.loadingText,
		hasMore: normalizedProps.hasMore,
		endMessage: normalizedProps.endMessage,
		sentinelRef: setupValues.sentinelRef,
		sentinelClasses: setupValues.sentinelClasses,
	};
}
