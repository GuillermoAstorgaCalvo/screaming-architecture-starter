import { useCallback } from 'react';

export interface UseVideoSuccessHandlerParams {
	setIsLoading: (value: boolean) => void;
	setHasError: (value: boolean) => void;
	onSuccess?: (() => void) | undefined;
}

/**
 * Hook to create a success handler for video events (canPlay, loadedData)
 * that updates loading/error state and optionally calls a success callback
 */
export function useVideoSuccessHandler({
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
