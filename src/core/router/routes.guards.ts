import type { Permissions } from '@core/security/permissions/permissionsTypes';
import { checkPermissions } from '@core/security/permissions/permissionsValidate';

export interface RouteGuardContext {
	readonly isAuthenticated: boolean;
	readonly permissions: Permissions;
	readonly roles: readonly string[];
}

export interface RouteGuardResult {
	readonly allowed: boolean;
	readonly reason?: string;
	readonly missingPermissions?: readonly string[];
}

export type RouteGuard = (context: RouteGuardContext) => RouteGuardResult | void;

export interface GuardEvaluationResult {
	readonly allowed: boolean;
	readonly result: RouteGuardResult;
	readonly failedGuard?: RouteGuard;
}

export interface PermissionGuardOptions {
	readonly requireAll?: boolean;
	readonly allowGuests?: boolean;
	readonly reason?: RouteGuardReasonType;
}

export const RouteGuardReason = {
	NotAuthenticated: 'NOT_AUTHENTICATED',
	AlreadyAuthenticated: 'ALREADY_AUTHENTICATED',
	MissingPermissions: 'MISSING_PERMISSIONS',
} as const;

export type RouteGuardReasonType = (typeof RouteGuardReason)[keyof typeof RouteGuardReason];

const ALLOW_RESULT = Object.freeze({ allowed: true }) as RouteGuardResult;

export const authenticatedGuard: RouteGuard = context => {
	if (context.isAuthenticated) {
		return ALLOW_RESULT;
	}

	return createDeniedResult(RouteGuardReason.NotAuthenticated);
};

export const guestGuard: RouteGuard = context => {
	if (context.isAuthenticated) {
		return createDeniedResult(RouteGuardReason.AlreadyAuthenticated);
	}

	return ALLOW_RESULT;
};

export function createPermissionGuard(
	requiredPermissions: readonly string[],
	options: PermissionGuardOptions = {}
): RouteGuard {
	const normalized = normalizeRequiredPermissions(requiredPermissions);
	if (normalized.length === 0) {
		return () => ALLOW_RESULT;
	}

	const requireAll = options.requireAll ?? true;
	const allowGuests = options.allowGuests ?? false;
	const denyReason = options.reason ?? RouteGuardReason.MissingPermissions;

	return context => {
		if (!allowGuests && !context.isAuthenticated) {
			return createDeniedResult(RouteGuardReason.NotAuthenticated);
		}

		const result = checkPermissions(context.permissions, normalized, requireAll);
		if (result.allowed) {
			return ALLOW_RESULT;
		}

		const missing = result.missing ?? getMissingPermissions(normalized, context.permissions);
		return createDeniedResult(denyReason, missing);
	};
}

export function evaluateRouteGuards(
	guards: readonly RouteGuard[] | undefined,
	context: RouteGuardContext
): GuardEvaluationResult {
	if (!Array.isArray(guards) || guards.length === 0) {
		return {
			allowed: true,
			result: ALLOW_RESULT,
		};
	}

	for (const guard of guards) {
		const rawResult = guard(context);
		const result = normalizeGuardResult(rawResult);

		if (!result.allowed) {
			return {
				allowed: false,
				result,
				failedGuard: guard,
			};
		}
	}

	return {
		allowed: true,
		result: ALLOW_RESULT,
	};
}

function normalizeGuardResult(result: RouteGuardResult | void): RouteGuardResult {
	if (!result) {
		return ALLOW_RESULT;
	}

	if (result.allowed && result.reason === undefined && result.missingPermissions === undefined) {
		return ALLOW_RESULT;
	}

	const normalized: RouteGuardResult = {
		allowed: Boolean(result.allowed),
		...(result.reason ? { reason: result.reason } : {}),
		...(result.missingPermissions && result.missingPermissions.length > 0
			? { missingPermissions: normalizePermissionList(result.missingPermissions) }
			: {}),
	};

	return Object.freeze(normalized) as RouteGuardResult;
}

function createDeniedResult(
	reason: RouteGuardReasonType,
	missingPermissions?: readonly string[]
): RouteGuardResult {
	const normalizedMissing =
		missingPermissions && missingPermissions.length > 0
			? normalizePermissionList(missingPermissions)
			: undefined;

	return Object.freeze({
		allowed: false,
		reason,
		...(normalizedMissing ? { missingPermissions: normalizedMissing } : {}),
	}) as RouteGuardResult;
}

function normalizeRequiredPermissions(input: readonly string[] | null | undefined): string[] {
	if (!Array.isArray(input)) {
		return [];
	}

	const normalized = normalizePermissionList(input);
	return Array.from(normalized);
}

function normalizePermissionList(input: readonly string[]): readonly string[] {
	const cleaned = input
		.map(permission => (typeof permission === 'string' ? permission.trim() : ''))
		.filter((permission): permission is string => permission.length > 0);

	if (cleaned.length === 0) {
		return Object.freeze([]) as readonly string[];
	}

	return Object.freeze(Array.from(new Set(cleaned)));
}

function getMissingPermissions(
	requiredPermissions: readonly string[],
	grantedPermissions: Permissions
): readonly string[] | undefined {
	const missing = requiredPermissions.filter(permission => grantedPermissions[permission] !== true);
	if (missing.length === 0) {
		return undefined;
	}

	return Object.freeze(missing);
}
