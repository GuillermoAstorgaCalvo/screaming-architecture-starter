import type { ReactNode } from 'react';

import { renderSkeletonState, renderSpinnerState } from './LoadingWrapperHelpers.loading.render';
import type {
	LoadingStateParams,
	LoadingWrapperStateParams,
} from './LoadingWrapperHelpers.state.types';

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
		return renderSkeletonState({
			...(skeletonComponent && { skeletonComponent }),
			...(className && { className }),
			props,
		});
	}

	return renderSpinnerState({
		...(loadingText && { loadingText }),
		...(className && { className }),
		props,
	});
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
