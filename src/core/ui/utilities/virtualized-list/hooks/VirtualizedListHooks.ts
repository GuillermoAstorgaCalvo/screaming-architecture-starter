import { type RefObject, useEffect } from 'react';

interface UseScrollHandlerParams {
	readonly onScrollChange?: ((scrollOffset: number) => void) | undefined;
	readonly orientation: 'vertical' | 'horizontal';
	readonly parentRef: RefObject<HTMLDivElement | null>;
}

/**
 * Hook to handle scroll events and notify parent of scroll offset changes
 */
export function useScrollHandler({
	onScrollChange,
	orientation,
	parentRef,
}: UseScrollHandlerParams): void {
	useEffect(() => {
		const scrollElement = parentRef.current;
		if (!scrollElement || !onScrollChange) {
			return;
		}

		const handleScroll = () => {
			const offset =
				orientation === 'vertical' ? scrollElement.scrollTop : scrollElement.scrollLeft;
			onScrollChange(offset);
		};

		scrollElement.addEventListener('scroll', handleScroll, { passive: true });
		return () => {
			scrollElement.removeEventListener('scroll', handleScroll);
		};
	}, [onScrollChange, orientation, parentRef]);
}

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
