/**
 * Permission Pattern Matching
 *
 * Provides utilities for matching permissions using wildcard patterns.
 */

import type { Permissions } from './permissionsTypes';

/**
 * Match middle parts of a pattern in a permission string
 */
function matchMiddleParts(options: {
	permission: string;
	parts: string[];
	startIndex: number;
	endLength: number;
}): boolean {
	let searchIndex = options.startIndex;
	for (const part of options.parts) {
		if (part.length === 0) {
			continue;
		}
		const foundIndex = options.permission.indexOf(part, searchIndex);
		if (
			foundIndex === -1 ||
			foundIndex + part.length > options.permission.length - options.endLength
		) {
			return false;
		}
		searchIndex = foundIndex + part.length;
	}
	return true;
}

/**
 * Validate pattern matching inputs
 */
function validatePatternInputs(permission: string, pattern: string): boolean {
	return typeof permission === 'string' && typeof pattern === 'string' && pattern.length > 0;
}

/**
 * Handle simple wildcard patterns (prefix, suffix, exact match)
 */
function handleSimpleWildcards(permission: string, pattern: string): boolean | null {
	if (!pattern.includes('*')) {
		return permission === pattern;
	}

	if (pattern.endsWith('*')) {
		return permission.startsWith(pattern.slice(0, -1));
	}

	if (pattern.startsWith('*')) {
		return permission.endsWith(pattern.slice(1));
	}

	return null;
}

/**
 * Handle complex wildcard patterns with multiple wildcards
 */
function handleComplexWildcard(permission: string, pattern: string): boolean {
	const parts = pattern.split('*');
	if (parts.length === 0) {
		return false;
	}

	const [firstPart, ...restParts] = parts;
	if (firstPart === undefined || !permission.startsWith(firstPart)) {
		return false;
	}

	const lastPart = parts.at(-1);
	if (lastPart === undefined || !permission.endsWith(lastPart)) {
		return false;
	}

	return matchMiddleParts({
		permission,
		parts: restParts.slice(0, -1),
		startIndex: firstPart.length,
		endLength: lastPart.length,
	});
}

/**
 * Check if permission string matches a pattern (wildcard support)
 *
 * @param permission - Permission string to check
 * @param pattern - Pattern with optional wildcards (*)
 * @returns true if permission matches pattern
 *
 * @example
 * ```ts
 * matchesPattern('article:read', 'article:*'); // => true
 * matchesPattern('article:write', 'article:*'); // => true
 * matchesPattern('user:admin', 'article:*'); // => false
 * ```
 */
export function matchesPattern(permission: string, pattern: string): boolean {
	if (!validatePatternInputs(permission, pattern)) {
		return false;
	}

	const simpleResult = handleSimpleWildcards(permission, pattern);
	if (simpleResult !== null) {
		return simpleResult;
	}

	return handleComplexWildcard(permission, pattern);
}

/**
 * Find all permissions matching a pattern
 *
 * @param permissions - User's permission object
 * @param pattern - Pattern with optional wildcards (*)
 * @returns Array of matching permission strings
 *
 * @example
 * ```ts
 * const perms = {
 *   'article:read': true,
 *   'article:write': true,
 *   'user:admin': true,
 * };
 *
 * const articlePerms = findPermissionsByPattern(perms, 'article:*');
 * // => ['article:read', 'article:write']
 * ```
 */
export function findPermissionsByPattern(
	permissions: Permissions | null | undefined,
	pattern: string
): string[] {
	if (!permissions) {
		return [];
	}
	if (typeof pattern !== 'string') {
		return [];
	}

	return Object.keys(permissions).filter(permission => matchesPattern(permission, pattern));
}
