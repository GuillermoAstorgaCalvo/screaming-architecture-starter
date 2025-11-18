import {
	hasAllPermissions,
	hasAnyPermission,
	hasPermission,
} from '@core/security/permissions/permissionsCheck';
import type { Permissions } from '@core/security/permissions/permissionsTypes';
import { describe, expect, it } from 'vitest';

const PERM_ARTICLE_READ = 'article:read';
const PERM_ARTICLE_WRITE = 'article:write';
const PERM_ARTICLE_DELETE = 'article:delete';
const PERM_NULL = null;
const PERM_UNDEFINED = undefined;

const TEST_DESC_RETURNS_FALSE_WHEN_NULL = 'returns false when permissions is null';
const TEST_DESC_RETURNS_FALSE_WHEN_UNDEFINED = 'returns false when permissions is undefined';

describe('hasPermission', () => {
	it('returns true when permission exists and is true', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: false,
		};

		expect(hasPermission(permissions, PERM_ARTICLE_READ)).toBe(true);
	});

	it('returns false when permission exists but is false', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: false,
		};

		expect(hasPermission(permissions, PERM_ARTICLE_WRITE)).toBe(false);
	});

	it('returns false when permission does not exist', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
		};

		expect(hasPermission(permissions, PERM_ARTICLE_DELETE)).toBe(false);
	});

	it(TEST_DESC_RETURNS_FALSE_WHEN_NULL, () => {
		expect(hasPermission(PERM_NULL, PERM_ARTICLE_READ)).toBe(false);
	});

	it(TEST_DESC_RETURNS_FALSE_WHEN_UNDEFINED, () => {
		expect(hasPermission(PERM_UNDEFINED, PERM_ARTICLE_READ)).toBe(false);
	});

	it('returns false when permission is empty string', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
		};

		expect(hasPermission(permissions, '')).toBe(false);
	});

	it('returns false when permission is not a string', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
		};

		// @ts-expect-error - testing invalid input
		expect(hasPermission(permissions, PERM_NULL)).toBe(false);
		// @ts-expect-error - testing invalid input
		expect(hasPermission(permissions, PERM_UNDEFINED)).toBe(false);
		// @ts-expect-error - testing invalid input
		expect(hasPermission(permissions, 123)).toBe(false);
	});

	it('handles empty permissions object', () => {
		const permissions: Permissions = {};

		expect(hasPermission(permissions, PERM_ARTICLE_READ)).toBe(false);
	});

	it('handles permissions with various string keys', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
			'user:admin': true,
			'settings:write': true,
		};

		expect(hasPermission(permissions, PERM_ARTICLE_READ)).toBe(true);
		expect(hasPermission(permissions, 'user:admin')).toBe(true);
		expect(hasPermission(permissions, 'settings:write')).toBe(true);
	});
});

describe('hasAllPermissions - basic functionality', () => {
	it('returns true when all permissions are granted', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: true,
			[PERM_ARTICLE_DELETE]: true,
		};

		expect(
			hasAllPermissions(permissions, [PERM_ARTICLE_READ, PERM_ARTICLE_WRITE, PERM_ARTICLE_DELETE])
		).toBe(true);
	});

	it('returns false when one permission is missing', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: true,
		};

		expect(
			hasAllPermissions(permissions, [PERM_ARTICLE_READ, PERM_ARTICLE_WRITE, PERM_ARTICLE_DELETE])
		).toBe(false);
	});

	it('returns false when one permission is false', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: false,
		};

		expect(hasAllPermissions(permissions, [PERM_ARTICLE_READ, PERM_ARTICLE_WRITE])).toBe(false);
	});

	it('handles single permission in array', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
		};

		expect(hasAllPermissions(permissions, [PERM_ARTICLE_READ])).toBe(true);
		expect(hasAllPermissions(permissions, [PERM_ARTICLE_WRITE])).toBe(false);
	});
});

