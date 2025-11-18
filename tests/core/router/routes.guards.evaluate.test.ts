import {
	authenticatedGuard,
	createPermissionGuard,
	evaluateRouteGuards,
	guestGuard,
	type RouteGuard,
	RouteGuardReason,
} from '@core/router/routes.guards';
import { describe, expect, it } from 'vitest';

import {
	createAuthenticatedContext,
	createPermissionsContext,
	createUnauthenticatedContext,
} from './routes.guards.test';

const READ_ARTICLES_PERMISSION = 'read:articles';

describe('routes.guards - evaluateRouteGuards - empty and undefined guards', () => {
	it('should allow access when guards array is empty', () => {
		const context = createAuthenticatedContext();
		const result = evaluateRouteGuards([], context);

		expect(result).toEqual({
			allowed: true,
			result: {
				allowed: true,
			},
		});
	});

	it('should allow access when guards is undefined', () => {
		const context = createAuthenticatedContext();
		const result = evaluateRouteGuards(undefined, context);

		expect(result).toEqual({
			allowed: true,
			result: {
				allowed: true,
			},
		});
	});

	it('should allow access when guards is null (treated as empty)', () => {
		const context = createAuthenticatedContext();
		// @ts-expect-error - testing null input
		const result = evaluateRouteGuards(null, context);

		expect(result).toEqual({
			allowed: true,
			result: {
				allowed: true,
			},
		});
	});
});

describe('routes.guards - evaluateRouteGuards - single guard', () => {
	it('should allow access when single guard allows', () => {
		const guard: RouteGuard = () => ({ allowed: true });
		const context = createAuthenticatedContext();
		const result = evaluateRouteGuards([guard], context);

		expect(result).toEqual({
			allowed: true,
			result: {
				allowed: true,
			},
		});
		expect(result.failedGuard).toBeUndefined();
	});

	it('should deny access when single guard denies', () => {
		const guard: RouteGuard = () => ({
			allowed: false,
			reason: 'TEST_REASON',
		});
		const context = createAuthenticatedContext();
		const result = evaluateRouteGuards([guard], context);

		expect(result).toEqual({
			allowed: false,
			result: {
				allowed: false,
				reason: 'TEST_REASON',
			},
			failedGuard: guard,
		});
	});
});

describe('routes.guards - evaluateRouteGuards - multiple guards', () => {
	it('should allow access when all guards allow', () => {
		const guard1: RouteGuard = () => ({ allowed: true });
		const guard2: RouteGuard = () => ({ allowed: true });
		const guard3: RouteGuard = () => ({ allowed: true });
		const context = createAuthenticatedContext();
		const result = evaluateRouteGuards([guard1, guard2, guard3], context);

		expect(result).toEqual({
			allowed: true,
			result: {
				allowed: true,
			},
		});
		expect(result.failedGuard).toBeUndefined();
	});
});

describe('routes.guards - evaluateRouteGuards - multiple guards - guard denial positions', () => {
	it('should deny access when first guard denies', () => {
		const guard1: RouteGuard = () => ({
			allowed: false,
			reason: 'FIRST_GUARD_DENIED',
		});
		const guard2: RouteGuard = () => ({ allowed: true });
		const guard3: RouteGuard = () => ({ allowed: true });
		const context = createAuthenticatedContext();
		const result = evaluateRouteGuards([guard1, guard2, guard3], context);

		expect(result).toEqual({
			allowed: false,
			result: {
				allowed: false,
				reason: 'FIRST_GUARD_DENIED',
			},
			failedGuard: guard1,
		});
	});

	it('should deny access when middle guard denies', () => {
		const guard1: RouteGuard = () => ({ allowed: true });
		const guard2: RouteGuard = () => ({
			allowed: false,
			reason: 'MIDDLE_GUARD_DENIED',
		});
		const guard3: RouteGuard = () => ({ allowed: true });
		const context = createAuthenticatedContext();
		const result = evaluateRouteGuards([guard1, guard2, guard3], context);

		expect(result).toEqual({
			allowed: false,
			result: {
				allowed: false,
				reason: 'MIDDLE_GUARD_DENIED',
			},
			failedGuard: guard2,
		});
	});

	it('should deny access when last guard denies', () => {
		const guard1: RouteGuard = () => ({ allowed: true });
		const guard2: RouteGuard = () => ({ allowed: true });
		const guard3: RouteGuard = () => ({
			allowed: false,
			reason: 'LAST_GUARD_DENIED',
		});
		const context = createAuthenticatedContext();
		const result = evaluateRouteGuards([guard1, guard2, guard3], context);

		expect(result).toEqual({
			allowed: false,
			result: {
				allowed: false,
				reason: 'LAST_GUARD_DENIED',
			},
			failedGuard: guard3,
		});
	});
});

