import type { AuthTokens } from '@core/ports/AuthPort';
import type { AuthContextValue } from '@core/providers/auth/AuthContext';
import { AuthProvider } from '@core/providers/auth/AuthProvider';
import { useAuth } from '@core/providers/auth/useAuth';
import { act, renderHook } from '@testing-library/react';
import { MockAuthAdapter } from '@tests/utils/mocks/MockAuthAdapter';
import type { PropsWithChildren, ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';

const createTokens = (overrides: Partial<AuthTokens> = {}): AuthTokens => ({
	accessToken: 'access-token',
	refreshToken: 'refresh-token',
	...overrides,
});

describe('AuthProvider state management', () => {
	it('provides an unauthenticated default state when no tokens are set', () => {
		const { result } = renderAuthHook();
		expectUnauthenticatedState(result.current);
	});

	it('handles login and logout events propagated from the auth port', () => {
		const { auth, result } = renderAuthHook();
		const tokens = createTokens();
		setTokens(auth, tokens);

		expectAuthenticatedState(result.current, tokens);

		clearTokens(auth);
		expectUnauthenticatedState(result.current);
	});
});

describe('AuthProvider metadata handling', () => {
	it('derives roles and permissions from decoded token payload', () => {
		const payload = {
			roles: [' admin ', 'Admin', 'user', '', 'user'],
			permissions: ['read', 'write', 'read', ''],
		};
		const { auth, result } = renderAuthHook(createAuthWithPayload(payload));

		setTokens(auth, createTokens({ accessToken: 'roles-token' }));

		expectRoles(result.current, ['admin', 'Admin', 'user']);
		expectPermissions(result.current, {
			read: true,
			write: true,
		});
	});

	it('falls back to empty metadata when token decoding fails', () => {
		const auth = new MockAuthAdapter();

		vi.spyOn(auth, 'decode').mockImplementation(() => {
			throw new Error('decode failed');
		});

		const { result } = renderAuthHook(auth);

		setTokens(auth, createTokens());

		expectRoles(result.current, []);
		expectPermissions(result.current, {});
	});
});

describe('AuthProvider token refresh', () => {
	it('updates access and refresh tokens when a token refresh occurs', () => {
		const { auth, result } = renderAuthHook();

		setTokens(
			auth,
			createTokens({
				accessToken: 'initial-access',
				refreshToken: 'initial-refresh',
			})
		);

		expectTokens(result.current, {
			accessToken: 'initial-access',
			refreshToken: 'initial-refresh',
		});

		setTokens(
			auth,
			createTokens({
				accessToken: 'refreshed-access',
				refreshToken: 'refreshed-refresh',
			})
		);

		expectTokens(result.current, {
			accessToken: 'refreshed-access',
			refreshToken: 'refreshed-refresh',
		});
	});
});

describe('useAuth guard rails', () => {
	it('throws if useAuth is called outside of an AuthProvider', () => {
		expect(() => renderHook(() => useAuth())).toThrowError(
			'useAuth must be used within an AuthProvider'
		);
	});
});

function createWrapper(auth: MockAuthAdapter) {
	const Wrapper = ({ children }: PropsWithChildren): ReactElement => (
		<AuthProvider auth={auth}>{children}</AuthProvider>
	);
	Wrapper.displayName = 'AuthProviderTestWrapper';
	return Wrapper;
}

function renderAuthHook(auth = new MockAuthAdapter()) {
	const { result } = renderHook(() => useAuth(), { wrapper: createWrapper(auth) });
	return { auth, result };
}

function expectUnauthenticatedState(value: AuthContextValue) {
	expect(value.tokens).toBeNull();
	expect(value.accessToken).toBeNull();
	expect(value.refreshToken).toBeNull();
	expect(value.isAuthenticated).toBe(false);
	expect(value.roles).toEqual([]);
	expect(value.permissions).toEqual({});
}

function expectAuthenticatedState(value: AuthContextValue, tokens: AuthTokens) {
	expect(value.tokens).toEqual(tokens);
	expectTokens(value, tokens);
	expect(value.isAuthenticated).toBe(true);
}

function expectTokens(
	value: AuthContextValue,
	tokens: Pick<AuthTokens, 'accessToken' | 'refreshToken'>
) {
	expect(value.accessToken).toBe(tokens.accessToken);
	expect(value.refreshToken ?? null).toBe(tokens.refreshToken ?? null);
}

function expectRoles(value: AuthContextValue, roles: readonly string[]) {
	expect(value.roles).toEqual(roles);
}

function expectPermissions(value: AuthContextValue, permissions: Record<string, boolean>) {
	expect(value.permissions).toEqual(permissions);
}

function setTokens(auth: MockAuthAdapter, tokens: AuthTokens) {
	act(() => auth.setTokens(tokens));
}

function clearTokens(auth: MockAuthAdapter) {
	act(() => auth.clearTokens());
}

function createAuthWithPayload(payload: Record<string, unknown>) {
	const auth = new MockAuthAdapter();
	auth.setMockPayload(payload);
	return auth;
}
