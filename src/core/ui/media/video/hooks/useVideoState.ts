import type { VideoProps } from '@src-types/ui/feedback';
import { useState } from 'react';

export interface VideoState {
	isLoading: boolean;
	hasError: boolean;
	currentSrc: VideoProps['src'];
	setIsLoading: (value: boolean) => void;
	setHasError: (value: boolean) => void;
	setCurrentSrc: (value: VideoProps['src']) => void;
}

/**
 * Hook to manage video loading state, error state, and current source
 */
export function useVideoState(initialSrc: VideoProps['src']): VideoState {
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
