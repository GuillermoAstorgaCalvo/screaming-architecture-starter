import type { HTMLAttributes, ReactNode } from 'react';

/**
 * InfiniteScroll component props
 */
export interface InfiniteScrollProps extends HTMLAttributes<HTMLDivElement> {
	/** Whether more data is currently being loaded */
	isLoading: boolean;
	/** Whether there is more data to load */
	hasMore: boolean;
	/** Callback function to load more data */
	onLoadMore: () => void | Promise<void>;
	/** Optional custom loading component (replaces default Spinner) */
	loadingComponent?: ReactNode;
	/** Optional custom loading text */
	loadingText?: string;
	/** Optional custom end message when no more data is available */
	endMessage?: ReactNode;
	/** Optional custom error message */
	errorMessage?: ReactNode;
	/** Whether an error occurred */
	hasError?: boolean;
	/** Callback to retry loading after an error */
	onRetry?: () => void;
	/** Threshold in pixels from bottom to trigger load more @default 100 */
	threshold?: number;
	/** Root margin for Intersection Observer (e.g., '100px') @default '100px' */
	rootMargin?: string;
	/** Optional custom empty state component */
	emptyComponent?: ReactNode;
	/** Whether to show empty state (when no items and not loading) */
	showEmpty?: boolean;
	/** Children to render (the scrollable content) */
	children: ReactNode;
}
