import { useVideoErrorHandler } from '@core/ui/media/video/hooks/useVideoErrorHandler';
import { useVideoState } from '@core/ui/media/video/hooks/useVideoState';
import { useVideoSuccessHandler } from '@core/ui/media/video/hooks/useVideoSuccessHandler';
import type {
	UseVideoLifecycleParams,
	VideoLifecycleState,
} from '@core/ui/media/video/types/video.types';

/**
 * Main hook to manage video lifecycle: loading, error handling, and event handlers
 * Coordinates state management and event handlers for video loading and playback
 */
export function useVideoLifecycle({
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
