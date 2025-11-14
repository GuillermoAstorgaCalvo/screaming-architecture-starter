import { normalizeInfiniteScrollProps } from '@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollNormalizers';
import { prepareRenderParams } from '@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollParams';
import { renderInfiniteScroll } from '@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollRenderers';
import { useInfiniteScrollSetup } from '@core/ui/utilities/infinite-scroll/hooks/useInfiniteScrollSetup';
import type { InfiniteScrollProps } from '@src-types/ui/data/infinite-scroll';

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
