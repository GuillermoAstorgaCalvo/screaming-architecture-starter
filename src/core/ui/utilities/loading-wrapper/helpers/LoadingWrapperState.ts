import { renderEmptyState } from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.empty';
import { renderErrorState } from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.error';
import { buildEmptyStateParams } from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.state.empty';
import { buildErrorStateParams } from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.state.error';
import {
	buildLoadingStateParams,
	renderLoadingState,
} from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.state.loading';
import {
	buildSuccessStateParams,
	renderSuccessState,
} from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.state.success';
import type {
	EmptyStateParams,
	ErrorStateParams,
	LoadingStateParams,
	LoadingWrapperStateParams,
} from '@core/ui/utilities/loading-wrapper/types/LoadingWrapperHelpers.state.types';

/** Render error state if error exists */
export function renderErrorStateIfPresent(params: LoadingWrapperStateParams) {
	const { error, errorComponent, onRetry, className, props } = params;
	if (error) {
		const errorParams: ErrorStateParams = {
			error,
			props,
			...(errorComponent !== undefined && { errorComponent }),
			...(onRetry !== undefined && { onRetry }),
			...(className !== undefined && { className }),
		};
		return renderErrorState(buildErrorStateParams(errorParams));
	}
	return null;
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
	if (isLoading) {
		const loadingParams: LoadingStateParams = {
			useSkeleton,
			props,
			...(loadingComponent !== undefined && { loadingComponent }),
			...(skeletonComponent !== undefined && { skeletonComponent }),
			...(loadingText !== undefined && { loadingText }),
			...(className !== undefined && { className }),
		};
		return renderLoadingState(buildLoadingStateParams(loadingParams));
	}
	return null;
}

/** Build empty state params from loading wrapper params */
function buildEmptyParamsFromWrapper(params: LoadingWrapperStateParams): EmptyStateParams {
	const {
		emptyMessage,
		emptyTitle,
		emptyDescription,
		emptyActionLabel,
		onEmptyAction,
		className,
		props,
	} = params;
	return {
		emptyTitle,
		props,
		...(emptyMessage !== undefined && { emptyMessage }),
		...(emptyDescription !== undefined && { emptyDescription }),
		...(emptyActionLabel !== undefined && { emptyActionLabel }),
		...(onEmptyAction !== undefined && { onEmptyAction }),
		...(className !== undefined && { className }),
	};
}

/** Render empty state if empty */
export function renderEmptyStateIfPresent(params: LoadingWrapperStateParams) {
	if (!params.isEmpty) return null;
	return renderEmptyState(buildEmptyStateParams(buildEmptyParamsFromWrapper(params)));
}

/** Determine and render the appropriate state based on props */
export function renderState(params: LoadingWrapperStateParams) {
	const errorState = renderErrorStateIfPresent(params);
	if (errorState) return errorState;

	const loadingState = renderLoadingStateIfPresent(params);
	if (loadingState) return loadingState;

	const emptyState = renderEmptyStateIfPresent(params);
	if (emptyState) return emptyState;

	return renderSuccessState(buildSuccessStateParams(params));
}
