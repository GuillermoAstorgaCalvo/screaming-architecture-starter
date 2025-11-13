import {
	getInfiniteScrollClasses,
	getSentinelClasses,
} from '@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollHelpers';
import { renderInfiniteScroll } from '@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollRenderers';
import { useInfiniteScroll } from '@core/ui/utilities/infinite-scroll/hooks/useInfiniteScroll';
import type { InfiniteScrollProps } from '@src-types/ui/data/infinite-scroll';
import { useId } from 'react';

/**
 * Normalizes and extracts props with default values
 */
function normalizeInfiniteScrollProps(props: Readonly<InfiniteScrollProps>) {
	const {
		children,
		isLoading,
		hasMore,
		onLoadMore,
		loadingComponent,
		loadingText,
		endMessage,
		errorMessage,
		hasError = false,
		onRetry,
		threshold = 100,
		rootMargin = '100px',
		emptyComponent,
		showEmpty = false,
		className,
		...restProps
	} = props;

	return {
		children,
		isLoading,
		hasMore,
		onLoadMore,
		loadingComponent,
		loadingText,
		endMessage,
		errorMessage,
		hasError,
		onRetry,
		threshold,
		rootMargin,
		emptyComponent,
		showEmpty,
		className,
		restProps,
	};
}

/**
 * Prepares infinite scroll initialization values
 */
function useInfiniteScrollSetup({
	isLoading,
	hasMore,
	onLoadMore,
	threshold,
	rootMargin,
	hasError,
	className,
}: Readonly<{
	isLoading: boolean;
	hasMore: boolean;
	onLoadMore: () => void | Promise<void>;
	threshold: number;
	rootMargin: string;
	hasError: boolean;
	className: string | undefined;
}>) {
	const infiniteScrollId = useId();
	const { sentinelRef } = useInfiniteScroll({
		isLoading,
		hasMore,
		onLoadMore,
		threshold,
		rootMargin,
		enabled: !hasError,
	});
	const containerClasses = getInfiniteScrollClasses(className);
	const sentinelClasses = getSentinelClasses();

	return { infiniteScrollId, sentinelRef, containerClasses, sentinelClasses };
}

/**
 * Prepares render parameters for the infinite scroll component
 */
function prepareRenderParams(
	normalizedProps: ReturnType<typeof normalizeInfiniteScrollProps>,
	setupValues: ReturnType<typeof useInfiniteScrollSetup>
) {
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

/**
 * InfiniteScroll - Component for infinite scrolling with loading states.
 * Features: automatic loading on scroll, Intersection Observer, customizable loading/error states,
 * empty state support, end messages, accessibility, and dark mode.
 *
 * @example
 * ```tsx
 * <InfiniteScroll isLoading={isLoading} hasMore={hasMore} onLoadMore={loadMore}>
 *   {items.map(item => <Item key={item.id} {...item} />)}
 * </InfiniteScroll>
 * ```
 */
export default function InfiniteScroll(props: Readonly<InfiniteScrollProps>) {
	const normalizedProps = normalizeInfiniteScrollProps(props);

	const setupValues = useInfiniteScrollSetup({
		isLoading: normalizedProps.isLoading,
		hasMore: normalizedProps.hasMore,
		onLoadMore: normalizedProps.onLoadMore,
		threshold: normalizedProps.threshold,
		rootMargin: normalizedProps.rootMargin,
		hasError: normalizedProps.hasError,
		className: normalizedProps.className,
	});

	const renderParams = prepareRenderParams(normalizedProps, setupValues);

	return renderInfiniteScroll(renderParams);
}
