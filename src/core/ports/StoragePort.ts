/**
 * StoragePort - Interface for key/value storage access
 *
 * Hexagonal architecture port: defines the contract for storage operations.
 * Infrastructure adapters implement this interface, while domains depend only on the port.
 *
 * This abstraction enables:
 * - SSR-safe storage access
 * - Easy testing with mock implementations
 * - Swapping storage backends without changing domain code
 */

/**
 * StoragePort - Interface for storage operations
 *
 * Defines the contract for key/value storage operations. All methods are synchronous
 * and should handle SSR environments gracefully by returning safe defaults when storage
 * is unavailable.
 */
export interface StoragePort {
	/**
	 * Get a value from storage by key
	 * @param key - The storage key
	 * @returns The stored value, or null if not found
	 */
	getItem(key: string): string | null;

	/**
	 * Set a value in storage by key
	 * @param key - The storage key
	 * @param value - The value to store
	 * @returns true if successful, false otherwise
	 */
	setItem(key: string, value: string): boolean;

	/**
	 * Remove a value from storage by key
	 * @param key - The storage key
	 * @returns true if successful, false otherwise
	 */
	removeItem(key: string): boolean;

	/**
	 * Clear all items from storage
	 * @returns true if successful, false otherwise
	 */
	clear(): boolean;

	/**
	 * Get the number of items in storage
	 * @returns The number of items, or 0 if not available
	 */
	getLength(): number;

	/**
	 * Get a key by index
	 * @param index - The index of the key
	 * @returns The key at the given index, or null if not found
	 */
	key(index: number): string | null;
}
