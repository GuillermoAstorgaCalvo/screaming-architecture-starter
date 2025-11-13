import type {
	ForwardedVideoProps,
	RenderVideoProps,
	UseVideoLifecycleParams,
	VideoConfig,
} from '@core/ui/media/video/types/video.types';
import type { VideoProps } from '@src-types/ui/feedback';

export function getVideoConfig(props: Readonly<VideoProps>): VideoConfig {
	return {
		lifecycle: extractLifecycleProps(props),
		render: extractRenderProps(props),
	};
}

export function extractLifecycleProps({
	src,
	fallbackSrc,
	onCanPlay,
	onLoadedData,
	onError,
}: Readonly<VideoProps>): UseVideoLifecycleParams {
	return { src, fallbackSrc, onCanPlay, onLoadedData, onError };
}

export function extractRenderProps(props: Readonly<VideoProps>): RenderVideoProps {
	return {
		...extractVideoBehaviorProps(props),
		...extractVideoDisplayProps(props),
		...extractVideoDimensionProps(props),
		...extractVideoPlaceholderProps(props),
		...extractVideoStylingProps(props),
		...extractVideoLoadingProps(props),
		rest: getForwardedProps(props),
	};
}

function extractVideoBehaviorProps({
	controls = true,
	autoplay,
	loop,
	muted,
	preload = 'metadata',
}: Readonly<VideoProps>): Pick<
	RenderVideoProps,
	'controls' | 'autoplay' | 'loop' | 'muted' | 'preload'
> {
	return { controls, autoplay, loop, muted, preload };
}

function extractVideoDisplayProps({
	poster,
	objectFit = 'contain',
	tracks,
}: Readonly<VideoProps>): Pick<RenderVideoProps, 'poster' | 'objectFit' | 'tracks'> {
	return { poster, objectFit, tracks };
}

function extractVideoDimensionProps({
	width,
	height,
}: Readonly<VideoProps>): Pick<RenderVideoProps, 'width' | 'height'> {
	return { width, height };
}

function extractVideoPlaceholderProps({
	loadingPlaceholder,
	errorPlaceholder,
	fallbackSrc,
}: Readonly<VideoProps>): Pick<
	RenderVideoProps,
	'loadingPlaceholder' | 'errorPlaceholder' | 'fallbackSrc'
> {
	return { loadingPlaceholder, errorPlaceholder, fallbackSrc };
}

function extractVideoStylingProps({
	className,
	style,
}: Readonly<VideoProps>): Pick<RenderVideoProps, 'className' | 'style'> {
	return { className, style };
}

function extractVideoLoadingProps({
	showSkeleton = false,
	showSpinner = true,
}: Readonly<VideoProps>): Pick<RenderVideoProps, 'showSkeleton' | 'showSpinner'> {
	return { showSkeleton, showSpinner };
}

function getForwardedProps(props: Readonly<VideoProps>): ForwardedVideoProps {
	const {
		src: _src,
		poster: _poster,
		controls: _controls,
		autoplay: _autoplay,
		loop: _loop,
		muted: _muted,
		preload: _preload,
		fallbackSrc: _fallbackSrc,
		loadingPlaceholder: _loadingPlaceholder,
		errorPlaceholder: _errorPlaceholder,
		onError: _onError,
		onCanPlay: _onCanPlay,
		onLoadedData: _onLoadedData,
		width: _width,
		height: _height,
		objectFit: _objectFit,
		showSkeleton: _showSkeleton,
		showSpinner: _showSpinner,
		className: _className,
		style: _style,
		tracks: _tracks,
		...forwarded
	} = props;

	return forwarded as ForwardedVideoProps;
}
