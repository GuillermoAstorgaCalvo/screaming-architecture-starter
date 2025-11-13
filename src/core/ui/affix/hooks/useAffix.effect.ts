import { setupScrollListeners } from '@core/ui/affix/helpers/useAffix.helpers';
import type { ScrollEffectParams } from '@core/ui/affix/types/useAffix.types';
import { useEffect } from 'react';

export function useScrollEffect(params: ScrollEffectParams): void {
	const { enabled, container, elementRef, initialPositionRef, handleScroll } = params;

	useEffect(() => {
		if (!enabled || !elementRef.current) {
			return;
		}

		initialPositionRef.current = null;

		const timeoutId = setTimeout(() => {
			handleScroll();
		}, 0);

		const cleanup = setupScrollListeners(container, handleScroll);

		return () => {
			clearTimeout(timeoutId);
			cleanup();
		};
	}, [enabled, container, elementRef, initialPositionRef, handleScroll]);
}