describe('routes.guards - evaluateRouteGuards - multiple guards - early termination', () => {
	it('should stop evaluation after first guard denies', () => {
		let guard2Called = false;
		const guard1: RouteGuard = () => ({
			allowed: false,
			reason: 'FIRST_GUARD_DENIED',
		});
		const guard2: RouteGuard = () => {
			guard2Called = true;
			return { allowed: true };
		};
		const context = createAuthenticatedContext();
		evaluateRouteGuards([guard1, guard2], context);

		expect(guard2Called).toBe(false);
	});
});

describe('routes.guards - evaluateRouteGuards - guard result normalization', () => {
	describe('void and allowed results', () => {
		it('should treat void return as allowed', () => {
			const guard: RouteGuard = () => {
				// Return void (undefined)
			};
			const context = createAuthenticatedContext();
			const result = evaluateRouteGuards([guard], context);

			expect(result).toEqual({
				allowed: true,
				result: {
					allowed: true,
				},
			});
		});

		it('should normalize result with allowed=true but no reason', () => {
			const guard: RouteGuard = () => ({
				allowed: true,
			});
			const context = createAuthenticatedContext();
			const result = evaluateRouteGuards([guard], context);

			expect(result).toEqual({
				allowed: true,
				result: {
					allowed: true,
				},
			});
		});
	});
});

describe('routes.guards - evaluateRouteGuards - guard result normalization - denied results', () => {
	describe('denied result properties', () => {
		it('should preserve reason in denied result', () => {
			const guard: RouteGuard = () => ({
				allowed: false,
				reason: 'CUSTOM_REASON',
			});
			const context = createAuthenticatedContext();
			const result = evaluateRouteGuards([guard], context);

			expect(result.result.reason).toBe('CUSTOM_REASON');
		});

		it('should preserve missingPermissions in denied result', () => {
			const guard: RouteGuard = () => ({
				allowed: false,
				reason: 'MISSING_PERMS',
				missingPermissions: ['perm1', 'perm2'],
			});
			const context = createAuthenticatedContext();
			const result = evaluateRouteGuards([guard], context);

			expect(result.result.missingPermissions).toEqual(['perm1', 'perm2']);
		});
	});

	describe('missingPermissions normalization', () => {
		it('should normalize missingPermissions array', () => {
			const guard: RouteGuard = () => ({
				allowed: false,
				reason: 'MISSING_PERMS',
				missingPermissions: ['perm1', 'perm1', '  perm2  ', ''],
			});
			const context = createAuthenticatedContext();
			const result = evaluateRouteGuards([guard], context);

			expect(result.result.missingPermissions).toEqual(['perm1', 'perm2']);
		});

		it('should remove empty missingPermissions array', () => {
			const guard: RouteGuard = () => ({
				allowed: false,
				reason: 'CUSTOM_REASON',
				missingPermissions: [],
			});
			const context = createAuthenticatedContext();
			const result = evaluateRouteGuards([guard], context);

			expect(result.result.missingPermissions).toBeUndefined();
		});
	});
});

