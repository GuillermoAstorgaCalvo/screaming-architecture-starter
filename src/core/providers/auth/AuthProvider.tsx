import type { AuthPort, AuthTokens } from '@core/ports/AuthPort';
import { AuthContext, type AuthContextValue } from '@core/providers/auth/AuthContext';
import type { Permissions } from '@core/security/permissions/permissionsTypes';
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

// Cache for metadata objects to return same reference when values are the same
const metadataCache = new Map<string, AuthMetadata>();

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

	// Create a stable key from roles and permissions
	// Use JSON.stringify on sorted arrays to ensure consistent keys
	const rolesKey = JSON.stringify([...roles].sort());
	const permissionsKey = JSON.stringify(Object.keys(permissions).sort());
	const metadataKey = `${rolesKey}|${permissionsKey}`;

	// Return cached metadata if available
	const cached = metadataCache.get(metadataKey);
	if (cached) {
		return cached;
	}

	// Create and cache new metadata
	const metadata = Object.freeze({
		roles,
		permissions,
	}) as AuthMetadata;
	metadataCache.set(metadataKey, metadata);
	return metadata;
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

// Cache for normalized permissions to return same reference when values are the same
const permissionsCache = new Map<string, Permissions>();

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

	// Create a stable key from sorted permissions
	const sortedPermissions = [...new Set(permissions)].sort((a, b) => a.localeCompare(b));
	const key = JSON.stringify(sortedPermissions);

	// Return cached permissions if available, otherwise create and cache
	const cached = permissionsCache.get(key);
	if (cached) {
		return cached;
	}

	const record: Permissions = {};
	for (const permission of new Set(permissions)) {
		record[permission] = true;
	}

	const normalized = Object.freeze(record) as Permissions;
	permissionsCache.set(key, normalized);
	return normalized;
}
