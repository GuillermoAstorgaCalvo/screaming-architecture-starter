import type { RenderVideoParams } from '@core/ui/media/video/types/video.types';
import Skeleton from '@core/ui/skeleton/Skeleton';
import Spinner from '@core/ui/spinner/Spinner';
import type { ReactElement } from 'react';

export function shouldShowErrorPlaceholder({
	hasError,
	fallbackSrc,
	errorPlaceholder,
}: Pick<RenderVideoParams, 'hasError' | 'fallbackSrc' | 'errorPlaceholder'>): boolean {
	return hasError && Boolean(errorPlaceholder) && !fallbackSrc;
}

type LoadingPlaceholderParams = Pick<
	RenderVideoParams,
	| 'isLoading'
	| 'showSkeleton'
	| 'showSpinner'
	| 'className'
	| 'width'
	| 'height'
	| 'loadingPlaceholder'
>;

export function resolveLoadingPlaceholder({
	isLoading,
	showSkeleton,
	showSpinner,
	className,
	width,
	height,
	loadingPlaceholder,
}: LoadingPlaceholderParams): ReactElement | null {
	if (isLoading) {
		if (showSkeleton) {
			return <Skeleton variant="rectangular" className={className} style={{ width, height }} />;
		}

		if (loadingPlaceholder) {
			return <div className={className}>{loadingPlaceholder}</div>;
		}

		if (showSpinner) {
			return (
				<div
					className={`flex items-center justify-center ${className ?? ''}`}
					style={{ width, height }}
				>
					<Spinner />
				</div>
			);
		}
	}

	return null;
}
