import Skeleton from '@core/ui/skeleton/Skeleton';
import type { ReactElement } from 'react';

import { createImageClasses, createImageStyle } from './image.styles';
import type {
	LoadingPlaceholderParams,
	RenderImageParams,
	RenderReadyImageParams,
} from './image.types';

export function renderImage(params: RenderImageParams): ReactElement {
	if (shouldShowErrorPlaceholder(params)) {
		return <div className={params.className}>{params.errorPlaceholder}</div>;
	}

	const placeholder = resolveLoadingPlaceholder(params);
	if (placeholder) {
		return placeholder;
	}

	return renderReadyImage(params);
}

function shouldShowErrorPlaceholder({
	hasError,
	fallbackSrc,
	errorPlaceholder,
}: Pick<RenderImageParams, 'hasError' | 'fallbackSrc' | 'errorPlaceholder'>): boolean {
	return hasError && Boolean(errorPlaceholder) && !fallbackSrc;
}

function renderReadyImage({
	alt,
	className,
	handleError,
	handleLoad,
	isLoading,
	lazy,
	objectFit,
	src,
	style,
	width,
	height,
	rest,
}: RenderReadyImageParams): ReactElement {
	return (
		<img
			src={src}
			alt={alt}
			loading={lazy ? 'lazy' : 'eager'}
			onLoad={handleLoad}
			onError={handleError}
			className={createImageClasses({ isLoading, className })}
			style={createImageStyle({ width, height, objectFit, style })}
			{...rest}
		/>
	);
}

function resolveLoadingPlaceholder({
	isLoading,
	showSkeleton,
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
	}

	return null;
}
