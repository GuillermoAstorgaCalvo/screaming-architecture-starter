import { useLogger } from '@core/providers/logger/useLogger';
import { useStorage } from '@core/providers/storage/useStorage';
import { useCallback, useEffect, useState } from 'react';
import type { z } from 'zod';

// Type aliases for cleaner code
type Storage = ReturnType<typeof useStorage>;
type Logger = ReturnType<typeof useLogger>;

/**
 * Options for loading stored value
 */
interface LoadStoredValueOptions<T> {
	storage: Storage;
	key: string;
	initialValue: T;
	schema?: z.ZodType<T>;
	logger?: Logger;
}

/**
 * Load initial value from storage
 * Optionally validates with Zod schema if provided
 */
function loadStoredValue<T>(options: LoadStoredValueOptions<T>): T {
	const { storage, key, initialValue, schema, logger } = options;
	try {
		const item = storage.getItem(key);
		if (item === null) {
			return initialValue;
		}
		const parsed = JSON.parse(item) as unknown;

		// Validate with schema if provided
		if (schema) {
			const result = schema.safeParse(parsed);
			if (result.success) {
				return result.data;
			}
			// Schema validation failed - log warning and return initial value
			logger?.warn(`Storage value for key "${key}" failed schema validation, using initial value`, {
				error: result.error.issues,
			});
			return initialValue;
		}

		// No schema provided - use type assertion (backward compatible)
		return parsed as T;
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
	schema?: z.ZodType<T>;
}

/**
 * Handle storage events from other tabs/windows
 * Only processes events from localStorage (same origin) for security
 */
function createStorageEventHandler<T>(
	options: StorageEventHandlerOptions<T>
): (event: StorageEvent) => void {
	const { key, initialValue, setStoredValue, logger, schema } = options;
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
			const parsed = JSON.parse(event.newValue) as unknown;

			// Validate with schema if provided
			if (schema) {
				const result = schema.safeParse(parsed);
				if (result.success) {
					setStoredValue(result.data);
				} else {
					logger.warn(`Storage event value for key "${key}" failed schema validation`, {
						error: result.error.issues,
					});
					// Use initial value on validation failure
					setStoredValue(initialValue);
				}
			} else {
				// No schema provided - use type assertion (backward compatible)
				setStoredValue(parsed as T);
			}
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
		logger.error(`Failed to serialize value for key "${key}"`, error, { key });
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
	schema?: z.ZodType<T>;
}

/**
 * Setup storage event listener for cross-tab synchronization
 */
function setupStorageSync<T>(options: StorageSyncOptions<T>): () => void {
	const { key, initialValue, logger, setStoredValue, schema } = options;

	// Early return for SSR

	if (globalThis.window === undefined) {
		return () => {
			// No-op cleanup for SSR
		};
	}

	const handleStorageChange = createStorageEventHandler(
		schema
			? { key, initialValue, setStoredValue, logger, schema }
			: { key, initialValue, setStoredValue, logger }
	);

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
 * - Optional Zod schema validation for runtime type safety
 *
 * @example
 * ```tsx
 * // Without schema (backward compatible)
 * const [name, setName] = useLocalStorage<string>('user-name', 'Guest');
 *
 * // With Zod schema for validation
 * import { z } from 'zod';
 * const userSchema = z.object({ name: z.string(), age: z.number() });
 * const [user, setUser] = useLocalStorage('user', { name: 'Guest', age: 0 }, userSchema);
 * ```
 *
 * @template T - The type of the stored value
 * @param key - The storage key
 * @param initialValue - The initial value if nothing is stored
 * @param schema - Optional Zod schema for runtime validation
 * @returns A tuple of [value, setValue, removeValue]
 */

export function useLocalStorage<T>(
	key: string,
	initialValue: T,
	schema?: z.ZodType<T>
): [T, (value: T | null) => void, () => void] {
	const storage = useStorage();
	const logger = useLogger();
	const [storedValue, setStoredValue] = useState<T>(() =>
		loadStoredValue(
			schema
				? { storage, key, initialValue, schema, logger }
				: { storage, key, initialValue, logger }
		)
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
		() =>
			setupStorageSync(
				schema
					? { key, initialValue, logger, setStoredValue, schema }
					: { key, initialValue, logger, setStoredValue }
			),
		// setStoredValue is a state setter (stable), but included for completeness
		[key, initialValue, logger, setStoredValue, schema]
	);

	return [storedValue, setValue, removeValue];
}
