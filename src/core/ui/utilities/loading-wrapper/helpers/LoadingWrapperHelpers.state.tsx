// Import for orchestration
import { renderEmptyStateIfPresent } from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.state.empty';
import { renderErrorStateIfPresent } from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.state.error';
import { renderLoadingStateIfPresent } from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.state.loading';
import {
	buildSuccessStateParams,
	renderSuccessState,
} from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.state.success';
import type { LoadingWrapperStateParams } from '@core/ui/utilities/loading-wrapper/types/LoadingWrapperHelpers.state.types';

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
