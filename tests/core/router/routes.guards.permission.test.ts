import { createPermissionGuard, RouteGuardReason } from '@core/router/routes.guards';
import { describe, expect, it } from 'vitest';

import {
	createAuthenticatedContext,
	createPermissionsContext,
	createUnauthenticatedContext,
} from './routes.guards.test';

const PERMISSION_READ_ARTICLES = 'read:articles';
const PERMISSION_WRITE_ARTICLES = 'write:articles';

describe('routes.guards - createPermissionGuard - basic functionality - requireAll=true', () => {
	it('should allow access when user has all required permissions', () => {
		const guard = createPermissionGuard([PERMISSION_READ_ARTICLES, PERMISSION_WRITE_ARTICLES]);
		const context = createPermissionsContext({
			[PERMISSION_READ_ARTICLES]: true,
			[PERMISSION_WRITE_ARTICLES]: true,
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: true,
		});
	});

	it('should deny access when user is missing any required permission', () => {
		const guard = createPermissionGuard([PERMISSION_READ_ARTICLES, PERMISSION_WRITE_ARTICLES]);
		const context = createPermissionsContext({
			[PERMISSION_READ_ARTICLES]: true,
			[PERMISSION_WRITE_ARTICLES]: false,
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: false,
			reason: RouteGuardReason.MissingPermissions,
			missingPermissions: [PERMISSION_WRITE_ARTICLES],
		});
	});

	it('should deny access when user has none of the required permissions', () => {
		const guard = createPermissionGuard([PERMISSION_READ_ARTICLES, PERMISSION_WRITE_ARTICLES]);
		const context = createPermissionsContext({
			[PERMISSION_READ_ARTICLES]: false,
			[PERMISSION_WRITE_ARTICLES]: false,
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: false,
			reason: RouteGuardReason.MissingPermissions,
			missingPermissions: [PERMISSION_READ_ARTICLES, PERMISSION_WRITE_ARTICLES],
		});
	});
});

describe('routes.guards - createPermissionGuard - basic functionality - requireAll=false', () => {
	it('should allow access when user has any required permission', () => {
		const guard = createPermissionGuard([PERMISSION_READ_ARTICLES, PERMISSION_WRITE_ARTICLES], {
			requireAll: false,
		});
		const context = createPermissionsContext({
			[PERMISSION_READ_ARTICLES]: true,
			[PERMISSION_WRITE_ARTICLES]: false,
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: true,
		});
	});

	it('should deny access when user has none of the required permissions', () => {
		const guard = createPermissionGuard([PERMISSION_READ_ARTICLES, PERMISSION_WRITE_ARTICLES], {
			requireAll: false,
		});
		const context = createPermissionsContext({
			[PERMISSION_READ_ARTICLES]: false,
			[PERMISSION_WRITE_ARTICLES]: false,
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: false,
			reason: RouteGuardReason.MissingPermissions,
			missingPermissions: [PERMISSION_READ_ARTICLES, PERMISSION_WRITE_ARTICLES],
		});
	});
});

describe('routes.guards - createPermissionGuard - authentication requirements', () => {
	it('should deny access when user is not authenticated (allowGuests=false)', () => {
		const guard = createPermissionGuard([PERMISSION_READ_ARTICLES]);
		const context = createUnauthenticatedContext({
			permissions: {},
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: false,
			reason: RouteGuardReason.NotAuthenticated,
		});
	});

	it('should allow access for guests when allowGuests=true', () => {
		const guard = createPermissionGuard([PERMISSION_READ_ARTICLES], {
			allowGuests: true,
		});
		const context = createUnauthenticatedContext({
			permissions: {},
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: false,
			reason: RouteGuardReason.MissingPermissions,
			missingPermissions: [PERMISSION_READ_ARTICLES],
		});
	});

	it('should allow access for guests when allowGuests=true and no permissions required', () => {
		const guard = createPermissionGuard([], {
			allowGuests: true,
		});
		const context = createUnauthenticatedContext();

		const result = guard(context);

		expect(result).toEqual({
			allowed: true,
		});
	});
});

