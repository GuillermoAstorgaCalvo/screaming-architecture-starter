import {
	filterPermissions,
	mergePermissions,
} from '@core/security/permissions/permissionsManipulate';
import type { Permissions } from '@core/security/permissions/permissionsTypes';
import { describe, expect, it } from 'vitest';

const PERM_ARTICLE_READ = 'article:read';
const PERM_ARTICLE_WRITE = 'article:write';

describe('mergePermissions - basic merging', () => {
	it('merges multiple permission objects', () => {
		const basePerms: Permissions = {
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: false,
		};
		const additionalPerms: Permissions = {
			[PERM_ARTICLE_WRITE]: true,
			'user:admin': true,
		};

		const merged = mergePermissions([basePerms, additionalPerms]);

		expect(merged).toEqual({
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: true,
			'user:admin': true,
		});
	});

	it('later permissions override earlier ones', () => {
		const first: Permissions = {
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: true,
		};
		const second: Permissions = {
			[PERM_ARTICLE_READ]: false,
		};

		const merged = mergePermissions([first, second]);

		expect(merged).toEqual({
			[PERM_ARTICLE_READ]: false,
			[PERM_ARTICLE_WRITE]: true,
		});
	});

	it('handles three or more permission objects', () => {
		const first: Permissions = {
			[PERM_ARTICLE_READ]: true,
		};
		const second: Permissions = {
			[PERM_ARTICLE_WRITE]: true,
		};
		const third: Permissions = {
			'article:delete': true,
			[PERM_ARTICLE_READ]: false,
		};

		const merged = mergePermissions([first, second, third]);

		expect(merged).toEqual({
			[PERM_ARTICLE_READ]: false,
			[PERM_ARTICLE_WRITE]: true,
			'article:delete': true,
		});
	});
});

describe('mergePermissions - edge cases', () => {
	it('handles empty array', () => {
		const merged = mergePermissions([]);

		expect(merged).toEqual({});
	});

	it('handles null values in array', () => {
		const perms: Permissions = {
			[PERM_ARTICLE_READ]: true,
		};

		const merged = mergePermissions([perms, null, undefined]);

		expect(merged).toEqual({
			[PERM_ARTICLE_READ]: true,
		});
	});

	it('handles all null values', () => {
		const merged = mergePermissions([null, undefined, null]);

		expect(merged).toEqual({});
	});

	it('handles single permission object', () => {
		const perms: Permissions = {
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: true,
		};

		const merged = mergePermissions([perms]);

		expect(merged).toEqual(perms);
	});

	it('handles empty permission objects', () => {
		const empty1: Permissions = {};
		const empty2: Permissions = {};
		const perms: Permissions = {
			[PERM_ARTICLE_READ]: true,
		};

		const merged = mergePermissions([empty1, empty2, perms]);

		expect(merged).toEqual({
			[PERM_ARTICLE_READ]: true,
		});
	});
});

describe('mergePermissions - invalid input', () => {
	it('handles non-array input', () => {
		// @ts-expect-error - testing invalid input
		expect(mergePermissions(null)).toEqual({});
		// @ts-expect-error - testing invalid input
		expect(mergePermissions(undefined)).toEqual({});
		// @ts-expect-error - testing invalid input
		expect(mergePermissions('not-an-array')).toEqual({});
	});
});

describe('mergePermissions - large scale', () => {
	it('handles large number of permission objects', () => {
		const objects: Permissions[] = [];
		for (let i = 0; i < 100; i++) {
			objects.push({
				[`permission:${i}`]: true,
			});
		}

		const merged = mergePermissions(objects);

		expect(Object.keys(merged).length).toBe(100);
		for (let i = 0; i < 100; i++) {
			expect(merged[`permission:${i}`]).toBe(true);
		}
	});
});

describe('filterPermissions - basic filtering', () => {
	it('filters permissions to only include allowed list', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: true,
			'user:admin': true,
		};

		const filtered = filterPermissions(permissions, [PERM_ARTICLE_READ, PERM_ARTICLE_WRITE]);

		expect(filtered).toEqual({
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: true,
		});
	});

	it('excludes permissions not in allowed list', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: true,
			'user:admin': true,
		};

		const filtered = filterPermissions(permissions, [PERM_ARTICLE_READ]);

		expect(filtered).toEqual({
			[PERM_ARTICLE_READ]: true,
		});
	});

	it('only includes permissions that are true', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: false,
			'article:delete': true,
		};

		const filtered = filterPermissions(permissions, [
			PERM_ARTICLE_READ,
			PERM_ARTICLE_WRITE,
			'article:delete',
		]);

		expect(filtered).toEqual({
			[PERM_ARTICLE_READ]: true,
			'article:delete': true,
		});
	});

	it('handles permissions with special characters in keys', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: true,
			'user:admin:full': true,
		};

		const filtered = filterPermissions(permissions, [PERM_ARTICLE_READ, 'user:admin:full']);

		expect(filtered).toEqual({
			[PERM_ARTICLE_READ]: true,
			'user:admin:full': true,
		});
	});
});

describe('filterPermissions - edge cases', () => {
	it('returns empty object when no permissions match', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
		};

		const filtered = filterPermissions(permissions, [PERM_ARTICLE_WRITE, 'article:delete']);

		expect(filtered).toEqual({});
	});

	it('returns empty object when permissions is null', () => {
		const filtered = filterPermissions(null, [PERM_ARTICLE_READ]);

		expect(filtered).toEqual({});
	});

	it('returns empty object when permissions is undefined', () => {
		const filtered = filterPermissions(undefined, [PERM_ARTICLE_READ]);

		expect(filtered).toEqual({});
	});

	it('handles empty allowed list', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: true,
		};

		const filtered = filterPermissions(permissions, []);

		expect(filtered).toEqual({});
	});

	it('handles empty permissions object', () => {
		const permissions: Permissions = {};

		const filtered = filterPermissions(permissions, [PERM_ARTICLE_READ, PERM_ARTICLE_WRITE]);

		expect(filtered).toEqual({});
	});
});

describe('filterPermissions - invalid input', () => {
	it('returns empty object when allowedList is not an array', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
		};

		// @ts-expect-error - testing invalid input
		expect(filterPermissions(permissions, null)).toEqual({});
		// @ts-expect-error - testing invalid input
		expect(filterPermissions(permissions, undefined)).toEqual({});
		// @ts-expect-error - testing invalid input
		expect(filterPermissions(permissions, PERM_ARTICLE_READ)).toEqual({});
	});

	it('filters out invalid permission strings in allowed list', () => {
		const permissions: Permissions = {
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: true,
		};

		const filtered = filterPermissions(permissions, [
			PERM_ARTICLE_READ,
			'', // empty string
			PERM_ARTICLE_WRITE,
			// @ts-expect-error - testing invalid input
			null,
			// @ts-expect-error - testing invalid input
			undefined,
		]);

		expect(filtered).toEqual({
			[PERM_ARTICLE_READ]: true,
			[PERM_ARTICLE_WRITE]: true,
		});
	});
});

describe('filterPermissions - large scale', () => {
	it('handles large allowed list', () => {
		const permissions: Permissions = {};
		const allowedList: string[] = [];

		for (let i = 0; i < 100; i++) {
			const perm = `permission:${i}`;
			permissions[perm] = i % 2 === 0; // every other one is true
			allowedList.push(perm);
		}

		const filtered = filterPermissions(permissions, allowedList);

		expect(Object.keys(filtered).length).toBe(50); // only true permissions
		for (let i = 0; i < 100; i += 2) {
			expect(filtered[`permission:${i}`]).toBe(true);
		}
	});
});
