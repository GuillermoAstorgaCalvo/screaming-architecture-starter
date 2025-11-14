import { useLogger } from '@core/providers/logger/useLogger';
import { useStorage } from '@core/providers/storage/useStorage';
import { useCallback, useEffect, useState } from 'react';
import type { z } from 'zod';

// Type aliases for cleaner code
type Storage = ReturnType<typeof useStorage>;
type Logger = ReturnType<typeof useLogger>;

/**
 * Type guard to check if window is available (SSR-safe)
 */
function isWindowAvailable(): boolean {
	return 'window' in globalThis;
}

/**
 * Options for loading stored value
 */
interface LoadStoredValueOptions<T> {
	storage: Storage;
	key: string;
	initialValue: T;
	schema: z.ZodType<T> | undefined;
	logger: Logger | undefined;
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
	schema: z.ZodType<T> | undefined;
}

/**
 * Handle storage events from other tabs/windows
 * Only processes events from sessionStorage (same origin) for security
 * Note: sessionStorage does NOT sync across tabs (unlike localStorage),
 * but we still listen for events in case the browser behavior changes
 */
function createStorageEventHandler<T>(
	options: StorageEventHandlerOptions<T>
): (event: StorageEvent) => void {
	const { key, initialValue, setStoredValue, logger, schema } = options;
	return (event: StorageEvent): void => {
		// Security: only process events from sessionStorage (same origin)
		// Note: sessionStorage typically doesn't fire storage events across tabs,
		// but we validate storageArea anyway for consistency
		if (event.storageArea !== globalThis.window.sessionStorage || event.key !== key) {
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
	schema: z.ZodType<T> | undefined;
}

/**
 * Setup storage event listener for cross-tab synchronization
 * Note: sessionStorage typically doesn't sync across tabs, but we set up
 * the listener for consistency and in case browser behavior changes
 */
function setupStorageSync<T>(options: StorageSyncOptions<T>): () => void {
	const { key, initialValue, logger, setStoredValue, schema } = options;

	// Early return for SSR
	if (!isWindowAvailable()) {
		return () => {
			// No-op cleanup for SSR
		};
	}

	const handleStorageChange = createStorageEventHandler({
		key,
		initialValue,
		setStoredValue,
		logger,
		schema,
	});

	globalThis.window.addEventListener('storage', handleStorageChange);
	return () => {
		globalThis.window.removeEventListener('storage', handleStorageChange);
	};
}

/**
 * Hook for reading and writing to sessionStorage via StoragePort
 *
 * This hook provides a React-friendly interface to the sessionStorage adapter,
 * automatically syncing state with storage and handling JSON serialization.
 *
 * Features:
 * - SSR-safe (storage adapter handles SSR guards)
 * - Automatic JSON serialization/deserialization
 * - Syncs with storage on mount
 * - Type-safe with TypeScript generics
 * - Optional Zod schema validation for runtime type safety
 * - Note: sessionStorage is tab-specific and doesn't persist across browser sessions
 *
 * @example
 * ```tsx
 * // Without schema (backward compatible)
 * const [sessionId, setSessionId] = useSessionStorage<string>('session-id', '');
 *
 * // With Zod schema for validation
 * import { z } from 'zod';
 * const sessionSchema = z.object({ id: z.string(), expires: z.number() });
 * const [session, setSession] = useSessionStorage('session', { id: '', expires: 0 }, sessionSchema);
 * ```
 *
 * @template T - The type of the stored value
 * @param key - The storage key
 * @param initialValue - The initial value if nothing is stored
 * @param schema - Optional Zod schema for runtime validation
 * @returns A tuple of [value, setValue, removeValue]
 */
export function useSessionStorage<T>(
	key: string,
	initialValue: T,
	schema?: z.ZodType<T>
): [T, (value: T | null) => void, () => void] {
	const storage = useStorage();
	const logger = useLogger();
	const [storedValue, setStoredValue] = useState<T>(() =>
		loadStoredValue({ storage, key, initialValue, schema, logger })
	);

	const setValue = useCallback(
		(newValue: T | null): void => {
			handleSetValue({
				newValue,
				key,
				initialValue,
				storage,
				logger,
				setStoredValue,
			});
		},
		[key, initialValue, storage, logger]
	);

	const removeValue = useCallback(() => {
		setValue(null);
	}, [setValue]);

	useEffect(
		() => setupStorageSync({ key, initialValue, logger, setStoredValue, schema }),
		// setStoredValue is a state setter (stable), but included for completeness
		[key, initialValue, logger, setStoredValue, schema]
	);

	return [storedValue, setValue, removeValue];
}
