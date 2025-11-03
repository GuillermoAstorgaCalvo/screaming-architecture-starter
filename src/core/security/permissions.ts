/**
 * Permission Model Helpers
 *
 * Provides utilities for managing and evaluating permissions in the application.
 *
 * Framework Agnostic:
 * This utility is in `core/security/` because it:
 * - Has no framework dependencies
 * - Provides generic permission evaluation logic
 * - Can be used in any context (client, server, domain logic)
 *
 * Security Principles:
 * - Least privilege: Grant minimum necessary permissions
 * - Fail securely: Deny access when permission cannot be verified
 * - Centralize permission logic for consistent enforcement
 *
 * @example
 * ```ts
 * // Define permission structure
 * const permissions = {
 *   'article:read': true,
 *   'article:write': false,
 *   'user:admin': true,
 * };
 *
 * // Check permissions
 * if (hasPermission(permissions, 'article:write')) {
 *   // Allow action
 * }
 *
 * // Check multiple permissions (AND)
 * if (hasAllPermissions(permissions, ['article:read', 'article:write'])) {
 *   // All required
 * }
 *
 * // Check any permission (OR)
 * if (hasAnyPermission(permissions, ['article:read', 'article:write'])) {
 *   // At least one
 * }
 * ```
 */

/**
 * Permission object type
 * Maps permission strings to boolean values
 */
export type Permissions = Record<string, boolean>;

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

/**
 * Permission check result with context
 */
export interface PermissionCheckResult {
	/**
	 * Whether the permission check passed
	 */
	allowed: boolean;

	/**
	 * Missing permissions (if check failed)
	 */
	missing?: string[];

	/**
	 * Optional reason for denial
	 */
	reason?: string;
}

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

/**
 * Permission role definition
 * Maps role names to their associated permissions
 */
export type PermissionRoles = Record<string, string[]>;

/**
 * Add permissions from a single role to the permissions object
 */
function addRolePermissions(
	permissions: Permissions,
	role: string,
	rolePermissions: PermissionRoles
): void {
	if (typeof role !== 'string' || !role) {
		return;
	}
	const rolePerms = rolePermissions[role];
	if (!Array.isArray(rolePerms)) {
		return;
	}
	for (const permission of rolePerms) {
		if (typeof permission === 'string' && permission) {
			permissions[permission] = true;
		}
	}
}

/**
 * Get permissions for a user based on their roles
 *
 * @param roles - User's role names
 * @param rolePermissions - Mapping of role names to permission arrays
 * @returns Combined permissions object
 *
 * @example
 * ```ts
 * const rolePermissions = {
 *   editor: ['article:read', 'article:write'],
 *   admin: ['article:read', 'article:write', 'article:delete', 'user:admin'],
 * };
 *
 * const userRoles = ['editor'];
 * const perms = getPermissionsFromRoles(userRoles, rolePermissions);
 * // => { 'article:read': true, 'article:write': true }
 *
 * const adminRoles = ['editor', 'admin'];
 * const adminPerms = getPermissionsFromRoles(adminRoles, rolePermissions);
 * // => { 'article:read': true, 'article:write': true, 'article:delete': true, 'user:admin': true }
 * ```
 */
export function getPermissionsFromRoles(
	roles: string[],
	rolePermissions: PermissionRoles | null | undefined
): Permissions {
	if (!Array.isArray(roles)) {
		return {};
	}
	if (!rolePermissions) {
		return {};
	}

	const permissions: Permissions = {};

	for (const role of roles) {
		addRolePermissions(permissions, role, rolePermissions);
	}

	return permissions;
}

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
