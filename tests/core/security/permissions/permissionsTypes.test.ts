import type {
	PermissionCheckResult,
	PermissionRoles,
	Permissions,
} from '@core/security/permissions/permissionsTypes';
import { describe, expect, it } from 'vitest';

const PERM_ARTICLE_READ = 'article:read';
const PERM_ARTICLE_WRITE = 'article:write';
const PERM_ARTICLE_DELETE = 'article:delete';
const PERM_ARTICLE_ALL = 'article:*';
const PERM_USER_ADMIN = 'user:admin';

describe('Permissions type', () => {
	it('accepts valid permissions object', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: false,
			[PERM_USER_ADMIN]: true,
		};

		expect(permissions).toBeDefined();
		expect(typeof permissions[PERM_ARTICLE_READ]).toBe('boolean');
	});

	it('allows empty permissions object', () => {
		const permissions: Permissions = {};

		expect(permissions).toEqual({});
	});

	it('allows permissions with various string keys', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
			[PERM_USER_ADMIN]: true,
			'settings:write': true,
			'resource:action:scope': true,
		};

		expect(Object.keys(permissions).length).toBe(4);
	});

	it('allows boolean values for permissions', () => {
		const permissions: Permissions = {
			permission1: true,
			permission2: false,
		};

		expect(permissions.permission1).toBe(true);
		expect(permissions.permission2).toBe(false);
	});
});

describe('PermissionCheckResult type', () => {
	it('accepts result with allowed flag', () => {
		const result: PermissionCheckResult = {
			allowed: true,
		};

		expect(result.allowed).toBe(true);
	});

	it('accepts result with missing permissions', () => {
		const result: PermissionCheckResult = {
			allowed: false,
			missing: [PERM_ARTICLE_WRITE, PERM_ARTICLE_DELETE],
		};

		expect(result.allowed).toBe(false);
		expect(result.missing).toEqual([PERM_ARTICLE_WRITE, PERM_ARTICLE_DELETE]);
	});

	it('accepts result with reason', () => {
		const result: PermissionCheckResult = {
			allowed: false,
			reason: 'Insufficient permissions',
		};

		expect(result.allowed).toBe(false);
		expect(result.reason).toBe('Insufficient permissions');
	});

	it('accepts complete result with all fields', () => {
		const result: PermissionCheckResult = {
			allowed: false,
			missing: [PERM_ARTICLE_WRITE],
			reason: `Missing required permissions: ${PERM_ARTICLE_WRITE}`,
		};

		expect(result.allowed).toBe(false);
		expect(result.missing).toEqual([PERM_ARTICLE_WRITE]);
		expect(result.reason).toBe(`Missing required permissions: ${PERM_ARTICLE_WRITE}`);
	});

	it('allows empty missing array', () => {
		const result: PermissionCheckResult = {
			allowed: false,
			missing: [],
		};

		expect(result.missing).toEqual([]);
		expect(result.allowed).toBe(false);
	});
});

describe('PermissionRoles type', () => {
	it('accepts valid role permissions mapping', () => {
		const rolePermissions: PermissionRoles = {
			editor: [PERM_ARTICLE_READ, PERM_ARTICLE_WRITE],
			admin: [PERM_ARTICLE_ALL, PERM_USER_ADMIN],
		};

		expect(rolePermissions.editor).toEqual([PERM_ARTICLE_READ, PERM_ARTICLE_WRITE]);
		expect(rolePermissions.admin).toEqual([PERM_ARTICLE_ALL, PERM_USER_ADMIN]);
	});

	it('allows empty role permissions object', () => {
		const rolePermissions: PermissionRoles = {};

		expect(rolePermissions).toEqual({});
	});

	it('allows roles with empty permission arrays', () => {
		const rolePermissions: PermissionRoles = {
			guest: [],
			editor: [PERM_ARTICLE_READ],
		};

		expect(rolePermissions.guest).toEqual([]);
		expect(rolePermissions.editor).toEqual([PERM_ARTICLE_READ]);
	});

	it('allows roles with single permission', () => {
		const rolePermissions: PermissionRoles = {
			viewer: [PERM_ARTICLE_READ],
		};

		expect(rolePermissions.viewer).toEqual([PERM_ARTICLE_READ]);
	});

	it('allows roles with many permissions', () => {
		const rolePermissions: PermissionRoles = {
			admin: [
				PERM_ARTICLE_READ,
				PERM_ARTICLE_WRITE,
				PERM_ARTICLE_DELETE,
				PERM_USER_ADMIN,
				'settings:read',
				'settings:write',
			],
		};

		const adminPerms = rolePermissions.admin;
		expect(adminPerms?.length).toBe(6);
	});

	it('allows roles with special characters in names', () => {
		const rolePermissions: PermissionRoles = {
			'role:admin': [PERM_ARTICLE_READ],
			'role:editor': [PERM_ARTICLE_WRITE],
		};

		expect(rolePermissions['role:admin']).toEqual([PERM_ARTICLE_READ]);
		expect(rolePermissions['role:editor']).toEqual([PERM_ARTICLE_WRITE]);
	});
});

describe('Type compatibility', () => {
	it('allows Permissions to be used as Record<string, boolean>', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
		};

		const record: Record<string, boolean> = permissions;

		expect(record[PERM_ARTICLE_READ]).toBe(true);
	});

	it('allows PermissionRoles to be used as Record<string, string[]>', () => {
		const rolePermissions: PermissionRoles = {
			editor: [PERM_ARTICLE_READ],
		};

		const record: Record<string, string[]> = rolePermissions;

		expect(record.editor).toEqual([PERM_ARTICLE_READ]);
		expect(record).toBeDefined();
	});
});
