/**
 * Basic Permission Checking
 *
 * Provides simple permission checking functions for single and multiple permissions.
 */

import type { Permissions } from './permissionsTypes';

/**
 * Check if a user has a specific permission
 *
 * @param permissions - User's permission object
 * @param permission - Permission string to check (e.g., 'article:write')
 * @returns true if permission exists and is true, false otherwise
 *
 * @example
 * ```ts
 * const perms = { 'article:read': true, 'article:write': false };
 * hasPermission(perms, 'article:read'); // => true
 * hasPermission(perms, 'article:write'); // => false
 * hasPermission(perms, 'article:delete'); // => false (not found)
 * ```
 */
export function hasPermission(
	permissions: Permissions | null | undefined,
	permission: string
): boolean {
	if (!permissions) {
		return false;
	}
	if (!permission || typeof permission !== 'string') {
		return false;
	}
	return permissions[permission] === true;
}

/**
 * Check if a user has all of the specified permissions (AND logic)
 *
 * @param permissions - User's permission object
 * @param requiredPermissions - Array of permission strings that must all be granted
 * @returns true if all permissions are granted, false otherwise
 *
 * @example
 * ```ts
 * const perms = { 'article:read': true, 'article:write': true };
 * hasAllPermissions(perms, ['article:read', 'article:write']); // => true
 * hasAllPermissions(perms, ['article:read', 'article:delete']); // => false
 * ```
 */
export function hasAllPermissions(
	permissions: Permissions | null | undefined,
	requiredPermissions: string[]
): boolean {
	if (!permissions) {
		return false;
	}
	if (!Array.isArray(requiredPermissions)) {
		return false;
	}
	if (requiredPermissions.length === 0) {
		return true;
	}

	return requiredPermissions.every(permission => hasPermission(permissions, permission));
}

/**
 * Check if a user has any of the specified permissions (OR logic)
 *
 * @param permissions - User's permission object
 * @param allowedPermissions - Array of permission strings, at least one must be granted
 * @returns true if at least one permission is granted, false otherwise
 *
 * @example
 * ```ts
 * const perms = { 'article:read': true, 'article:write': false };
 * hasAnyPermission(perms, ['article:read', 'article:write']); // => true
 * hasAnyPermission(perms, ['article:write', 'article:delete']); // => false
 * ```
 */
export function hasAnyPermission(
	permissions: Permissions | null | undefined,
	allowedPermissions: string[]
): boolean {
	if (!permissions) {
		return false;
	}
	if (!Array.isArray(allowedPermissions)) {
		return false;
	}
	if (allowedPermissions.length === 0) {
		return false;
	}

	return allowedPermissions.some(permission => hasPermission(permissions, permission));
}