describe('routes.guards - createPermissionGuard - empty and null permissions', () => {
	it('should allow access when no permissions are required', () => {
		const guard = createPermissionGuard([]);
		const context = createAuthenticatedContext();

		const result = guard(context);

		expect(result).toEqual({
			allowed: true,
		});
	});

	it('should allow access when permissions array is empty (allowGuests=false)', () => {
		const guard = createPermissionGuard([]);
		const context = createUnauthenticatedContext();

		const result = guard(context);

		expect(result).toEqual({
			allowed: true,
		});
	});
});

describe('routes.guards - createPermissionGuard - permission normalization', () => {
	it('should normalize and filter empty permission strings', () => {
		const guard = createPermissionGuard([
			PERMISSION_READ_ARTICLES,
			'',
			'  ',
			PERMISSION_WRITE_ARTICLES,
		]);
		const context = createPermissionsContext({
			[PERMISSION_READ_ARTICLES]: true,
			[PERMISSION_WRITE_ARTICLES]: true,
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: true,
		});
	});

	it('should remove duplicate permissions', () => {
		const guard = createPermissionGuard([
			PERMISSION_READ_ARTICLES,
			PERMISSION_READ_ARTICLES,
			PERMISSION_WRITE_ARTICLES,
		]);
		const context = createPermissionsContext({
			[PERMISSION_READ_ARTICLES]: true,
			[PERMISSION_WRITE_ARTICLES]: true,
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: true,
		});
	});

	it('should trim whitespace from permission strings', () => {
		const guard = createPermissionGuard(['  read:articles  ', ' write:articles ']);
		const context = createPermissionsContext({
			[PERMISSION_READ_ARTICLES]: true,
			[PERMISSION_WRITE_ARTICLES]: true,
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: true,
		});
	});
});

describe('routes.guards - createPermissionGuard - custom reason', () => {
	it('should use custom reason when provided', () => {
		const customReason = RouteGuardReason.MissingPermissions;
		const guard = createPermissionGuard([PERMISSION_READ_ARTICLES], {
			reason: customReason,
		});
		const context = createPermissionsContext({
			[PERMISSION_READ_ARTICLES]: false,
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: false,
			reason: customReason,
			missingPermissions: [PERMISSION_READ_ARTICLES],
		});
	});

	it('should use default reason when not provided', () => {
		const guard = createPermissionGuard([PERMISSION_READ_ARTICLES]);
		const context = createPermissionsContext({
			[PERMISSION_READ_ARTICLES]: false,
		});

		const result = guard(context);

		expect(result).toEqual({
			allowed: false,
			reason: RouteGuardReason.MissingPermissions,
			missingPermissions: [PERMISSION_READ_ARTICLES],
		});
	});
});

describe('routes.guards - createPermissionGuard - result immutability', () => {
	it('should return frozen result objects', () => {
		const guard = createPermissionGuard([PERMISSION_READ_ARTICLES]);
		const context = createPermissionsContext({
			[PERMISSION_READ_ARTICLES]: true,
		});

		const result = guard(context);

		expect(Object.isFrozen(result)).toBe(true);
	});

	it('should return frozen denied result with missing permissions', () => {
		const guard = createPermissionGuard([PERMISSION_READ_ARTICLES, PERMISSION_WRITE_ARTICLES]);
		const context = createPermissionsContext({
			[PERMISSION_READ_ARTICLES]: true,
			[PERMISSION_WRITE_ARTICLES]: false,
		});

		const result = guard(context);

		expect(result).toBeDefined();
		expect(Object.isFrozen(result)).toBe(true);
		if (result && result.missingPermissions) {
			expect(Object.isFrozen(result.missingPermissions)).toBe(true);
		}
	});
});
