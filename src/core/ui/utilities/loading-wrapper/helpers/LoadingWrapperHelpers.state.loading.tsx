import {
	renderSkeletonState,
	renderSpinnerState,
} from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.loading.render';
import type {
	LoadingStateParams,
	LoadingWrapperStateParams,
} from '@core/ui/utilities/loading-wrapper/types/LoadingWrapperHelpers.state.types';
import type { ReactNode } from 'react';

/** Build props for loading state rendering */
export function buildLoadingStateParams({
	loadingComponent,
	useSkeleton,
	skeletonComponent,
	loadingText,
	className,
	props,
}: LoadingStateParams) {
	return {
		useSkeleton,
		props,
		...(loadingComponent !== undefined && { loadingComponent }),
		...(skeletonComponent !== undefined && { skeletonComponent }),
		...(loadingText !== undefined && { loadingText }),
		...(className !== undefined && { className }),
	};
}

type LoadingStateProps = Readonly<{
	loadingComponent?: ReactNode;
	useSkeleton: boolean;
	skeletonComponent?: ReactNode;
	loadingText?: string;
	className?: string;
	props: Readonly<Record<string, unknown>>;
}>;

function buildSkeletonProps(
	props: Readonly<Record<string, unknown>>,
	skeletonComponent?: ReactNode,
	className?: string
) {
	return {
		...(skeletonComponent && { skeletonComponent }),
		...(className && { className }),
		props,
	};
}

function buildSpinnerProps(
	props: Readonly<Record<string, unknown>>,
	loadingText?: string,
	className?: string
) {
	return {
		...(loadingText && { loadingText }),
		...(className && { className }),
		props,
	};
}

/**
 * Render loading state
 */
export function renderLoadingState({
	loadingComponent,
	useSkeleton,
	skeletonComponent,
	loadingText,
	className,
	props,
}: LoadingStateProps) {
	if (loadingComponent) {
		return (
			<div className={className} {...props}>
				{loadingComponent}
			</div>
		);
	}

	if (useSkeleton) {
		return renderSkeletonState(buildSkeletonProps(props, skeletonComponent, className));
	}

	return renderSpinnerState(buildSpinnerProps(props, loadingText, className));
}

/** Render loading state if loading */
export function renderLoadingStateIfPresent(params: LoadingWrapperStateParams) {
	const {
		isLoading,
		loadingComponent,
		useSkeleton,
		skeletonComponent,
		loadingText,
		className,
		props,
	} = params;
	if (!isLoading) return null;
	return renderLoadingState(
		buildLoadingStateParams({
			useSkeleton,
			props,
			...(loadingComponent !== undefined && { loadingComponent }),
			...(skeletonComponent !== undefined && { skeletonComponent }),
			...(loadingText !== undefined && { loadingText }),
			...(className !== undefined && { className }),
		})
	);
}
