import type { AffixRefs } from '@core/ui/affix/types/useAffix.types';
import { useRef } from 'react';

export function useAffixRefs(enabled: boolean): AffixRefs {
	const elementRef = useRef<HTMLDivElement>(null);
	const initialPositionRef = useRef<number | null>(null);
	const enabledRef = useRef(enabled);

	return {
		elementRef,
		initialPositionRef,
		enabledRef,
	};
}
