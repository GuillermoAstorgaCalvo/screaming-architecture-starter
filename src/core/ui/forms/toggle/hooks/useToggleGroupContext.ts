import { ToggleGroupContext } from '@core/ui/forms/toggle/components/ToggleGroupContext';
import type { ToggleGroupContextValue } from '@core/ui/forms/toggle/types/ToggleGroupTypes';
import { useContext } from 'react';

export function useToggleGroupContext(): ToggleGroupContextValue {
	const context = useContext(ToggleGroupContext);
	if (!context) {
		throw new Error('Toggle must be used within a ToggleGroup');
	}
	return context;
}
