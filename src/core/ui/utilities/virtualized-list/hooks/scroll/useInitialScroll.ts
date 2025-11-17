import { type RefObject, useEffect } from 'react';

interface UseInitialScrollParams {
	readonly initialScrollOffset: number;
	readonly orientation: 'vertical' | 'horizontal';
	readonly parentRef: RefObject<HTMLDivElement | null>;
}

/**
 * Hook to set initial scroll offset when component mounts
 */
export function useInitialScroll({
	initialScrollOffset,
	orientation,
	parentRef,
}: UseInitialScrollParams): void {
	useEffect(() => {
		if (initialScrollOffset > 0 && parentRef.current) {
			if (orientation === 'vertical') {
				parentRef.current.scrollTop = initialScrollOffset;
			} else {
				parentRef.current.scrollLeft = initialScrollOffset;
			}
		}
	}, [initialScrollOffset, orientation, parentRef]);
}
