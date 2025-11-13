import Text from '@core/ui/text/Text';
import {
	DefaultEndMessage,
	DefaultErrorComponent,
	DefaultLoadingComponent,
} from '@core/ui/utilities/infinite-scroll/components/InfiniteScrollComponents';
import type { ReactNode, RefObject } from 'react';

/**
 * Renders the empty state when no children are present
 */
export function renderEmptyState({
	infiniteScrollId,
	containerClasses,
	emptyComponent,
	props,
}: Readonly<{
	infiniteScrollId: string;
	containerClasses: string;
	emptyComponent: ReactNode | undefined;
	props: Readonly<Record<string, unknown>>;
}>) {
	return (
		<div id={infiniteScrollId} className={containerClasses} {...props}>
			{emptyComponent ?? (
				<div className="flex items-center justify-center py-8">
					<Text size="sm" className="text-gray-500 dark:text-gray-400">
						No items to display
					</Text>
				</div>
			)}
		</div>
	);
}

/**
 * Renders the loading component
 */
export function renderLoadingState(
	loadingComponent: ReactNode | undefined,
	loadingText: string | undefined
): ReactNode | null {
	if (!loadingComponent && loadingText === undefined) {
		return <DefaultLoadingComponent />;
	}
	if (loadingComponent) {
		return loadingComponent;
	}
	return <DefaultLoadingComponent {...(loadingText !== undefined && { loadingText })} />;
}

/**
 * Renders error state component
 */
export function renderErrorState(
	hasError: boolean,
	errorMessage: ReactNode | undefined,
	onRetry: (() => void) | undefined
) {
	if (!hasError) {
		return null;
	}
	return <DefaultErrorComponent errorMessage={errorMessage} onRetry={onRetry ?? undefined} />;
}

/**
 * Renders end message when no more items are available
 */
export function renderEndMessage({
	hasMore,
	isLoading,
	hasError,
	endMessage,
}: Readonly<{
	hasMore: boolean;
	isLoading: boolean;
	hasError: boolean;
	endMessage: ReactNode | undefined;
}>) {
	if (hasMore || isLoading || hasError) {
		return null;
	}
	return <DefaultEndMessage endMessage={endMessage} />;
}

/**
 * Renders sentinel element for Intersection Observer
 */
export function renderSentinel({
	hasMore,
	hasError,
	sentinelRef,
	sentinelClasses,
}: Readonly<{
	hasMore: boolean;
	hasError: boolean;
	sentinelRef: RefObject<HTMLDivElement | null>;
	sentinelClasses: string;
}>) {
	if (!hasMore || hasError) {
		return null;
	}
	return <div ref={sentinelRef} className={sentinelClasses} aria-hidden="true" />;
}
