import { useRef } from 'react';

import type { AffixRefs } from './useAffix.types';

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
