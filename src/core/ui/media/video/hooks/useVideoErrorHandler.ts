import type { VideoLifecycleState } from '@core/ui/media/video/types/video.types';
import { getVideoSrcString } from '@core/ui/media/video/utils/video.utils';
import type { VideoProps } from '@src-types/ui/feedback';
import { type SyntheticEvent, useCallback } from 'react';

export interface UseVideoErrorHandlerParams {
	setIsLoading: (value: boolean) => void;
	setHasError: (value: boolean) => void;
	setCurrentSrc: (value: VideoProps['src']) => void;
	fallbackSrc?: VideoProps['fallbackSrc'] | undefined;
	currentSrc: VideoProps['src'];
	originalSrc: VideoProps['src'];
	onError?: ((error: Error) => void) | undefined;
}

/**
 * Hook to create an error handler for video loading errors
 * Attempts to use fallback source if available, otherwise calls error callback
 */
export function useVideoErrorHandler({
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
