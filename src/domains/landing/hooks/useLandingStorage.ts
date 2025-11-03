import type { StoragePort } from '@core/ports/StoragePort';
import { useLogger } from '@core/providers/useLogger';
import { useStorage } from '@core/providers/useStorage';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

const VISIT_COUNT_KEY = 'landing:visitCount';
const USER_NAME_KEY = 'landing:userName';

interface UseLandingStorageReturn {
	readonly visitCount: number;
	readonly userName: string;

	readonly setUserName: (_: string) => void;
	readonly clearStorage: () => void;
}

function loadVisitCount(storage: StoragePort): number {
	const stored = storage.getItem(VISIT_COUNT_KEY);
	return stored ? Number.parseInt(stored, 10) : 0;
}

function loadUserName(storage: StoragePort): string {
	return storage.getItem(USER_NAME_KEY) ?? '';
}

/**
 * Hook for landing page storage operations
 * Uses StoragePort interface via dependency injection to respect hexagonal architecture boundaries
 */

function useVisitCountIncrement(
	storage: StoragePort,
	logger: ReturnType<typeof useLogger>,
	setVisitCount: (_: number) => void
): void {
	const hasIncrementedRef = useRef(false);

	// Use useLayoutEffect to increment visit count synchronously before paint
	useLayoutEffect(() => {
		if (hasIncrementedRef.current) {
			return;
		}
		hasIncrementedRef.current = true;

		const currentCount = loadVisitCount(storage);
		const newCount = currentCount + 1;
		setVisitCount(newCount);
		const success = storage.setItem(VISIT_COUNT_KEY, newCount.toString());
		if (!success) {
			logger.warn('Failed to persist visit count to storage');
		}
		// Dependencies included; hasIncrementedRef guard ensures idempotent single execution
	}, [storage, logger, setVisitCount]);
}

function useUserNameManagement(
	storage: StoragePort,
	logger: ReturnType<typeof useLogger>,
	setUserName: (_: string) => void
): (_: string) => void {
	return useCallback(
		(name: string): void => {
			const trimmed = name.trim();
			setUserName(trimmed);
			if (trimmed) {
				const success = storage.setItem(USER_NAME_KEY, trimmed);
				if (!success) {
					logger.warn('Failed to persist user name to storage');
				}
			} else {
				const removed = storage.removeItem(USER_NAME_KEY);
				if (!removed) {
					logger.warn('Failed to remove user name from storage');
				}
			}
		},
		[storage, logger, setUserName]
	);
}

interface StorageClearingConfig {
	readonly storage: StoragePort;
	readonly logger: ReturnType<typeof useLogger>;

	readonly setVisitCount: (_: number) => void;

	readonly setUserName: (_: string) => void;
}

function useStorageClearing(config: StorageClearingConfig): () => void {
	const { storage, logger, setVisitCount, setUserName } = config;
	const clearStorage = useCallback((): void => {
		const visitRemoved = storage.removeItem(VISIT_COUNT_KEY);
		const nameRemoved = storage.removeItem(USER_NAME_KEY);
		// Update state anyway to keep UI consistent even if storage fails
		if (!visitRemoved || !nameRemoved) {
			logger.warn('Some storage items may not have been cleared');
		}
		setVisitCount(0);
		setUserName('');
	}, [storage, logger, setVisitCount, setUserName]);
	return clearStorage;
}

export function useLandingStorage(): UseLandingStorageReturn {
	const storage = useStorage();
	const logger = useLogger();
	const [visitCount, setVisitCount] = useState(() => loadVisitCount(storage));
	const [userName, setUserName] = useState(() => loadUserName(storage));

	useVisitCountIncrement(storage, logger, setVisitCount);
	const setUserNameCallback = useUserNameManagement(storage, logger, setUserName);
	const clearStorage = useStorageClearing({ storage, logger, setVisitCount, setUserName });

	return { clearStorage, setUserName: setUserNameCallback, userName, visitCount };
}
