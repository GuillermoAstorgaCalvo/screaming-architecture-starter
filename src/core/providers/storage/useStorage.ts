import type { StoragePort } from '@core/ports/StoragePort';
import { StorageContext } from '@core/providers/StorageContext';
import { useContext } from 'react';

/**
 * Hook to access StoragePort from context
 * @returns The StoragePort instance
 * @throws Error if used outside StorageProvider
 */
export function useStorage(): StoragePort {
	const context = useContext(StorageContext);
	if (context === undefined) {
		throw new Error('useStorage must be used within a StorageProvider');
	}
	return context.storage;
}
