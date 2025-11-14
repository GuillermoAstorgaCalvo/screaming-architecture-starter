import type { StoragePort } from '@core/ports/StoragePort';
import { createContext } from 'react';

export interface StorageContextValue {
	readonly storage: StoragePort;
}

export const StorageContext = createContext<StorageContextValue | undefined>(undefined);

StorageContext.displayName = 'StorageContext';
