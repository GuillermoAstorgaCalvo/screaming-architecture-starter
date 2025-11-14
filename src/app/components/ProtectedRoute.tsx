import { useAuth } from '@core/providers/auth/useAuth';
import {
	authenticatedGuard,
	createPermissionGuard,
	evaluateRouteGuards,
	type GuardEvaluationResult,
	type RouteGuard,
	type RouteGuardResult,
} from '@core/router/routes.guards';
import { type ReactNode, useEffect, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export interface ProtectedRouteProps {
	readonly children: ReactNode;
	readonly guards?: readonly RouteGuard[];
	readonly requireAuth?: boolean;
	readonly permissions?: readonly string[];
	readonly requireAllPermissions?: boolean;
	readonly redirectTo?: string;
	readonly fallback?: ReactNode;
	readonly allowGuests?: boolean;
	readonly onDenied?: (details: { result: RouteGuardResult; failedGuard?: RouteGuard }) => void;
}

const DEFAULT_REDIRECT = '/';

export function ProtectedRoute({
	children,
	guards,
	requireAuth = true,
	permissions,
	requireAllPermissions = true,
	redirectTo = DEFAULT_REDIRECT,
	fallback,
	allowGuests,
	onDenied,
}: Readonly<ProtectedRouteProps>) {
	const auth = useAuth();
	const location = useLocation();

	const guardList = useGuardList({
		requireAuth,
		requireAllPermissions,
		allowGuests: allowGuests ?? !requireAuth,
		...(permissions ? { permissions } : {}),
		...(guards ? { guards } : {}),
	});
	const guardContext = useGuardContext(auth);
	const evaluation = useGuardEvaluation(guardList, guardContext);

	useGuardDenialNotification(evaluation, onDenied);

	if (evaluation.allowed) return children;
	if (fallback !== undefined) return fallback;

	return (
		<Navigate
			to={redirectTo}
			replace
			state={{
				from: `${location.pathname}${location.search}${location.hash}`,
				reason: evaluation.result.reason,
				missingPermissions: evaluation.result.missingPermissions,
			}}
		/>
	);
}

ProtectedRoute.displayName = 'ProtectedRoute';

interface GuardListOptions {
	readonly requireAuth: boolean;
	readonly permissions?: readonly string[];
	readonly requireAllPermissions: boolean;
	readonly allowGuests: boolean;
	readonly guards?: readonly RouteGuard[];
}

function useGuardList({
	requireAuth,
	permissions,
	requireAllPermissions,
	allowGuests,
	guards,
}: GuardListOptions): RouteGuard[] {
	return useMemo(() => {
		const list: RouteGuard[] = [];

		if (requireAuth) {
			list.push(authenticatedGuard);
		}

		if (permissions && permissions.length > 0) {
			list.push(
				createPermissionGuard(permissions, {
					requireAll: requireAllPermissions,
					allowGuests,
				})
			);
		}

		if (guards && guards.length > 0) {
			list.push(...guards);
		}

		return list;
	}, [allowGuests, guards, permissions, requireAllPermissions, requireAuth]);
}

function useGuardContext(auth: ReturnType<typeof useAuth>) {
	return useMemo(
		() => ({
			isAuthenticated: auth.isAuthenticated,
			permissions: auth.permissions,
			roles: auth.roles,
		}),
		[auth.isAuthenticated, auth.permissions, auth.roles]
	);
}

function useGuardEvaluation(
	guardList: readonly RouteGuard[],
	guardContext: ReturnType<typeof useGuardContext>
): GuardEvaluationResult {
	return useMemo<GuardEvaluationResult>(
		() => evaluateRouteGuards(guardList, guardContext),
		[guardContext, guardList]
	);
}

function useGuardDenialNotification(
	evaluation: GuardEvaluationResult,
	onDenied: ProtectedRouteProps['onDenied']
) {
	useEffect(() => {
		if (evaluation.allowed || !onDenied) {
			return;
		}

		const { failedGuard, result } = evaluation;
		onDenied(failedGuard ? { result, failedGuard } : { result });
	}, [evaluation, onDenied]);
}
