import { useState } from 'react';

import type { AffixState } from './useAffix.types';

export function useAffixState(): AffixState {
	const [isSticky, setIsSticky] = useState(false);

	return {
		isSticky,
		setIsSticky,
	};
}
