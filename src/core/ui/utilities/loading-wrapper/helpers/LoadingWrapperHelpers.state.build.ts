import { buildOptionalStateProps } from '@core/ui/utilities/loading-wrapper/helpers/LoadingWrapperHelpers.state.optional';
import type { LoadingWrapperStateParams } from '@core/ui/utilities/loading-wrapper/types/LoadingWrapperHelpers.state.types';
import type { ReactNode } from 'react';

type BuildStateParamsProps = Readonly<{
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
}>;

/** Build state params from component props */
export function buildStateParams(props: BuildStateParamsProps): LoadingWrapperStateParams {
	const { isLoading, error, isEmpty, useSkeleton, emptyTitle, ...restProps } = props;

	return {
		isLoading: isLoading ?? false,
		error: error ?? null,
		isEmpty: isEmpty ?? false,
		useSkeleton: useSkeleton ?? false,
		emptyTitle: emptyTitle ?? 'No data available',
		props: restProps,
		...buildOptionalStateProps(props),
	};
}
