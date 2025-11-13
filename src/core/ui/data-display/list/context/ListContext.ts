import type { StandardSize } from '@src-types/ui/base';
import { createContext } from 'react';

export interface ListContextValue {
	readonly size: StandardSize;
}

export const ListContext = createContext<ListContextValue | undefined>(undefined);
