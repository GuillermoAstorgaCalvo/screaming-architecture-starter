import type { ReactNode } from 'react';

import { renderEmptyState } from './LoadingWrapperHelpers.empty';
import { renderErrorState } from './LoadingWrapperHelpers.error';
import { buildEmptyStateParams } from './LoadingWrapperHelpers.state.empty';
import { buildErrorStateParams } from './LoadingWrapperHelpers.state.error';
import { buildLoadingStateParams, renderLoadingState } from './LoadingWrapperHelpers.state.loading';
import { buildSuccessStateParams, renderSuccessState } from './LoadingWrapperHelpers.state.success';
import type {
	EmptyStateParams,
	ErrorStateParams,
	LoadingStateParams,
	LoadingWrapperStateParams,
} from './LoadingWrapperHelpers.state.types';

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
	if (isEmpty) {
		const emptyParams: EmptyStateParams = {
			emptyTitle,
			props,
			...(emptyMessage !== undefined && { emptyMessage }),
			...(emptyDescription !== undefined && { emptyDescription }),
			...(emptyActionLabel !== undefined && { emptyActionLabel }),
			...(onEmptyAction !== undefined && { onEmptyAction }),
			...(className !== undefined && { className }),
		};
		return renderEmptyState(buildEmptyStateParams(emptyParams));
	}
	return null;
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

interface OptionalProps {
	onRetry?: (() => void) | undefined;
	emptyMessage?: string | ReactNode;
	loadingComponent?: ReactNode;
	skeletonComponent?: ReactNode;
	errorComponent?: ReactNode;
	loadingText?: string;
	emptyDescription?: string;
	emptyActionLabel?: string;
	onEmptyAction?: (() => void) | undefined;
	children?: ReactNode;
	className?: string;
}

/** Build optional properties object for state params */
export function buildOptionalStateProps(
	props: Readonly<{
		onRetry?: (() => void) | undefined;
		emptyMessage?: string | ReactNode;
		loadingComponent?: ReactNode;
		skeletonComponent?: ReactNode;
		errorComponent?: ReactNode;
		loadingText?: string;
		emptyDescription?: string;
		emptyActionLabel?: string;
		onEmptyAction?: (() => void) | undefined;
		children?: ReactNode;
		className?: string | undefined;
	}>
): OptionalProps {
	const result: OptionalProps = {};
	const keys: Array<keyof OptionalProps> = [
		'onRetry',
		'emptyMessage',
		'loadingComponent',
		'skeletonComponent',
		'errorComponent',
		'loadingText',
		'emptyDescription',
		'emptyActionLabel',
		'onEmptyAction',
		'children',
		'className',
	];
	for (const key of keys) {
		const value = props[key];
		if (value !== undefined) {
			(result as Record<string, unknown>)[key] = value;
		}
	}
	return result;
}

/** Build state params from component props */
export function buildStateParams(
	props: Readonly<{
		isLoading?: boolean;
		error?: Error | string | ReactNode | null;
		isEmpty?: boolean;
		useSkeleton?: boolean;
		emptyTitle?: string;
		onRetry?: (() => void) | undefined;
		emptyMessage?: string | ReactNode;
		loadingComponent?: ReactNode;
		skeletonComponent?: ReactNode;
		errorComponent?: ReactNode;
		loadingText?: string;
		emptyDescription?: string;
		emptyActionLabel?: string;
		onEmptyAction?: (() => void) | undefined;
		children?: ReactNode;
		className?: string | undefined;
		[key: string]: unknown;
	}>
): LoadingWrapperStateParams {
	const {
		isLoading = false,
		error = null,
		isEmpty = false,
		useSkeleton = false,
		emptyTitle = 'No data available',
		...restProps
	} = props;

	return {
		isLoading,
		error: error ?? null,
		isEmpty,
		useSkeleton,
		emptyTitle,
		props: restProps,
		...buildOptionalStateProps(props),
	};
}
