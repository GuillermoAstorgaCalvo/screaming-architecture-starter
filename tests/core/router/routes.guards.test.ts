import {
	authenticatedGuard,
	createPermissionGuard,
	evaluateRouteGuards,
	guestGuard,
	type RouteGuard,
	type RouteGuardContext,
	RouteGuardReason,
} from '@core/router/routes.guards';
import { describe, expect, it } from 'vitest';

// Helper functions
export function createAuthenticatedContext(
	overrides?: Partial<RouteGuardContext>
): RouteGuardContext {
	return {
		isAuthenticated: true,
		permissions: {},
		roles: [],
		...overrides,
	};
}

export function createUnauthenticatedContext(
	overrides?: Partial<RouteGuardContext>
): RouteGuardContext {
	return {
		isAuthenticated: false,
		permissions: {},
		roles: [],
		...overrides,
	};
}

export function createPermissionsContext(
	permissions: Record<string, boolean>,
	overrides?: Partial<RouteGuardContext>
): RouteGuardContext {
	return {
		isAuthenticated: true,
		permissions,
		roles: [],
		...overrides,
	};
}

describe('routes.guards - authenticatedGuard', () => {
	it('should allow access when user is authenticated', () => {
		const context = createAuthenticatedContext();
		const result = authenticatedGuard(context);

		expect(result).toEqual({
			allowed: true,
		});
	});

	it('should deny access when user is not authenticated', () => {
		const context = createUnauthenticatedContext();
		const result = authenticatedGuard(context);

		expect(result).toEqual({
			allowed: false,
			reason: RouteGuardReason.NotAuthenticated,
		});
	});

	it('should return frozen result object', () => {
		const context = createAuthenticatedContext();
		const result = authenticatedGuard(context);

		expect(Object.isFrozen(result)).toBe(true);
	});
});

describe('routes.guards - guestGuard', () => {
	it('should allow access when user is not authenticated', () => {
		const context = createUnauthenticatedContext();
		const result = guestGuard(context);

		expect(result).toEqual({
			allowed: true,
		});
	});

	it('should deny access when user is authenticated', () => {
		const context = createAuthenticatedContext();
		const result = guestGuard(context);

		expect(result).toEqual({
			allowed: false,
			reason: RouteGuardReason.AlreadyAuthenticated,
		});
	});

	it('should return frozen result object', () => {
		const context = createUnauthenticatedContext();
		const result = guestGuard(context);

		expect(Object.isFrozen(result)).toBe(true);
	});
});

describe('routes.guards - RouteGuardReason constants', () => {
	it('should have NotAuthenticated constant', () => {
		expect(RouteGuardReason.NotAuthenticated).toBe('NOT_AUTHENTICATED');
	});

	it('should have AlreadyAuthenticated constant', () => {
		expect(RouteGuardReason.AlreadyAuthenticated).toBe('ALREADY_AUTHENTICATED');
	});

	it('should have MissingPermissions constant', () => {
		expect(RouteGuardReason.MissingPermissions).toBe('MISSING_PERMISSIONS');
	});
});

describe('routes.guards - createPermissionGuard - basic permission checking', () => {
	it('should allow access when user has all required permissions (requireAll=true)', () => {
		const guard = createPermissionGuard(['read', 'write']);
		const context = createPermissionsContext({
			read: true,
			write: true,
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: true,
		});
		expect(Object.isFrozen(result)).toBe(true);
	});

	it('should deny access when user is missing any required permission (requireAll=true)', () => {
		const guard = createPermissionGuard(['read', 'write']);
		const context = createPermissionsContext({
			read: true,
			write: false,
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: false,
			reason: RouteGuardReason.MissingPermissions,
			missingPermissions: ['write'],
		});
		expect(Object.isFrozen(result)).toBe(true);
	});

	it('should allow access when user has any required permission (requireAll=false)', () => {
		const guard = createPermissionGuard(['read', 'write'], { requireAll: false });
		const context = createPermissionsContext({
			read: true,
			write: false,
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: true,
		});
	});

	it('should deny access when user has none of the required permissions (requireAll=false)', () => {
		const guard = createPermissionGuard(['read', 'write'], { requireAll: false });
		const context = createPermissionsContext({
			other: true,
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: false,
			reason: RouteGuardReason.MissingPermissions,
			missingPermissions: ['read', 'write'],
		});
	});
});

