import type { ReactNode } from 'react';

import { buildOptionalStateProps } from './LoadingWrapperHelpers.state.optional';
import type { LoadingWrapperStateParams } from './LoadingWrapperHelpers.state.types';

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
