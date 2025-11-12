import type { StandardSize } from '@src-types/ui/base';
import { createContext, type ReactNode, useMemo } from 'react';

export interface ListContextValue {
	readonly size: StandardSize;
}

const ListContext = createContext<ListContextValue | undefined>(undefined);

interface ListProviderProps {
	readonly size: StandardSize;
	readonly children: ReactNode;
}

export function ListProvider({ size, children }: ListProviderProps) {
	const value = useMemo(() => ({ size }), [size]);

	return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
}

export { ListContext };
