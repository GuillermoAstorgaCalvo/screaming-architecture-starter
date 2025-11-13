import type { ReactNode } from 'react';

// Types and helpers for state management
export type ErrorStateParams = Readonly<{
	error: Error | string | ReactNode;
	errorComponent?: ReactNode;
	onRetry?: (() => void) | undefined;
	className?: string;
	props: Readonly<Record<string, unknown>>;
}>;

export type LoadingStateParams = Readonly<{
	loadingComponent?: ReactNode;
	useSkeleton: boolean;
	skeletonComponent?: ReactNode;
	loadingText?: string;
	className?: string;
	props: Readonly<Record<string, unknown>>;
}>;

export type EmptyStateParams = Readonly<{
	emptyMessage?: string | ReactNode;
	emptyTitle: string;
	emptyDescription?: string;
	emptyActionLabel?: string;
	onEmptyAction?: (() => void) | undefined;
	className?: string;
	props: Readonly<Record<string, unknown>>;
}>;

export type SuccessStateParams = Readonly<{
	children?: ReactNode;
	className?: string;
	props: Readonly<Record<string, unknown>>;
}>;

export type LoadingWrapperStateParams = Readonly<{
	isLoading: boolean;
	error: Error | string | ReactNode | null;
	isEmpty: boolean;
	onRetry?: (() => void) | undefined;
	emptyMessage?: string | ReactNode;
	loadingComponent?: ReactNode;
	useSkeleton: boolean;
	skeletonComponent?: ReactNode;
	errorComponent?: ReactNode;
	loadingText?: string;
	emptyTitle: string;
	emptyDescription?: string;
	emptyActionLabel?: string;
	onEmptyAction?: (() => void) | undefined;
	children?: ReactNode;
	className?: string;
	props: Readonly<Record<string, unknown>>;
}>;
