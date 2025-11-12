/**
 * Role-Based Permissions
 *
 * Provides utilities for managing permissions based on user roles.
 */

import type { PermissionRoles, Permissions } from './permissionsTypes';

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
