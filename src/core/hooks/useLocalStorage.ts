import { useLogger } from '@core/providers/useLogger';
import { useStorage } from '@core/providers/useStorage';
import { useCallback, useEffect, useState } from 'react';

// Type aliases for cleaner code
type Storage = ReturnType<typeof useStorage>;
type Logger = ReturnType<typeof useLogger>;

/**
 * Load initial value from storage
 */
function loadStoredValue<T>(storage: Storage, key: string, initialValue: T): T {
	try {
		const item = storage.getItem(key);
		if (item === null) {
			return initialValue;
		}
		return JSON.parse(item) as T;
	} catch {
		return initialValue;
	}
}

/**
 * Options for creating a storage event handler
 */
interface StorageEventHandlerOptions<T> {
	key: string;
	initialValue: T;
	setStoredValue: (_value: T) => void;
	logger: Logger;
}

/**
 * Handle storage events from other tabs/windows
 * Only processes events from localStorage (same origin) for security
 */
function createStorageEventHandler<T>(
	options: StorageEventHandlerOptions<T>
): (event: StorageEvent) => void {
	const { key, initialValue, setStoredValue, logger } = options;
	return (event: StorageEvent): void => {
		// Security: only process events from localStorage (same origin)
		// StorageEvent only fires for same-origin changes, but we validate storageArea anyway
		if (event.storageArea !== globalThis.window.localStorage || event.key !== key) {
			return;
		}

		if (event.newValue === null) {
			// Item was removed
			setStoredValue(initialValue);
			return;
		}

		try {
			const parsed = JSON.parse(event.newValue) as T;
			setStoredValue(parsed);
		} catch (error) {
			logger.warn(`Failed to parse storage event value for key "${key}"`, {
				error: error instanceof Error ? error.message : String(error),
			});
		}
	};
}

/**
 * Options for setting storage value
 */
interface SetValueOptions<T> {
	newValue: T | null;
	key: string;
	initialValue: T;
	storage: Storage;
	logger: Logger;
	setStoredValue: (_value: T) => void;
}

/**
 * Handle setting a value in storage
 */
function handleSetValue<T>(options: SetValueOptions<T>): void {
	const { newValue, key, initialValue, storage, logger, setStoredValue } = options;

	if (newValue === null) {
		const removed = storage.removeItem(key);
		if (removed) {
			setStoredValue(initialValue);
		} else {
			logger.warn(`Failed to remove item "${key}" from storage`);
		}
		return;
	}

	try {
		const serialized = JSON.stringify(newValue);
		const set = storage.setItem(key, serialized);
		if (set) {
			setStoredValue(newValue);
		} else {
			logger.warn(`Failed to set item "${key}" in storage`);
		}
	} catch (error) {
		logger.error(`Failed to serialize value for key "${key}"`, {
			error: error instanceof Error ? error.message : String(error),
		});
	}
}

/**
 * Options for setting up storage sync
 */
interface StorageSyncOptions<T> {
	key: string;
	initialValue: T;
	logger: Logger;
	setStoredValue: (_value: T) => void;
}

/**
 * Setup storage event listener for cross-tab synchronization
 */
function setupStorageSync<T>(options: StorageSyncOptions<T>): () => void {
	const { key, initialValue, logger, setStoredValue } = options;

	// Early return for SSR

	if (globalThis.window === undefined) {
		return () => {
			// No-op cleanup for SSR
		};
	}

	const handleStorageChange = createStorageEventHandler({
		key,
		initialValue,
		setStoredValue,
		logger,
	});

	globalThis.window.addEventListener('storage', handleStorageChange);
	return () => {
		globalThis.window.removeEventListener('storage', handleStorageChange);
	};
}

/**
 * Hook for reading and writing to localStorage via StoragePort
 *
 * This hook provides a React-friendly interface to the storage adapter,
 * automatically syncing state with storage and handling JSON serialization.
 *
 * Features:
 * - SSR-safe (storage adapter handles SSR guards)
 * - Automatic JSON serialization/deserialization
 * - Syncs with storage on mount
 * - Type-safe with TypeScript generics
 *
 * @example
 * ```tsx
 * const [name, setName] = useLocalStorage<string>('user-name', 'Guest');
 *
 * // Update value
 * setName('John Doe');
 *
 * // Remove from storage
 * setName(null);
 * ```
 *
 * @template T - The type of the stored value
 * @param key - The storage key
 * @param initialValue - The initial value if nothing is stored
 * @returns A tuple of [value, setValue, removeValue]
 */

export function useLocalStorage<T>(
	key: string,
	initialValue: T
): [T, (value: T | null) => void, () => void] {
	const storage = useStorage();
	const logger = useLogger();
	const [storedValue, setStoredValue] = useState<T>(() =>
		loadStoredValue(storage, key, initialValue)
	);

	const setValue = useCallback(
		(newValue: T | null): void => {
			handleSetValue({ newValue, key, initialValue, storage, logger, setStoredValue });
		},
		[key, initialValue, storage, logger]
	);

	const removeValue = useCallback(() => {
		setValue(null);
	}, [setValue]);

	useEffect(
		() => setupStorageSync({ key, initialValue, logger, setStoredValue }),
		[key, initialValue, logger]
	);

	return [storedValue, setValue, removeValue];
}
