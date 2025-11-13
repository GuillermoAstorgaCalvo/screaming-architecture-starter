import { renderEmptyState } from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.empty';
import type {
	EmptyStateParams,
	LoadingWrapperStateParams,
} from '@core/ui/utilities/loading-wrapper/types/LoadingWrapperHelpers.state.types';

/** Build props for empty state rendering */
export function buildEmptyStateParams({
	emptyMessage,
	emptyTitle,
	emptyDescription,
	emptyActionLabel,
	onEmptyAction,
	className,
	props,
}: EmptyStateParams) {
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

/** Extract empty state params from loading wrapper params */
function extractEmptyStateParams(params: LoadingWrapperStateParams): EmptyStateParams {
	return {
		emptyTitle: params.emptyTitle,
		props: params.props,
		...(params.emptyMessage !== undefined && { emptyMessage: params.emptyMessage }),
		...(params.emptyDescription !== undefined && { emptyDescription: params.emptyDescription }),
		...(params.emptyActionLabel !== undefined && { emptyActionLabel: params.emptyActionLabel }),
		...(params.onEmptyAction !== undefined && { onEmptyAction: params.onEmptyAction }),
		...(params.className !== undefined && { className: params.className }),
	};
}

/** Render empty state if empty */
export function renderEmptyStateIfPresent(params: LoadingWrapperStateParams) {
	if (!params.isEmpty) return null;
	return renderEmptyState(buildEmptyStateParams(extractEmptyStateParams(params)));
}