describe('routes.guards - createPermissionGuard - authentication requirements', () => {
	it('should deny access when user is not authenticated and allowGuests=false (default)', () => {
		const guard = createPermissionGuard(['read']);
		const context = createUnauthenticatedContext({
			permissions: { read: true },
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: false,
			reason: RouteGuardReason.NotAuthenticated,
		});
	});

	it('should allow access for guests when allowGuests=true and user has permissions', () => {
		const guard = createPermissionGuard(['read'], { allowGuests: true });
		const context = createUnauthenticatedContext({
			permissions: { read: true },
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: true,
		});
	});

	it('should deny access for guests when allowGuests=true but user lacks permissions', () => {
		const guard = createPermissionGuard(['read'], { allowGuests: true });
		const context = createUnauthenticatedContext({
			permissions: {},
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: false,
			reason: RouteGuardReason.MissingPermissions,
			missingPermissions: ['read'],
		});
	});
});

describe('routes.guards - createPermissionGuard - empty permissions array', () => {
	it('should allow access when permissions array is empty', () => {
		const guard = createPermissionGuard([]);
		const context = createAuthenticatedContext();

		const result = guard(context);

		expect(result).toEqual({
			allowed: true,
		});
	});

	it('should allow access for unauthenticated users when permissions array is empty', () => {
		const guard = createPermissionGuard([]);
		const context = createUnauthenticatedContext();

		const result = guard(context);

		expect(result).toEqual({
			allowed: true,
		});
	});
});

describe('routes.guards - createPermissionGuard - custom deny reason', () => {
	it('should use custom reason when provided', () => {
		const customReason = RouteGuardReason.MissingPermissions;
		const guard = createPermissionGuard(['read'], { reason: customReason });
		const context = createPermissionsContext({});

		const result = guard(context);

		expect(result).toEqual({
			allowed: false,
			reason: customReason,
			missingPermissions: ['read'],
		});
	});
});

describe('routes.guards - createPermissionGuard - permission normalization', () => {
	it('should normalize permissions with whitespace', () => {
		const guard = createPermissionGuard(['  read  ', '  write  ']);
		const context = createPermissionsContext({
			read: true,
			write: true,
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: true,
		});
	});

	it('should filter out empty permission strings', () => {
		const guard = createPermissionGuard(['read', '', '  ', 'write']);
		const context = createPermissionsContext({
			read: true,
			write: true,
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: true,
		});
	});

	it('should deduplicate permissions', () => {
		const guard = createPermissionGuard(['read', 'read', 'write', 'write']);
		const context = createPermissionsContext({
			read: true,
			write: true,
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: true,
		});
	});
});

describe('routes.guards - createPermissionGuard - missing permissions reporting', () => {
	it('should report all missing permissions when requireAll=true', () => {
		const guard = createPermissionGuard(['read', 'write', 'delete']);
		const context = createPermissionsContext({
			read: true,
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: false,
			reason: RouteGuardReason.MissingPermissions,
			missingPermissions: ['write', 'delete'],
		});
	});

	it('should report all missing permissions when requireAll=false', () => {
		const guard = createPermissionGuard(['read', 'write'], { requireAll: false });
		const context = createPermissionsContext({});

		const result = guard(context);

		expect(result).toEqual({
			allowed: false,
			reason: RouteGuardReason.MissingPermissions,
			missingPermissions: ['read', 'write'],
		});
	});
});

describe('routes.guards - evaluateRouteGuards - empty or undefined guards', () => {
	it('should allow access when guards array is empty', () => {
		const context = createAuthenticatedContext();
		const result = evaluateRouteGuards([], context);

		expect(result).toEqual({
			allowed: true,
			result: {
				allowed: true,
			},
		});
		expect(Object.isFrozen(result.result)).toBe(true);
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

	it('should allow access when guards is null', () => {
		const context = createAuthenticatedContext();
		// @ts-expect-error - testing null case
		const result = evaluateRouteGuards(null, context);

		expect(result).toEqual({
			allowed: true,
			result: {
				allowed: true,
			},
		});
	});
});

describe('routes.guards - evaluateRouteGuards - single guard evaluation', () => {
	it('should allow access when single guard allows', () => {
		const allowGuard: RouteGuard = () => ({ allowed: true });
		const context = createAuthenticatedContext();
		const result = evaluateRouteGuards([allowGuard], context);

		expect(result).toEqual({
			allowed: true,
			result: {
				allowed: true,
			},
		});
	});

	it('should deny access when single guard denies', () => {
		const denyGuard: RouteGuard = () => ({
			allowed: false,
			reason: 'DENIED',
		});
		const context = createAuthenticatedContext();
		const result = evaluateRouteGuards([denyGuard], context);

		expect(result).toEqual({
			allowed: false,
			result: {
				allowed: false,
				reason: 'DENIED',
			},
			failedGuard: denyGuard,
		});
	});
});

describe('routes.guards - evaluateRouteGuards - multiple guards evaluation', () => {
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
	});

	it('should deny access and stop at first denial', () => {
		const guard1: RouteGuard = () => ({ allowed: true });
		const guard2: RouteGuard = () => ({
			allowed: false,
			reason: 'DENIED_BY_GUARD2',
		});
		const guard3: RouteGuard = () => ({ allowed: true });
		const context = createAuthenticatedContext();
		const result = evaluateRouteGuards([guard1, guard2, guard3], context);

		expect(result).toEqual({
			allowed: false,
			result: {
				allowed: false,
				reason: 'DENIED_BY_GUARD2',
			},
			failedGuard: guard2,
		});
	});

	it('should identify the failed guard', () => {
		const guard1: RouteGuard = () => ({ allowed: true });
		const guard2: RouteGuard = () => ({
			allowed: false,
			reason: 'DENIED',
		});
		const context = createAuthenticatedContext();
		const result = evaluateRouteGuards([guard1, guard2], context);

		expect(result.failedGuard).toBe(guard2);
	});
});

