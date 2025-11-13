import { useContext } from 'react';

import { ListContext, type ListContextValue } from './ListContext';

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
