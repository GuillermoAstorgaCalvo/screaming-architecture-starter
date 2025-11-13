import { ListContext } from '@core/ui/data-display/list/context/ListContext';
import type { StandardSize } from '@src-types/ui/base';
import { type ReactNode, useMemo } from 'react';

interface ListProviderProps {
	readonly size: StandardSize;
	readonly children: ReactNode;
}

export function ListProvider({ size, children }: ListProviderProps) {
	const value = useMemo(() => ({ size }), [size]);

	return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
}
