import type { AffixState } from '@core/ui/affix/types/useAffix.types';
import { useState } from 'react';

export function useAffixState(): AffixState {
	const [isSticky, setIsSticky] = useState(false);

	return {
		isSticky,
		setIsSticky,
	};
}
