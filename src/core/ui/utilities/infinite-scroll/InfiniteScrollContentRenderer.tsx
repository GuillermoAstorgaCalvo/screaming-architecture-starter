import type { ReactNode, RefObject } from 'react';

import {
	renderEndMessage,
	renderErrorState,
	renderLoadingState,
	renderSentinel,
} from './InfiniteScrollStateRenderers';

/**
 * Props for rendering infinite scroll content
 */
export type InfiniteScrollContentProps = Readonly<{
	children: ReactNode;
	hasError: boolean;
	errorMessage: ReactNode | undefined;
	onRetry: (() => void) | undefined;
	isLoading: boolean;
	loadingComponent: ReactNode | undefined;
	loadingText: string | undefined;
	hasMore: boolean;
	endMessage: ReactNode | undefined;
	sentinelRef: RefObject<HTMLDivElement | null>;
	sentinelClasses: string;
}>;

/**
 * Renders the main content area with states (error, loading, end message, sentinel)
 */
export function renderInfiniteScrollContent({
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
}: InfiniteScrollContentProps) {
	return (
		<>
			{children}
			{renderErrorState(hasError, errorMessage, onRetry)}
			{isLoading && !hasError ? renderLoadingState(loadingComponent, loadingText) : null}
			{renderEndMessage({ hasMore, isLoading, hasError, endMessage })}
			{renderSentinel({ hasMore, hasError, sentinelRef, sentinelClasses })}
		</>
	);
}
