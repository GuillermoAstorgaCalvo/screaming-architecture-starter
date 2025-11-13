import type { AuthPort, AuthTokens } from '@core/ports/AuthPort';
import { AuthContext, type AuthContextValue } from '@core/providers/AuthContext';
import type { Permissions } from '@core/security/permissionsTypes';
import type { TokenPayload } from '@src-types/api/auth';
import { type PropsWithChildren, useCallback, useMemo, useSyncExternalStore } from 'react';

export interface AuthProviderProps extends PropsWithChildren {
	readonly auth: AuthPort;
}

interface AuthMetadata {
	readonly roles: readonly string[];
	readonly permissions: Permissions;
}

const EMPTY_ROLES: readonly string[] = Object.freeze([]);
const EMPTY_PERMISSIONS = Object.freeze({}) as Permissions;
const EMPTY_AUTH_METADATA: AuthMetadata = Object.freeze({
	roles: EMPTY_ROLES,
	permissions: EMPTY_PERMISSIONS,
}) as AuthMetadata;

/**
 * AuthProvider - Provides AuthPort and token state to the component tree
 *
 * Enables React components/hooks to access authentication state via useAuth()
 * without importing infrastructure adapters directly.
 */
export function AuthProvider({ auth, children }: Readonly<AuthProviderProps>) {
	const subscribe = useCallback(
		(onStoreChange: () => void) => {
			return auth.subscribe(() => {
				onStoreChange();
			});
		},
		[auth]
	);
	const getSnapshotFn = useCallback((): AuthTokens | null => auth.getTokens(), [auth]);

	const tokens = useSyncExternalStore(subscribe, getSnapshotFn, getSnapshotFn);

	const metadata = useMemo(() => extractAuthMetadata(auth, tokens), [auth, tokens]);

	const value: AuthContextValue = useMemo(
		() => ({
			auth,
			tokens,
			accessToken: tokens?.accessToken ?? null,
			refreshToken: tokens?.refreshToken ?? null,
			isAuthenticated: Boolean(tokens?.accessToken),
			roles: metadata.roles,
			permissions: metadata.permissions,
		}),
		[auth, metadata, tokens]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.displayName = 'AuthProvider';

function extractAuthMetadata(auth: AuthPort, tokens: AuthTokens | null): AuthMetadata {
	if (!tokens?.accessToken) {
		return EMPTY_AUTH_METADATA;
	}

	const payload = decodeTokenPayload(auth, tokens.accessToken);
	if (!payload) {
		return EMPTY_AUTH_METADATA;
	}

	const roles = normalizeRoles(payload.roles);
	const permissions = normalizePermissions(payload.permissions);

	if (roles === EMPTY_ROLES && permissions === EMPTY_PERMISSIONS) {
		return EMPTY_AUTH_METADATA;
	}

	return Object.freeze({
		roles,
		permissions,
	}) as AuthMetadata;
}

function decodeTokenPayload(auth: AuthPort, accessToken: string): TokenPayload | null {
	try {
		const decoded = auth.decode<TokenPayload>(accessToken);
		return decoded?.payload ?? null;
	} catch {
		return null;
	}
}

function normalizeRoles(input: unknown): readonly string[] {
	if (!Array.isArray(input)) {
		return EMPTY_ROLES;
	}

	const roles = input
		.map(role => (typeof role === 'string' ? role.trim() : ''))
		.filter((role): role is string => role.length > 0);

	if (roles.length === 0) {
		return EMPTY_ROLES;
	}

	return Object.freeze(Array.from(new Set(roles)));
}

function normalizePermissions(input: unknown): Permissions {
	if (!Array.isArray(input)) {
		return EMPTY_PERMISSIONS;
	}

	const permissions = input
		.map(permission => (typeof permission === 'string' ? permission.trim() : ''))
		.filter((permission): permission is string => permission.length > 0);

	if (permissions.length === 0) {
		return EMPTY_PERMISSIONS;
	}

	const record: Permissions = {};
	for (const permission of new Set(permissions)) {
		record[permission] = true;
	}

	return Object.freeze(record) as Permissions;
}
