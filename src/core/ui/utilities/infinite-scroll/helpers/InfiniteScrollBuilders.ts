import type {
	InfiniteScrollContainerProps,
	InfiniteScrollProps,
} from '@core/ui/utilities/infinite-scroll/types/InfiniteScrollRenderers.types';

/**
 * Builds the props object for the container element
 */
export function buildContainerElementProps({
	infiniteScrollId,
	containerClasses,
	props,
}: Readonly<{
	infiniteScrollId: string;
	containerClasses: string;
	props: Readonly<Record<string, unknown>>;
}>) {
	return {
		id: infiniteScrollId,
		className: containerClasses,
		...props,
	};
}

/**
 * Builds the props object for rendering infinite scroll content
 */
export function buildContentProps({
	children,
	hasError,
	errorMessage,
	onRetry,
	isLoading,
	loadingComponent,
	loadingText,
	hasMore,
	endMessage,
	sentinelRef,
	sentinelClasses,
}: InfiniteScrollContainerProps) {
	return {
		children,
		hasError,
		errorMessage,
		onRetry,
		isLoading,
		loadingComponent,
		loadingText,
		hasMore,
		endMessage,
		sentinelRef,
		sentinelClasses,
	};
}

/**
 * Builds props for rendering the empty state
 */
export function buildEmptyStateProps({
	infiniteScrollId,
	containerClasses,
	emptyComponent,
	restProps,
}: InfiniteScrollProps) {
	return {
		infiniteScrollId,
		containerClasses,
		emptyComponent,
		props: restProps,
	};
}

/**
 * Builds props for rendering the infinite scroll container
 */
export function buildContainerRenderProps(
	params: InfiniteScrollProps
): InfiniteScrollContainerProps {
	return {
		infiniteScrollId: params.infiniteScrollId,
		containerClasses: params.containerClasses,
		props: params.restProps,
		children: params.children,
		hasError: params.hasError,
		errorMessage: params.errorMessage,
		onRetry: params.onRetry,
		isLoading: params.isLoading,
		loadingComponent: params.loadingComponent,
		loadingText: params.loadingText,
		hasMore: params.hasMore,
		endMessage: params.endMessage,
		sentinelRef: params.sentinelRef,
		sentinelClasses: params.sentinelClasses,
	};
}
