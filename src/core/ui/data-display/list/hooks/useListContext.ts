import { ListContext, type ListContextValue } from '@core/ui/data-display/list/context/ListContext';
import { useContext } from 'react';

/**
 * Hook to access list context
 * @returns The list context value with size, defaults to 'md' if used outside ListProvider
 */
export function useListContext(): ListContextValue {
	const context = useContext(ListContext);

	if (!context) {
		return { size: 'md' };
	}

	return context;
}
