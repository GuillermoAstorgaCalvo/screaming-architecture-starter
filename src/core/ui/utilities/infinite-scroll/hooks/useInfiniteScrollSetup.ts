import {
	getInfiniteScrollClasses,
	getSentinelClasses,
} from '@core/ui/utilities/infinite-scroll/helpers/InfiniteScrollHelpers';
import { useInfiniteScroll } from '@core/ui/utilities/infinite-scroll/hooks/useInfiniteScroll';
import { type RefObject, useId } from 'react';

/**
 * Setup values returned from useInfiniteScrollSetup
 */
export interface InfiniteScrollSetupValues {
	infiniteScrollId: string;
	sentinelRef: RefObject<HTMLDivElement | null>;
	containerClasses: string;
	sentinelClasses: string;
}

/**
 * Parameters for useInfiniteScrollSetup hook
 */
export type UseInfiniteScrollSetupParams = Readonly<{
	isLoading: boolean;
	hasMore: boolean;
	onLoadMore: () => void | Promise<void>;
	threshold: number;
	rootMargin: string;
	hasError: boolean;
	className: string | undefined;
}>;

/**
 * Prepares infinite scroll initialization values
 *
 * Sets up the infinite scroll hook, generates an ID, and prepares CSS classes
 * for the container and sentinel elements.
 */
export function useInfiniteScrollSetup(
	params: UseInfiniteScrollSetupParams
): InfiniteScrollSetupValues {
	const { isLoading, hasMore, onLoadMore, threshold, rootMargin, hasError, className } = params;

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
