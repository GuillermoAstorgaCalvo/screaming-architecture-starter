import type { EnabledSyncParams } from '@core/ui/affix/types/useAffix.types';
import { useEffect } from 'react';

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
