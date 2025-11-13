import type { AuthPort, AuthTokens } from '@core/ports/AuthPort';
import { AuthContext, type AuthContextValue } from '@core/providers/AuthContext';
import { type PropsWithChildren, useCallback, useMemo, useSyncExternalStore } from 'react';

export interface AuthProviderProps extends PropsWithChildren {
	readonly auth: AuthPort;
}

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

	const value: AuthContextValue = useMemo(
		() => ({
			auth,
			tokens,
			accessToken: tokens?.accessToken ?? null,
			refreshToken: tokens?.refreshToken ?? null,
			isAuthenticated: Boolean(tokens?.accessToken),
		}),
		[auth, tokens]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.displayName = 'AuthProvider';
