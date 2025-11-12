import { renderEmptyState } from './LoadingWrapperHelpers.empty';
import type {
	EmptyStateParams,
	LoadingWrapperStateParams,
} from './LoadingWrapperHelpers.state.types';

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

/** Render empty state if empty */
export function renderEmptyStateIfPresent(params: LoadingWrapperStateParams) {
	const {
		isEmpty,
		emptyMessage,
		emptyTitle,
		emptyDescription,
		emptyActionLabel,
		onEmptyAction,
		className,
		props,
	} = params;
	if (!isEmpty) return null;
	return renderEmptyState(
		buildEmptyStateParams({
			emptyTitle,
			props,
			...(emptyMessage !== undefined && { emptyMessage }),
			...(emptyDescription !== undefined && { emptyDescription }),
			...(emptyActionLabel !== undefined && { emptyActionLabel }),
			...(onEmptyAction !== undefined && { onEmptyAction }),
			...(className !== undefined && { className }),
		})
	);
}
