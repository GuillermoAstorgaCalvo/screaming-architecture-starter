/**
 * Utility functions for React hooks
 *
 * Shared utilities that are used across multiple hooks to avoid duplication
 * and maintain consistency.
 */

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
	// Early return for empty arrays
	if (dependencies.length === 0) {
		return '[]';
	}
	try {
		return JSON.stringify(dependencies);
	} catch {
		// Fallback: Use length + hash of string representations for better uniqueness
		const fallback = dependencies
			.map(item => {
				try {
					return String(item);
				} catch {
					return '[Non-serializable]';
				}
			})
			.join('|');
		return `${dependencies.length}:${fallback}`;
	}
}
