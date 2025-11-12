import type { ImageProps } from '@src-types/ui/feedback';

import type {
	ForwardedImageProps,
	ImageConfig,
	RenderImageProps,
	UseImageLifecycleParams,
} from './image.types';

export function getImageConfig(props: Readonly<ImageProps>): ImageConfig {
	return {
		lifecycle: extractLifecycleProps(props),
		render: extractRenderProps(props),
	};
}

function extractLifecycleProps({
	src,
	fallbackSrc,
	onLoad,
	onError,
}: Readonly<ImageProps>): UseImageLifecycleParams {
	return { src, fallbackSrc, onLoad, onError };
}

function extractRenderProps(props: Readonly<ImageProps>): RenderImageProps {
	const {
		fallbackSrc,
		alt,
		lazy = true,
		loadingPlaceholder,
		errorPlaceholder,
		width,
		height,
		objectFit = 'cover',
		showSkeleton = false,
		className,
		style,
	} = props;

	return {
		alt,
		className,
		errorPlaceholder,
		fallbackSrc,
		height,
		lazy,
		loadingPlaceholder,
		objectFit,
		showSkeleton,
		style,
		width,
		rest: getForwardedProps(props),
	};
}

function getForwardedProps(props: Readonly<ImageProps>): ForwardedImageProps {
	const {
		src: _src,
		alt: _alt,
		fallbackSrc: _fallbackSrc,
		lazy: _lazy,
		loadingPlaceholder: _loadingPlaceholder,
		errorPlaceholder: _errorPlaceholder,
		onError: _onError,
		onLoad: _onLoad,
		width: _width,
		height: _height,
		objectFit: _objectFit,
		showSkeleton: _showSkeleton,
		className: _className,
		style: _style,
		...forwarded
	} = props;

	return forwarded as ForwardedImageProps;
}
