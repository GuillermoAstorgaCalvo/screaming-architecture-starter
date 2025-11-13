import { useCallback } from 'react';

import type { ScrollHandlerParams } from './useAffix.types';

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
