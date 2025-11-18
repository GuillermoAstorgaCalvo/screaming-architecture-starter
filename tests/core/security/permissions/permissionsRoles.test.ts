import { getPermissionsFromRoles } from '@core/security/permissions/permissionsRoles';
import type { PermissionRoles } from '@core/security/permissions/permissionsTypes';
import { describe, expect, it } from 'vitest';

const PERM_ARTICLE_READ = 'article:read';
const PERM_ARTICLE_WRITE = 'article:write';

describe('getPermissionsFromRoles - basic functionality', () => {
	it('returns permissions for a single role', () => {
		const rolePermissions: PermissionRoles = {
			editor: [PERM_ARTICLE_READ, PERM_ARTICLE_WRITE],
		};

		const permissions = getPermissionsFromRoles(['editor'], rolePermissions);

		expect(permissions).toEqual({
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: true,
		});
	});

	it('combines permissions from multiple roles', () => {
		const rolePermissions: PermissionRoles = {
			editor: [PERM_ARTICLE_READ, PERM_ARTICLE_WRITE],
			admin: ['article:delete', 'user:admin'],
		};

		const permissions = getPermissionsFromRoles(['editor', 'admin'], rolePermissions);

		expect(permissions).toEqual({
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: true,
			'article:delete': true,
			'user:admin': true,
		});
	});

	it('handles overlapping permissions across roles', () => {
		const rolePermissions: PermissionRoles = {
			editor: [PERM_ARTICLE_READ, PERM_ARTICLE_WRITE],
			reviewer: [PERM_ARTICLE_READ, 'article:review'],
		};

		const permissions = getPermissionsFromRoles(['editor', 'reviewer'], rolePermissions);

		expect(permissions).toEqual({
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: true,
			'article:review': true,
		});
	});
});

describe('getPermissionsFromRoles - empty and null inputs', () => {
	it('returns empty object when roles array is empty', () => {
		const rolePermissions: PermissionRoles = {
			editor: [PERM_ARTICLE_READ],
		};

		const permissions = getPermissionsFromRoles([], rolePermissions);

		expect(permissions).toEqual({});
	});

	it('returns empty object when rolePermissions is null', () => {
		const permissions = getPermissionsFromRoles(['editor'], null);

		expect(permissions).toEqual({});
	});

	it('returns empty object when rolePermissions is undefined', () => {
		const permissions = getPermissionsFromRoles(['editor'], undefined);

		expect(permissions).toEqual({});
	});
});

describe('getPermissionsFromRoles - invalid input handling', () => {
	it('returns empty object when roles is not an array', () => {
		const rolePermissions: PermissionRoles = {
			editor: [PERM_ARTICLE_READ],
		};

		// @ts-expect-error - testing invalid input
		expect(getPermissionsFromRoles(null, rolePermissions)).toEqual({});
		// @ts-expect-error - testing invalid input
		expect(getPermissionsFromRoles(undefined, rolePermissions)).toEqual({});
		// @ts-expect-error - testing invalid input
		expect(getPermissionsFromRoles('editor', rolePermissions)).toEqual({});
	});

	it('ignores roles that do not exist in rolePermissions', () => {
		const rolePermissions: PermissionRoles = {
			editor: [PERM_ARTICLE_READ],
		};

		const permissions = getPermissionsFromRoles(['editor', 'nonexistent'], rolePermissions);

		expect(permissions).toEqual({
			[PERM_ARTICLE_READ]: true,
		});
	});

	it('handles roles with empty permission arrays', () => {
		const rolePermissions: PermissionRoles = {
			editor: [PERM_ARTICLE_READ],
			guest: [],
		};

		const permissions = getPermissionsFromRoles(['editor', 'guest'], rolePermissions);

		expect(permissions).toEqual({
			[PERM_ARTICLE_READ]: true,
		});
	});

	it('handles roles with invalid permission arrays', () => {
		const rolePermissions: PermissionRoles = {
			editor: [PERM_ARTICLE_READ],
			// @ts-expect-error - testing invalid input
			invalid: null,
			// @ts-expect-error - testing invalid input
			invalid2: undefined,
		};

		const permissions = getPermissionsFromRoles(['editor', 'invalid', 'invalid2'], rolePermissions);

		expect(permissions).toEqual({
			[PERM_ARTICLE_READ]: true,
		});
	});

	it('filters out invalid permission strings', () => {
		const rolePermissions: PermissionRoles = {
			editor: [
				PERM_ARTICLE_READ,
				'', // empty string
				PERM_ARTICLE_WRITE,
				// @ts-expect-error - testing invalid input
				null,
				// @ts-expect-error - testing invalid input
				undefined,
			],
		};

		const permissions = getPermissionsFromRoles(['editor'], rolePermissions);

		expect(permissions).toEqual({
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: true,
		});
	});
});

