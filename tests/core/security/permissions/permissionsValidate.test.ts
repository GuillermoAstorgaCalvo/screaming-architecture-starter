import type { Permissions } from '@core/security/permissions/permissionsTypes';
import { checkPermissions } from '@core/security/permissions/permissionsValidate';
import { describe, expect, it } from 'vitest';

const PERM_READ = 'article:read';
const PERM_WRITE = 'article:write';
const PERM_DELETE = 'article:delete';
const PERM_ADMIN = 'user:admin';

const PERMS_ALL = [PERM_READ, PERM_WRITE, PERM_DELETE];
const PERMS_READ_WRITE = [PERM_READ, PERM_WRITE];

describe('checkPermissions - requireAll = true (AND logic)', () => {
	describe('when all permissions are granted', () => {
		it('returns allowed: true when all permissions are granted', () => {
			const permissions: Permissions = {
				[PERM_READ]: true,
				[PERM_WRITE]: true,
				[PERM_DELETE]: true,
			};

			const result = checkPermissions(permissions, PERMS_ALL, true);

			expect(result.allowed).toBe(true);
			expect(result.missing).toBeUndefined();
			expect(result.reason).toBeUndefined();
		});
	});
});

describe('checkPermissions - requireAll = true (AND logic) - missing permissions', () => {
	it('returns allowed: false when one permission is missing', () => {
		const permissions: Permissions = {
			[PERM_READ]: true,
			[PERM_WRITE]: true,
		};

		const result = checkPermissions(permissions, PERMS_ALL, true);

		expect(result.allowed).toBe(false);
		expect(result.missing).toEqual([PERM_DELETE]);
		expect(result.reason).toContain('Missing required permissions');
	});

	it('returns allowed: false when multiple permissions are missing', () => {
		const permissions: Permissions = {
			[PERM_READ]: true,
		};

		const result = checkPermissions(permissions, PERMS_ALL, true);

		expect(result.allowed).toBe(false);
		expect(result.missing).toEqual([PERM_WRITE, PERM_DELETE]);
		expect(result.reason).toContain('Missing required permissions');
	});

	it('returns allowed: false when permission exists but is false', () => {
		const permissions: Permissions = {
			[PERM_READ]: true,
			[PERM_WRITE]: false,
		};

		const result = checkPermissions(permissions, PERMS_READ_WRITE, true);

		expect(result.allowed).toBe(false);
		expect(result.missing).toEqual([PERM_WRITE]);
	});

	it('returns allowed: false when all permissions are missing', () => {
		const permissions: Permissions = {
			[PERM_READ]: false,
		};

		const result = checkPermissions(permissions, PERMS_READ_WRITE, true);

		expect(result.allowed).toBe(false);
		expect(result.missing).toEqual([PERM_READ, PERM_WRITE]);
	});
});

describe('checkPermissions - requireAll = false (OR logic)', () => {
	it('returns allowed: true when at least one permission is granted', () => {
		const permissions: Permissions = {
			[PERM_READ]: true,
			[PERM_WRITE]: false,
		};

		const result = checkPermissions(permissions, PERMS_READ_WRITE, false);

		expect(result.allowed).toBe(true);
		expect(result.missing).toBeUndefined();
		expect(result.reason).toBeUndefined();
	});

	it('returns allowed: true when all permissions are granted', () => {
		const permissions: Permissions = {
			[PERM_READ]: true,
			[PERM_WRITE]: true,
		};

		const result = checkPermissions(permissions, PERMS_READ_WRITE, false);

		expect(result.allowed).toBe(true);
	});

	it('returns allowed: false when no permissions are granted', () => {
		const permissions: Permissions = {
			[PERM_READ]: false,
			[PERM_WRITE]: false,
		};

		const result = checkPermissions(permissions, PERMS_READ_WRITE, false);

		expect(result.allowed).toBe(false);
		expect(result.missing).toEqual([PERM_READ, PERM_WRITE]);
		expect(result.reason).toBe('None of the allowed permissions are granted');
	});

	it('returns allowed: false when permissions do not exist', () => {
		const permissions: Permissions = {
			[PERM_READ]: true,
		};

		const result = checkPermissions(permissions, [PERM_WRITE, PERM_DELETE], false);

		expect(result.allowed).toBe(false);
		expect(result.missing).toEqual([PERM_WRITE, PERM_DELETE]);
	});
});

describe('checkPermissions - default behavior', () => {
	describe('default behavior (requireAll = true)', () => {
		it('defaults to requireAll = true when not specified', () => {
			const permissions: Permissions = {
				[PERM_READ]: true,
				[PERM_WRITE]: false,
			};

			const result = checkPermissions(permissions, PERMS_READ_WRITE);

			expect(result.allowed).toBe(false);
		});

		it('returns allowed: true when all permissions granted with default', () => {
			const permissions: Permissions = {
				[PERM_READ]: true,
				[PERM_WRITE]: true,
			};

			const result = checkPermissions(permissions, PERMS_READ_WRITE);

			expect(result.allowed).toBe(true);
		});
	});
});

