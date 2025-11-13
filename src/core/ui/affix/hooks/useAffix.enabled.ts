import { useEffect } from 'react';

import type { EnabledSyncParams } from './useAffix.types';

export function useEnabledSync(params: EnabledSyncParams): void {
	const { enabled, elementRef, setIsSticky, initialPositionRef, enabledRef } = params;

	useEffect(() => {
		enabledRef.current = enabled;
		if (!enabled || !elementRef.current) {
			initialPositionRef.current = null;
			setTimeout(() => {
				setIsSticky(false);
			}, 0);
		}
	}, [enabled, elementRef, setIsSticky, initialPositionRef, enabledRef]);
}
