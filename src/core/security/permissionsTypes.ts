/**
 * Permission Model Types
 *
 * Type definitions for the permission system.
 */

/**
 * Permission object type
 * Maps permission strings to boolean values
 */
export type Permissions = Record<string, boolean>;

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
 * Permission role definition
 * Maps role names to their associated permissions
 */
export type PermissionRoles = Record<string, string[]>;