describe('hasAllPermissions - edge cases', () => {
	it('returns true when empty array is provided', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
		};

		expect(hasAllPermissions(permissions, [])).toBe(true);
	});

	it(TEST_DESC_RETURNS_FALSE_WHEN_NULL, () => {
		expect(hasAllPermissions(PERM_NULL, [PERM_ARTICLE_READ])).toBe(false);
	});

	it(TEST_DESC_RETURNS_FALSE_WHEN_UNDEFINED, () => {
		expect(hasAllPermissions(PERM_UNDEFINED, [PERM_ARTICLE_READ])).toBe(false);
	});

	it('returns false when requiredPermissions is not an array', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
		};

		// @ts-expect-error - testing invalid input
		expect(hasAllPermissions(permissions, PERM_NULL)).toBe(false);
		// @ts-expect-error - testing invalid input
		expect(hasAllPermissions(permissions, PERM_UNDEFINED)).toBe(false);
		// @ts-expect-error - testing invalid input
		expect(hasAllPermissions(permissions, PERM_ARTICLE_READ)).toBe(false);
	});

	it('handles large permission arrays', () => {
		const permissions: Permissions = {};
		const requiredPermissions: string[] = [];

		for (let i = 0; i < 100; i++) {
			const perm = `permission:${i}`;
			permissions[perm] = true;
			requiredPermissions.push(perm);
		}

		expect(hasAllPermissions(permissions, requiredPermissions)).toBe(true);
	});
});

describe('hasAnyPermission - basic functionality', () => {
	it('returns true when at least one permission is granted', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: false,
		};

		expect(hasAnyPermission(permissions, [PERM_ARTICLE_READ, PERM_ARTICLE_WRITE])).toBe(true);
	});

	it('returns true when all permissions are granted', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: true,
		};

		expect(hasAnyPermission(permissions, [PERM_ARTICLE_READ, PERM_ARTICLE_WRITE])).toBe(true);
	});

	it('returns false when no permissions are granted', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: false,
			[PERM_ARTICLE_WRITE]: false,
		};

		expect(hasAnyPermission(permissions, [PERM_ARTICLE_READ, PERM_ARTICLE_WRITE])).toBe(false);
	});

	it('returns false when permissions do not exist', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
		};

		expect(hasAnyPermission(permissions, [PERM_ARTICLE_WRITE, PERM_ARTICLE_DELETE])).toBe(false);
	});

	it('handles single permission in array', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
		};

		expect(hasAnyPermission(permissions, [PERM_ARTICLE_READ])).toBe(true);
		expect(hasAnyPermission(permissions, [PERM_ARTICLE_WRITE])).toBe(false);
	});
});

describe('hasAnyPermission - matching behavior', () => {
	it('returns true when first permission matches', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
		};

		expect(
			hasAnyPermission(permissions, [PERM_ARTICLE_READ, PERM_ARTICLE_WRITE, PERM_ARTICLE_DELETE])
		).toBe(true);
	});

	it('returns true when last permission matches', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_DELETE]: true,
		};

		expect(
			hasAnyPermission(permissions, [PERM_ARTICLE_READ, PERM_ARTICLE_WRITE, PERM_ARTICLE_DELETE])
		).toBe(true);
	});

	it('returns true when middle permission matches', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_WRITE]: true,
		};

		expect(
			hasAnyPermission(permissions, [PERM_ARTICLE_READ, PERM_ARTICLE_WRITE, PERM_ARTICLE_DELETE])
		).toBe(true);
	});
});

describe('hasAnyPermission - edge cases', () => {
	it('returns false when empty array is provided', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
		};

		expect(hasAnyPermission(permissions, [])).toBe(false);
	});

	it(TEST_DESC_RETURNS_FALSE_WHEN_NULL, () => {
		expect(hasAnyPermission(PERM_NULL, [PERM_ARTICLE_READ])).toBe(false);
	});

	it(TEST_DESC_RETURNS_FALSE_WHEN_UNDEFINED, () => {
		expect(hasAnyPermission(PERM_UNDEFINED, [PERM_ARTICLE_READ])).toBe(false);
	});

	it('returns false when allowedPermissions is not an array', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
		};

		// @ts-expect-error - testing invalid input
		expect(hasAnyPermission(permissions, PERM_NULL)).toBe(false);
		// @ts-expect-error - testing invalid input
		expect(hasAnyPermission(permissions, PERM_UNDEFINED)).toBe(false);
		// @ts-expect-error - testing invalid input
		expect(hasAnyPermission(permissions, PERM_ARTICLE_READ)).toBe(false);
	});
});
