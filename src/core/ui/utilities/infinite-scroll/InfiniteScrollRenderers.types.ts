import type { ReactNode, RefObject } from 'react';

export type InfiniteScrollContainerProps = Readonly<{
	infiniteScrollId: string;
	containerClasses: string;
	props: Readonly<Record<string, unknown>>;
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

export type InfiniteScrollProps = Readonly<{
	showEmpty: boolean;
	children: ReactNode;
	emptyComponent: ReactNode | undefined;
	infiniteScrollId: string;
	containerClasses: string;
	restProps: Readonly<Record<string, unknown>>;
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
