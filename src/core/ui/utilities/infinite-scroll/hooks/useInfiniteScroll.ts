import { useCallback, useEffect, useRef } from 'react';

export interface UseInfiniteScrollOptions {
	/** Whether more data is currently being loaded */
	isLoading: boolean;
	/** Whether there is more data to load */
	hasMore: boolean;
	/** Callback function to load more data */
	onLoadMore: () => void | Promise<void>;
	/** Threshold in pixels from bottom to trigger load more @default 100 */
	threshold?: number;
	/** Root margin for Intersection Observer (e.g., '100px') @default '100px' */
	rootMargin?: string;
	/** Whether to enable the infinite scroll @default true */
	enabled?: boolean;
}

/**
 * Cleans up an Intersection Observer
 */
function cleanupObserver(observerRef: { current: IntersectionObserver | null }) {
	if (observerRef.current) {
		observerRef.current.disconnect();
		observerRef.current = null;
	}
}

/**
 * Creates an Intersection Observer callback that triggers load more
 */
function createIntersectionCallback(
	isLoadingRef: { current: boolean },
	isLoading: boolean,
	handleLoadMore: () => Promise<void>
) {
	return (entries: IntersectionObserverEntry[]) => {
		const [entry] = entries;
		// Only trigger if sentinel is intersecting and not currently loading
		if (entry?.isIntersecting && !isLoadingRef.current && !isLoading) {
			handleLoadMore().catch(() => {
				// Error already handled in handleLoadMore
			});
		}
	};
}

/**
 * Creates and configures an Intersection Observer
 */
function createObserver(
	rootMargin: string,
	onIntersect: (entries: IntersectionObserverEntry[]) => void
) {
	return new IntersectionObserver(onIntersect, {
		root: null, // Use viewport as root
		rootMargin,
		threshold: 0, // Trigger as soon as any part is visible
	});
}

interface SetupObserverParams {
	enabled: boolean;
	hasMore: boolean;
	sentinelRef: { current: HTMLDivElement | null };
	observerRef: { current: IntersectionObserver | null };
	isLoadingRef: { current: boolean };
	isLoading: boolean;
	rootMargin: string;
	handleLoadMore: () => Promise<void>;
}

interface ExecuteLoadMoreParams {
	isLoadingRef: { current: boolean };
	hasMore: boolean;
	isLoading: boolean;
	onLoadMore: () => void | Promise<void>;
}

/**
 * Executes the load more logic
 */
async function executeLoadMore({
	isLoadingRef,
	hasMore,
	isLoading,
	onLoadMore,
}: ExecuteLoadMoreParams) {
	// Prevent multiple simultaneous loads
	if (isLoadingRef.current || !hasMore || isLoading) {
		return;
	}

	isLoadingRef.current = true;
	try {
		await onLoadMore();
	} finally {
		// Use setTimeout to allow state updates to propagate
		setTimeout(() => {
			isLoadingRef.current = false;
		}, 0);
	}
}

/**
 * Sets up the Intersection Observer effect
 */
function setupObserver({
	enabled,
	hasMore,
	sentinelRef,
	observerRef,
	isLoadingRef,
	isLoading,
	rootMargin,
	handleLoadMore,
}: SetupObserverParams) {
	// Don't set up observer if disabled or no more data
	if (!enabled || !hasMore) {
		cleanupObserver(observerRef);
		return;
	}

	const sentinel = sentinelRef.current;
	if (!sentinel) {
		return;
	}

	// Clean up previous observer
	cleanupObserver(observerRef);

	// Create new Intersection Observer
	const onIntersect = createIntersectionCallback(isLoadingRef, isLoading, handleLoadMore);
	observerRef.current = createObserver(rootMargin, onIntersect);
	observerRef.current.observe(sentinel);
}

/**
 * Hook to manage infinite scroll with Intersection Observer
 *
 * Automatically triggers onLoadMore when the sentinel element becomes visible.
 * Uses Intersection Observer API for efficient scroll detection.
 *
 * @example
 * ```tsx
 * const { sentinelRef } = useInfiniteScroll({
 *   isLoading: false,
 *   hasMore: true,
 *   onLoadMore: () => fetchMoreData(),
 * });
 *
 * return (
 *   <div>
 *     {items.map(item => <Item key={item.id} {...item} />)}
 *     <div ref={sentinelRef} />
 *   </div>
 * );
 * ```
 */
export function useInfiniteScroll({
	isLoading,
	hasMore,
	onLoadMore,
	threshold: _threshold = 100,
	rootMargin = '100px',
	enabled = true,
}: UseInfiniteScrollOptions) {
	const sentinelRef = useRef<HTMLDivElement>(null);
	const observerRef = useRef<IntersectionObserver | null>(null);
	const isLoadingRef = useRef(false);

	const handleLoadMore = useCallback(
		() =>
			executeLoadMore({
				isLoadingRef,
				hasMore,
				isLoading,
				onLoadMore,
			}),
		[hasMore, isLoading, onLoadMore]
	);

	useEffect(() => {
		setupObserver({
			enabled,
			hasMore,
			sentinelRef,
			observerRef,
			isLoadingRef,
			isLoading,
			rootMargin,
			handleLoadMore,
		});

		return () => {
			cleanupObserver(observerRef);
		};
	}, [enabled, hasMore, isLoading, rootMargin, handleLoadMore]);

	return {
		/** Ref to attach to the sentinel element (placed at the bottom of the list) */
		sentinelRef,
	};
}
