import type { HTMLAttributes, ReactNode } from 'react';

import { renderState } from './LoadingWrapperHelpers.state';
import { buildStateParams } from './LoadingWrapperHelpers.state.build';

export interface LoadingWrapperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Whether the content is currently loading */
	isLoading?: boolean;
	/** Error object or error message to display */
	error?: Error | string | ReactNode | null;
	/** Callback function to retry loading (shows retry button if provided) */
	onRetry?: (() => void) | undefined;
	/** Whether the content is empty (no data) */
	isEmpty?: boolean;
	/** Custom empty state message or component */
	emptyMessage?: string | ReactNode;
	/** Custom loading component (overrides default spinner/skeleton) */
	loadingComponent?: ReactNode;
	/** Whether to show skeleton instead of spinner for loading state */
	useSkeleton?: boolean;
	/** Custom skeleton component */
	skeletonComponent?: ReactNode;
	/** Custom error message or component (overrides default error display) */
	errorComponent?: ReactNode;
	/** Loading text to display alongside spinner */
	loadingText?: string;
	/** Empty state title (used when emptyMessage is a string) */
	emptyTitle?: string;
	/** Empty state description (used when emptyMessage is a string) */
	emptyDescription?: string;
	/** Empty state action label */
	emptyActionLabel?: string;
	/** Empty state action handler */
	onEmptyAction?: (() => void) | undefined;
	/** Content to display when not loading, no error, and not empty */
	children?: ReactNode;
}

/**
 * LoadingWrapper - Unified component for handling loading, error, empty, and success states
 *
 * Features:
 * - Loading state: shows spinner or skeleton
 * - Error state: shows error message with optional retry button
 * - Empty state: shows empty message or EmptyState component
 * - Success state: shows children content
 * - Accessible: proper ARIA labels and roles
 * - Customizable: supports custom components for each state
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <LoadingWrapper isLoading={loading} error={error} onRetry={retry}>
 *   <div>Content here</div>
 * </LoadingWrapper>
 * ```
 *
 * @example
 * ```tsx
 * <LoadingWrapper
 *   isLoading={loading}
 *   error={error}
 *   onRetry={retry}
 *   isEmpty={data.length === 0}
 *   emptyMessage="No items found"
 * >
 *   {data.map(item => <Item key={item.id} {...item} />)}
 * </LoadingWrapper>
 * ```
 *
 * @example
 * ```tsx
 * <LoadingWrapper
 *   isLoading={loading}
 *   useSkeleton
 *   skeletonComponent={<Skeleton variant="rectangular" className="w-full h-32" />}
 * >
 *   <Content />
 * </LoadingWrapper>
 * ```
 */
export default function LoadingWrapper(props: Readonly<LoadingWrapperProps>) {
	return renderState(buildStateParams(props));
}