describe('checkPermissions - edge cases', () => {
	describe('empty permissions array', () => {
		it('returns allowed: false when requireAll = true and array is empty', () => {
			const permissions: Permissions = {
				[PERM_READ]: true,
			};

			const result = checkPermissions(permissions, [], true);

			expect(result.allowed).toBe(false);
			expect(result.reason).toBe('No permissions required');
		});

		it('returns allowed: true when requireAll = false and array is empty', () => {
			const permissions: Permissions = {
				[PERM_READ]: true,
			};

			const result = checkPermissions(permissions, [], false);

			expect(result.allowed).toBe(true);
			expect(result.reason).toBe('At least one permission required');
		});
	});

	describe('invalid inputs', () => {
		it('returns allowed: false when permissions is null', () => {
			const result = checkPermissions(null, [PERM_READ], true);

			expect(result.allowed).toBe(false);
			expect(result.reason).toBe('Invalid permissions object');
			expect(result.missing).toBeUndefined();
		});

		it('returns allowed: false when permissions is undefined', () => {
			const result = checkPermissions(undefined, [PERM_READ], true);

			expect(result.allowed).toBe(false);
			expect(result.reason).toBe('Invalid permissions object');
		});

		it('returns allowed: false when requiredPermissions is not an array', () => {
			const permissions: Permissions = {
				[PERM_READ]: true,
			};

			// @ts-expect-error - testing invalid input
			const result = checkPermissions(permissions, null, true);

			expect(result.allowed).toBe(false);
			expect(result.reason).toBe('Invalid required permissions array');
		});

		it('returns allowed: false when requiredPermissions is undefined', () => {
			const permissions: Permissions = {
				[PERM_READ]: true,
			};

			// @ts-expect-error - testing invalid input
			const result = checkPermissions(permissions, undefined, true);

			expect(result.allowed).toBe(false);
			expect(result.reason).toBe('Invalid required permissions array');
		});
	});
});

describe('checkPermissions - single permission', () => {
	it('returns allowed: true for single granted permission with requireAll = true', () => {
		const permissions: Permissions = {
			'article:read': true,
		};

		const result = checkPermissions(permissions, [PERM_READ], true);

		expect(result.allowed).toBe(true);
	});

	it('returns allowed: false for single missing permission with requireAll = true', () => {
		const permissions: Permissions = {
			[PERM_READ]: true,
		};

		const result = checkPermissions(permissions, [PERM_WRITE], true);

		expect(result.allowed).toBe(false);
		expect(result.missing).toEqual([PERM_WRITE]);
	});

	it('returns allowed: true for single granted permission with requireAll = false', () => {
		const permissions: Permissions = {
			[PERM_READ]: true,
		};

		const result = checkPermissions(permissions, [PERM_READ], false);

		expect(result.allowed).toBe(true);
	});

	it('returns allowed: false for single missing permission with requireAll = false', () => {
		const permissions: Permissions = {
			[PERM_READ]: true,
		};

		const result = checkPermissions(permissions, [PERM_WRITE], false);

		expect(result.allowed).toBe(false);
		expect(result.missing).toEqual([PERM_WRITE]);
	});
});

describe('checkPermissions - real-world scenarios', () => {
	it('handles admin checking multiple permissions', () => {
		const permissions: Permissions = {
			[PERM_READ]: true,
			[PERM_WRITE]: true,
			[PERM_DELETE]: true,
			[PERM_ADMIN]: true,
		};

		const result = checkPermissions(permissions, PERMS_ALL, true);

		expect(result.allowed).toBe(true);
	});

	it('handles editor with partial permissions', () => {
		const permissions: Permissions = {
			[PERM_READ]: true,
			[PERM_WRITE]: true,
		};

		const result = checkPermissions(permissions, PERMS_ALL, true);

		expect(result.allowed).toBe(false);
		expect(result.missing).toEqual([PERM_DELETE]);
	});

	it('handles viewer with read-only access', () => {
		const permissions: Permissions = {
			[PERM_READ]: true,
		};

		const result = checkPermissions(permissions, PERMS_READ_WRITE, false);

		expect(result.allowed).toBe(true);
	});

	it('handles role-based permission check with OR logic', () => {
		const permissions: Permissions = {
			[PERM_READ]: true,
		};

		// User needs either read OR write access
		const result = checkPermissions(permissions, PERMS_READ_WRITE, false);

		expect(result.allowed).toBe(true);
	});
});
