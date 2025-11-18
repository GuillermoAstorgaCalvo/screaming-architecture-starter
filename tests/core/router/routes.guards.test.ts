import {
	authenticatedGuard,
	guestGuard,
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
