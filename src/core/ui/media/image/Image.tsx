import type { ImageProps } from '@src-types/ui/feedback';
import { type ReactElement, useCallback, useState } from 'react';

import { getImageConfig } from './image.config';
import { renderImage } from './image.render';
import type { ImageLifecycleState, UseImageLifecycleParams } from './image.types';

/**
 * Image - Optimized image display component with lazy loading, fallback handling, placeholders, and accessible alt text.
 *
 * @example
 * ```tsx
 * <Image
 *   src="/image.jpg"
 *   alt="Description"
 *   width={400}
 *   height={300}
 *   lazy
 *   showSkeleton
 * />
 * ```
 */
export default function Image(props: Readonly<ImageProps>) {
	return <ImageView key={props.src} {...props} />;
}
function ImageView(props: Readonly<ImageProps>): ReactElement {
	const { lifecycle, render } = getImageConfig(props);
	const lifecycleState = useImageLifecycle(lifecycle);
	return renderImage({ ...render, ...lifecycleState });
}
function useImageLifecycle({
	src,
	fallbackSrc,
	onLoad,
	onError,
}: UseImageLifecycleParams): ImageLifecycleState {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [currentSrc, setCurrentSrc] = useState(() => src);

	const handleLoad = useCallback(() => {
		setIsLoading(false);
		setHasError(false);
		onLoad?.();
	}, [onLoad]);

	const handleError = useCallback<ImageLifecycleState['handleError']>(
		_event => {
			setIsLoading(false);
			setHasError(true);

			if (fallbackSrc && currentSrc !== fallbackSrc) {
				setCurrentSrc(fallbackSrc);
				setIsLoading(true);
				setHasError(false);
				return;
			}

			onError?.(new Error(`Failed to load image: ${src}`));
		},
		[fallbackSrc, currentSrc, src, onError]
	);

	return { isLoading, hasError, src: currentSrc, handleLoad, handleError };
}
