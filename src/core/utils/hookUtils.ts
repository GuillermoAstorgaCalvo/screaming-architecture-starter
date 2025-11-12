/**
 * Utility functions for dependency serialization
 *
 * Framework Agnostic:
 * This utility is in `core/utils/` (not `core/lib/`) because it:
 * - Has no framework dependencies (works in any JavaScript context)
 * - Is a pure function with no side effects
 * - Can be used in Node.js, browser, tests, or any JS runtime
 *
 * See: src/core/README.md for distinction between `lib/` and `utils/`
 *
 * Note: While commonly used by React hooks for dependency comparison, this utility
 * itself is framework-agnostic and can be used in any context where dependency
 * serialization is needed.
 *
 * Shared utilities that are used across multiple hooks to avoid duplication
 * and maintain consistency.
 */

/**
 * Serialize a single dependency item to string representation
 */
function serializeItem(item: unknown): string {
	// Handle null/undefined explicitly
	if (item === null || item === undefined) {
		return String(item);
	}

	// Handle non-primitive types that can't be stringified meaningfully
	if (typeof item === 'function') {
		return '[Function]';
	}
	if (typeof item === 'object') {
		// Use explicit string to avoid Object stringification warning
		return '[object Object]';
	}

	// All remaining cases are primitives (string, number, boolean, symbol, bigint)
	// Type assertion: after excluding null, functions, and objects, only primitives remain
	const primitive = item as string | number | boolean | symbol | bigint;
	return String(primitive);
}

/**
 * Create fallback key from non-serializable dependencies
 */
function createFallbackKey(dependencies: unknown[]): string {
	const fallback = dependencies
		.map(item => {
			try {
				return serializeItem(item);
			} catch {
				return '[Non-serializable]';
			}
		})
		.join('|');
	return `${dependencies.length}:${fallback}`;
}

/**
 * Check if a value is serializable with JSON.stringify
 */
function isSerializable(value: unknown): boolean {
	if (value === null || value === undefined) {
		return true;
	}
	if (typeof value === 'function') {
		return false;
	}
	if (typeof value === 'object') {
		try {
			JSON.stringify(value);
			return true;
		} catch {
			return false;
		}
	}
	return true;
}

/**
 * Serialize dependencies array to detect changes
 *
 * Converts a dependencies array into a string key for comparison.
 * Handles cases where dependencies contain non-serializable values.
 *
 * Note: If serialization fails (e.g., circular references), the fallback
 * uses array length and a hash of string representations. This may cause
 * false positives where different arrays of the same length with
 * non-serializable values are considered equal.
 *
 * @param dependencies - Array of dependency values
 * @returns A string representation of the dependencies for comparison
 */
export function getDependenciesKey(dependencies: unknown[]): string {
	if (dependencies.length === 0) {
		return '[]';
	}
	// Check if all values are serializable before attempting JSON.stringify
	const allSerializable = dependencies.every(item => isSerializable(item));
	if (!allSerializable) {
		return createFallbackKey(dependencies);
	}
	try {
		return JSON.stringify(dependencies);
	} catch {
		return createFallbackKey(dependencies);
	}
}
