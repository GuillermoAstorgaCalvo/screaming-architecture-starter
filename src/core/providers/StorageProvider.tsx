import type { StoragePort } from '@core/ports/StoragePort';
import { StorageContext, type StorageContextValue } from '@core/providers/StorageContext';
import { type ReactNode, useMemo } from 'react';

export interface StorageProviderProps {
	readonly children: ReactNode;
	readonly storage: StoragePort;
}

/**
 * StorageProvider - Provides StoragePort instance to the component tree
 *
 * This allows domains and core to access storage via the useStorage hook without
 * directly importing infrastructure adapters, respecting hexagonal architecture boundaries.
 *
 * The StoragePort instance should be injected at the app level.
 */
export function StorageProvider({ children, storage }: StorageProviderProps) {
	const value: StorageContextValue = useMemo(() => ({ storage }), [storage]);

	return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
}

StorageProvider.displayName = 'StorageProvider';
