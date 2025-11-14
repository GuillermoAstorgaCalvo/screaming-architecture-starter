import type { InfiniteScrollProps } from '@src-types/ui/data/infinite-scroll';
import type { ReactNode } from 'react';

/**
 * Normalized props type after extraction with defaults
 */
export interface NormalizedInfiniteScrollProps {
	children: ReactNode;
	isLoading: boolean;
	hasMore: boolean;
	onLoadMore: () => void | Promise<void>;
	loadingComponent: ReactNode | undefined;
	loadingText: string | undefined;
	endMessage: ReactNode | undefined;
	errorMessage: ReactNode | undefined;
	hasError: boolean;
	onRetry: (() => void) | undefined;
	threshold: number;
	rootMargin: string;
	emptyComponent: ReactNode | undefined;
	showEmpty: boolean;
	className: string | undefined;
	restProps: Readonly<Record<string, unknown>>;
}

/**
 * Normalizes and extracts props with default values
 */
export function normalizeInfiniteScrollProps(
	props: Readonly<InfiniteScrollProps>
): NormalizedInfiniteScrollProps {
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
		rootMargin = 'var(--spacing-4xl)',
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
