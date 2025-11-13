import type { ScrollHandlerParams } from '@core/ui/affix/types/useAffix.types';
import { useCallback } from 'react';

export function useScrollHandler(params: ScrollHandlerParams): () => void {
	const { calculateStickyState, isSticky, onStickyChange, setIsSticky, enabledRef } = params;

	return useCallback((): void => {
		if (!enabledRef.current) {
			return;
		}

		const newStickyState = calculateStickyState();

		if (newStickyState !== isSticky) {
			setIsSticky(newStickyState);
			onStickyChange?.(newStickyState);
		}
	}, [calculateStickyState, isSticky, onStickyChange, setIsSticky, enabledRef]);
}
