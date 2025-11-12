import { type KeyboardEvent, useCallback } from 'react';

export function useCarouselKeyboard(goToPrevious: () => void, goToNext: () => void) {
	return useCallback(
		(e: KeyboardEvent<HTMLElement>) => {
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				goToPrevious();
			} else if (e.key === 'ArrowRight') {
				e.preventDefault();
				goToNext();
			}
		},
		[goToPrevious, goToNext]
	);
}