describe('routes.guards - evaluateRouteGuards - guard result normalization - type conversion', () => {
	describe('boolean conversion', () => {
		it('should convert truthy allowed to boolean true', () => {
			const guard: RouteGuard = () => ({
				// @ts-expect-error - testing truthy conversion
				allowed: 1,
			});
			const context = createAuthenticatedContext();
			const result = evaluateRouteGuards([guard], context);

			expect(result.result.allowed).toBe(true);
		});

		it('should convert falsy allowed to boolean false', () => {
			const guard: RouteGuard = () => ({
				// @ts-expect-error - testing falsy conversion
				allowed: 0,
			});
			const context = createAuthenticatedContext();
			const result = evaluateRouteGuards([guard], context);

			expect(result.result.allowed).toBe(false);
		});
	});

	describe('result immutability', () => {
		it('should return frozen result objects', () => {
			const guard: RouteGuard = () => ({
				allowed: false,
				reason: 'TEST',
				missingPermissions: ['perm1'],
			});
			const context = createAuthenticatedContext();
			const result = evaluateRouteGuards([guard], context);

			expect(Object.isFrozen(result.result)).toBe(true);
			if (result.result.missingPermissions) {
				expect(Object.isFrozen(result.result.missingPermissions)).toBe(true);
			}
		});
	});
});

describe('routes.guards - evaluateRouteGuards - integration with built-in guards', () => {
	describe('single guard evaluation', () => {
		it('should evaluate authenticatedGuard correctly', () => {
			const context = createAuthenticatedContext();
			const result = evaluateRouteGuards([authenticatedGuard], context);

			expect(result.allowed).toBe(true);
		});

		it('should evaluate guestGuard correctly', () => {
			const context = createUnauthenticatedContext();
			const result = evaluateRouteGuards([guestGuard], context);

			expect(result.allowed).toBe(true);
		});

		it('should evaluate permission guard correctly', () => {
			const guard = createPermissionGuard([READ_ARTICLES_PERMISSION]);
			const context = createPermissionsContext({
				[READ_ARTICLES_PERMISSION]: true,
			});
			const result = evaluateRouteGuards([guard], context);

			expect(result.allowed).toBe(true);
		});
	});

	describe('multiple guards evaluation', () => {
		it('should evaluate multiple built-in guards in sequence', () => {
			const permissionGuard = createPermissionGuard([READ_ARTICLES_PERMISSION]);
			const context = createPermissionsContext({
				[READ_ARTICLES_PERMISSION]: true,
			});
			const result = evaluateRouteGuards([authenticatedGuard, permissionGuard], context);

			expect(result.allowed).toBe(true);
		});

		it('should fail when authenticatedGuard denies in multi-guard evaluation', () => {
			const permissionGuard = createPermissionGuard([READ_ARTICLES_PERMISSION]);
			const context = createUnauthenticatedContext({
				permissions: {
					[READ_ARTICLES_PERMISSION]: true,
				},
			});
			const result = evaluateRouteGuards([authenticatedGuard, permissionGuard], context);

			expect(result.allowed).toBe(false);
			expect(result.result.reason).toBe(RouteGuardReason.NotAuthenticated);
			expect(result.failedGuard).toBe(authenticatedGuard);
		});

		it('should fail when permission guard denies in multi-guard evaluation', () => {
			const permissionGuard = createPermissionGuard([READ_ARTICLES_PERMISSION, 'write:articles']);
			const context = createPermissionsContext({
				[READ_ARTICLES_PERMISSION]: true,
				'write:articles': false,
			});
			const result = evaluateRouteGuards([authenticatedGuard, permissionGuard], context);

			expect(result.allowed).toBe(false);
			expect(result.result.reason).toBe(RouteGuardReason.MissingPermissions);
			expect(result.result.missingPermissions).toEqual(['write:articles']);
			expect(result.failedGuard).toBe(permissionGuard);
		});
	});
});
