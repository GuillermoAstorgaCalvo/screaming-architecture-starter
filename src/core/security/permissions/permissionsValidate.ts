/**
 * Detailed Permission Validation
 *
 * Provides comprehensive permission checking with detailed results and validation.
 */

import {
	hasAllPermissions,
	hasAnyPermission,
	hasPermission,
} from '@core/security/permissions/permissionsCheck';
import type {
	PermissionCheckResult,
	Permissions,
} from '@core/security/permissions/permissionsTypes';

/**
 * Validate permissions input
 */
function validatePermissionsInput(
	permissions: Permissions | null | undefined,
	requiredPermissions: string[]
): PermissionCheckResult | null {
	if (!permissions) {
		return {
			allowed: false,
			reason: 'Invalid permissions object',
		};
	}
	if (!Array.isArray(requiredPermissions)) {
		return {
			allowed: false,
			reason: 'Invalid required permissions array',
		};
	}
	return null;
}

/**
 * Build denial result with missing permissions
 */
function buildDenialResult(
	requiredPermissions: string[],
	permissions: Permissions | null | undefined,
	requireAll: boolean
): PermissionCheckResult {
	const missing = requiredPermissions.filter(perm => !hasPermission(permissions, perm));

	return {
		allowed: false,
		missing,
		reason: requireAll
			? `Missing required permissions: ${missing.join(', ')}`
			: 'None of the allowed permissions are granted',
	};
}

/**
 * Check permissions with detailed result
 *
 * @param permissions - User's permission object
 * @param requiredPermissions - Required permission(s)
 * @param requireAll - If true, all permissions required (AND). If false, any permission (OR)
 * @returns Detailed permission check result
 *
 * @example
 * ```ts
 * const perms = { 'article:read': true, 'article:write': false };
 *
 * const result1 = checkPermissions(perms, ['article:read'], true);
 * // => { allowed: true }
 *
 * const result2 = checkPermissions(perms, ['article:write', 'article:delete'], true);
 * // => { allowed: false, missing: ['article:write', 'article:delete'] }
 *
 * const result3 = checkPermissions(perms, ['article:read', 'article:write'], false);
 * // => { allowed: true } (OR logic)
 * ```
 */
export function checkPermissions(
	permissions: Permissions | null | undefined,
	requiredPermissions: string[],
	requireAll: boolean = true
): PermissionCheckResult {
	const validationError = validatePermissionsInput(permissions, requiredPermissions);
	if (validationError) {
		return validationError;
	}

	if (requiredPermissions.length === 0) {
		return {
			allowed: !requireAll,
			reason: requireAll ? 'No permissions required' : 'At least one permission required',
		};
	}

	const granted = requireAll
		? hasAllPermissions(permissions, requiredPermissions)
		: hasAnyPermission(permissions, requiredPermissions);

	if (granted) {
		return { allowed: true };
	}

	return buildDenialResult(requiredPermissions, permissions, requireAll);
}
