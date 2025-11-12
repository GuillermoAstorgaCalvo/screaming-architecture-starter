import type { VideoProps } from '@src-types/ui/feedback';
import { type ReactElement, type SyntheticEvent, useCallback, useState } from 'react';

import { getVideoConfig } from './video.config';
import { renderVideo } from './video.helpers';
import type { UseVideoLifecycleParams, VideoLifecycleState } from './video.types';

/**
 * Video - Video player component with controls, loading states, and error handling
 *
 * Features:
 * - Loading states with spinner or skeleton
 * - Error handling with custom error placeholders
 * - Support for single or multiple video sources
 * - Poster image support
 * - Full control over video attributes (autoplay, loop, muted, etc.)
 * - Accessible video player
 *
 * @example
 * ```tsx
 * <Video
 *   src="/video.mp4"
 *   poster="/poster.jpg"
 *   controls
 *   showSpinner
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Video
 *   src={[
 *     { src: "/video.webm", type: "video/webm" },
 *     { src: "/video.mp4", type: "video/mp4" }
 *   ]}
 *   controls
 *   autoplay
 *   muted
 *   loop
 * />
 * ```
 *
 * @example
 * ```tsx
 * <AspectRatio ratio={16 / 9}>
 *   <Video
 *     src="/video.mp4"
 *     controls
 *     className="h-full w-full"
 *   />
 * </AspectRatio>
 * ```
 */
export default function Video(props: Readonly<VideoProps>) {
	return (
		<VideoView key={typeof props.src === 'string' ? props.src : props.src[0]?.src} {...props} />
	);
}

function VideoView(props: Readonly<VideoProps>): ReactElement {
	const { lifecycle, render } = getVideoConfig(props);
	const lifecycleState = useVideoLifecycle(lifecycle);
	return renderVideo({ ...render, ...lifecycleState });
}

function useVideoLifecycle({
	src,
	fallbackSrc,
	onCanPlay,
	onLoadedData,
	onError,
}: UseVideoLifecycleParams): VideoLifecycleState {
	const videoState = useVideoState(src);
	const handleCanPlay = useVideoSuccessHandler({
		setIsLoading: videoState.setIsLoading,
		setHasError: videoState.setHasError,
		onSuccess: onCanPlay,
	});
	const handleLoadedData = useVideoSuccessHandler({
		setIsLoading: videoState.setIsLoading,
		setHasError: videoState.setHasError,
		onSuccess: onLoadedData,
	});
	const handleError = useVideoErrorHandler({
		setIsLoading: videoState.setIsLoading,
		setHasError: videoState.setHasError,
		setCurrentSrc: videoState.setCurrentSrc,
		fallbackSrc,
		currentSrc: videoState.currentSrc,
		originalSrc: src,
		onError,
	});

	return {
		isLoading: videoState.isLoading,
		hasError: videoState.hasError,
		src: videoState.currentSrc,
		handleCanPlay,
		handleLoadedData,
		handleError,
	};
}

interface VideoState {
	isLoading: boolean;
	hasError: boolean;
	currentSrc: VideoProps['src'];
	setIsLoading: (value: boolean) => void;
	setHasError: (value: boolean) => void;
	setCurrentSrc: (value: VideoProps['src']) => void;
}

function useVideoState(initialSrc: VideoProps['src']): VideoState {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [currentSrc, setCurrentSrc] = useState(() => initialSrc);

	return {
		isLoading,
		hasError,
		currentSrc,
		setIsLoading,
		setHasError,
		setCurrentSrc,
	};
}

interface UseVideoSuccessHandlerParams {
	setIsLoading: (value: boolean) => void;
	setHasError: (value: boolean) => void;
	onSuccess?: (() => void) | undefined;
}

function useVideoSuccessHandler({
	setIsLoading,
	setHasError,
	onSuccess,
}: UseVideoSuccessHandlerParams) {
	return useCallback(() => {
		setIsLoading(false);
		setHasError(false);
		onSuccess?.();
	}, [setIsLoading, setHasError, onSuccess]);
}

interface UseVideoErrorHandlerParams {
	setIsLoading: (value: boolean) => void;
	setHasError: (value: boolean) => void;
	setCurrentSrc: (value: VideoProps['src']) => void;
	fallbackSrc?: VideoProps['fallbackSrc'] | undefined;
	currentSrc: VideoProps['src'];
	originalSrc: VideoProps['src'];
	onError?: ((error: Error) => void) | undefined;
}

function useVideoErrorHandler({
	setIsLoading,
	setHasError,
	setCurrentSrc,
	fallbackSrc,
	currentSrc,
	originalSrc,
	onError,
}: UseVideoErrorHandlerParams): VideoLifecycleState['handleError'] {
	return useCallback<VideoLifecycleState['handleError']>(
		(_event: SyntheticEvent<HTMLVideoElement>) => {
			setIsLoading(false);
			setHasError(true);

			if (fallbackSrc && currentSrc !== fallbackSrc) {
				setCurrentSrc(fallbackSrc);
				setIsLoading(true);
				setHasError(false);
				return;
			}

			const srcString = getVideoSrcString(originalSrc);
			onError?.(new Error(`Failed to load video: ${srcString}`));
		},
		[setIsLoading, setHasError, setCurrentSrc, fallbackSrc, currentSrc, originalSrc, onError]
	);
}

function getVideoSrcString(src: VideoProps['src']): string {
	return typeof src === 'string' ? src : (src[0]?.src ?? 'unknown');
}
