/**
 * Permission Manipulation
 *
 * Provides utilities for merging and filtering permission objects.
 */

import type { Permissions } from '@core/security/permissions/permissionsTypes';

/**
 * Merge multiple permission objects
 * Later permissions override earlier ones
 *
 * @param permissionObjects - Array of permission objects to merge
 * @returns Merged permissions object
 *
 * @example
 * ```ts
 * const basePerms = { 'article:read': true };
 * const additionalPerms = { 'article:write': true, 'article:read': false };
 * const merged = mergePermissions([basePerms, additionalPerms]);
 * // => { 'article:read': false, 'article:write': true }
 * ```
 */
export function mergePermissions(
	permissionObjects: (Permissions | null | undefined)[]
): Permissions {
	if (!Array.isArray(permissionObjects)) {
		return {};
	}

	const merged: Permissions = {};

	for (const perms of permissionObjects) {
		if (perms) {
			Object.assign(merged, perms);
		}
	}

	return merged;
}

/**
 * Filter permissions to only include those in the allowed list
 *
 * @param permissions - User's permission object
 * @param allowedList - List of permission strings to include
 * @returns Filtered permissions object
 *
 * @example
 * ```ts
 * const perms = {
 *   'article:read': true,
 *   'article:write': true,
 *   'user:admin': true,
 * };
 *
 * const filtered = filterPermissions(perms, ['article:read', 'article:write']);
 * // => { 'article:read': true, 'article:write': true }
 * ```
 */
export function filterPermissions(
	permissions: Permissions | null | undefined,
	allowedList: string[]
): Permissions {
	if (!permissions) {
		return {};
	}
	if (!Array.isArray(allowedList)) {
		return {};
	}

	const filtered: Permissions = {};

	for (const permission of allowedList) {
		if (typeof permission === 'string' && permission && permissions[permission] === true) {
			filtered[permission] = true;
		}
	}

	return filtered;
}