describe('routes.guards - evaluateRouteGuards - guard result normalization - basic', () => {
	it('should treat void return as allowed', () => {
		const voidGuard: RouteGuard = () => {
			// Returns void
		};
		const context = createAuthenticatedContext();
		const result = evaluateRouteGuards([voidGuard], context);

		expect(result).toEqual({
			allowed: true,
			result: {
				allowed: true,
			},
		});
	});

	it('should normalize allowed result without reason', () => {
		const guard: RouteGuard = () => ({
			allowed: true,
			reason: 'SOME_REASON',
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

	it('should normalize boolean allowed value', () => {
		const guard: RouteGuard = () => ({
			// @ts-expect-error - testing truthy value normalization
			allowed: 1,
		});
		const context = createAuthenticatedContext();
		const result = evaluateRouteGuards([guard], context);

		expect(result.result.allowed).toBe(true);
	});
});

describe('routes.guards - evaluateRouteGuards - guard result normalization - missingPermissions', () => {
	it('should preserve missingPermissions in result', () => {
		const guard: RouteGuard = () => ({
			allowed: false,
			reason: RouteGuardReason.MissingPermissions,
			missingPermissions: ['read', 'write'],
		});
		const context = createAuthenticatedContext();
		const result = evaluateRouteGuards([guard], context);

		expect(result).toEqual({
			allowed: false,
			result: {
				allowed: false,
				reason: RouteGuardReason.MissingPermissions,
				missingPermissions: ['read', 'write'],
			},
			failedGuard: guard,
		});
		expect(Object.isFrozen(result.result.missingPermissions)).toBe(true);
	});

	it('should filter out empty missingPermissions array', () => {
		const guard: RouteGuard = () => ({
			allowed: false,
			reason: 'DENIED',
			missingPermissions: [],
		});
		const context = createAuthenticatedContext();
		const result = evaluateRouteGuards([guard], context);

		expect(result.result.missingPermissions).toBeUndefined();
	});
});

describe('routes.guards - evaluateRouteGuards - combined guards', () => {
	it('should evaluate authentication and permission guards together', () => {
		const authGuard = authenticatedGuard;
		const permissionGuard = createPermissionGuard(['read']);
		const context = createPermissionsContext({
			read: true,
		});

		const result = evaluateRouteGuards([authGuard, permissionGuard], context);

		expect(result.allowed).toBe(true);
	});

	it('should fail when authentication guard fails', () => {
		const authGuard = authenticatedGuard;
		const permissionGuard = createPermissionGuard(['read']);
		const context = createUnauthenticatedContext({
			permissions: { read: true },
		});

		const result = evaluateRouteGuards([authGuard, permissionGuard], context);

		expect(result.allowed).toBe(false);
		expect(result.result.reason).toBe(RouteGuardReason.NotAuthenticated);
		expect(result.failedGuard).toBe(authGuard);
	});

	it('should fail when permission guard fails', () => {
		const authGuard = authenticatedGuard;
		const permissionGuard = createPermissionGuard(['read']);
		const context = createPermissionsContext({
			write: true,
		});

		const result = evaluateRouteGuards([authGuard, permissionGuard], context);

		expect(result.allowed).toBe(false);
		expect(result.result.reason).toBe(RouteGuardReason.MissingPermissions);
		expect(result.failedGuard).toBe(permissionGuard);
	});
});
