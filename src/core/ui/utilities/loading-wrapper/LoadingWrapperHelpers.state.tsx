// Import for orchestration
import { renderEmptyStateIfPresent } from './LoadingWrapperHelpers.state.empty';
import { renderErrorStateIfPresent } from './LoadingWrapperHelpers.state.error';
import { renderLoadingStateIfPresent } from './LoadingWrapperHelpers.state.loading';
import { buildSuccessStateParams, renderSuccessState } from './LoadingWrapperHelpers.state.success';
import type { LoadingWrapperStateParams } from './LoadingWrapperHelpers.state.types';

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
