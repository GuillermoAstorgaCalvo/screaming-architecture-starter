import { useContext } from 'react';

import { ToggleGroupContext } from './ToggleGroupContext';
import type { ToggleGroupContextValue } from './ToggleGroupTypes';

export function useToggleGroupContext(): ToggleGroupContextValue {
	const context = useContext(ToggleGroupContext);
	if (!context) {
		throw new Error('Toggle must be used within a ToggleGroup');
	}
	return context;
}
