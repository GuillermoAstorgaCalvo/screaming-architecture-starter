import { renderErrorState } from './LoadingWrapperHelpers.error';
import type {
	ErrorStateParams,
	LoadingWrapperStateParams,
} from './LoadingWrapperHelpers.state.types';

/** Build props for error state rendering */
export function buildErrorStateParams({
	error,
	errorComponent,
	onRetry,
	className,
	props,
}: ErrorStateParams) {
	return {
		error,
		props,
		...(errorComponent !== undefined && { errorComponent }),
		...(onRetry !== undefined && { onRetry }),
		...(className !== undefined && { className }),
	};
}

/** Render error state if error exists */
export function renderErrorStateIfPresent(params: LoadingWrapperStateParams) {
	const { error, errorComponent, onRetry, className, props } = params;
	if (!error) return null;
	return renderErrorState(
		buildErrorStateParams({
			error,
			props,
			...(errorComponent !== undefined && { errorComponent }),
			...(onRetry !== undefined && { onRetry }),
			...(className !== undefined && { className }),
		})
	);
}