describe('getPermissionsFromRoles - edge cases', () => {
	it('handles duplicate roles in array', () => {
		const rolePermissions: PermissionRoles = {
			editor: [PERM_ARTICLE_READ, PERM_ARTICLE_WRITE],
		};

		const permissions = getPermissionsFromRoles(['editor', 'editor'], rolePermissions);

		expect(permissions).toEqual({
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: true,
		});
	});

	it('handles duplicate permissions within a role', () => {
		const rolePermissions: PermissionRoles = {
			editor: [PERM_ARTICLE_READ, PERM_ARTICLE_READ, PERM_ARTICLE_WRITE],
		};

		const permissions = getPermissionsFromRoles(['editor'], rolePermissions);

		expect(permissions).toEqual({
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: true,
		});
	});

	it('handles roles with special characters', () => {
		const rolePermissions: PermissionRoles = {
			'role:admin': [PERM_ARTICLE_READ],
			'role:editor': [PERM_ARTICLE_WRITE],
		};

		const permissions = getPermissionsFromRoles(['role:admin', 'role:editor'], rolePermissions);

		expect(permissions).toEqual({
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: true,
		});
	});

	it('handles empty role names', () => {
		const rolePermissions: PermissionRoles = {
			'': [PERM_ARTICLE_READ],
			editor: [PERM_ARTICLE_WRITE],
		};

		const permissions = getPermissionsFromRoles(['', 'editor'], rolePermissions);

		expect(permissions).toEqual({
			[PERM_ARTICLE_WRITE]: true,
		});
	});

	it('handles non-string role names', () => {
		const rolePermissions: PermissionRoles = {
			editor: [PERM_ARTICLE_READ],
		};

		const permissions = getPermissionsFromRoles(
			// @ts-expect-error - testing invalid input
			['editor', null, undefined, 123],
			rolePermissions
		);

		expect(permissions).toEqual({
			[PERM_ARTICLE_READ]: true,
		});
	});
});

describe('getPermissionsFromRoles - performance and complex scenarios', () => {
	it('handles large number of roles', () => {
		const rolePermissions: PermissionRoles = {};
		const roles: string[] = [];

		for (let i = 0; i < 100; i++) {
			const role = `role${i}`;
			roles.push(role);
			rolePermissions[role] = [`permission:${i}`];
		}

		const permissions = getPermissionsFromRoles(roles, rolePermissions);

		expect(Object.keys(permissions).length).toBe(100);
		for (let i = 0; i < 100; i++) {
			expect(permissions[`permission:${i}`]).toBe(true);
		}
	});

	it('handles complex real-world scenario', () => {
		const rolePermissions: PermissionRoles = {
			editor: [PERM_ARTICLE_READ, PERM_ARTICLE_WRITE, 'article:edit'],
			reviewer: [PERM_ARTICLE_READ, 'article:review', 'article:approve'],
			admin: ['article:*', 'user:admin', 'settings:*'],
		};

		const permissions = getPermissionsFromRoles(['editor', 'reviewer', 'admin'], rolePermissions);

		expect(permissions).toEqual({
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: true,
			'article:edit': true,
			'article:review': true,
			'article:approve': true,
			'article:*': true,
			'user:admin': true,
			'settings:*': true,
		});
	});
});
