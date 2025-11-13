import {
	calculatePositionState,
	getInitialPosition,
	getScrollX,
	getScrollY,
} from '@core/ui/affix/helpers/useAffix.helpers';
import type { StickyCalculationParams } from '@core/ui/affix/types/useAffix.types';
import { useCallback } from 'react';

export function useStickyCalculation(params: StickyCalculationParams): () => boolean {
	const { elementRef, position, threshold, container, enabledRef, initialPositionRef } = params;

	return useCallback((): boolean => {
		const element = elementRef.current;
		if (!element || !enabledRef.current) {
			return false;
		}

		initialPositionRef.current ??= getInitialPosition(element, position, container);

		const isVertical = position === 'top' || position === 'bottom';
		const scrollPosition = isVertical ? getScrollY(container) : getScrollX(container);
		const rect = element.getBoundingClientRect();

		return calculatePositionState({
			position,
			scrollPosition,
			initialPosition: initialPositionRef.current,
			threshold,
			rect,
		});
	}, [elementRef, position, threshold, container, enabledRef, initialPositionRef]);
}
