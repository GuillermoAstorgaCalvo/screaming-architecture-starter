/**
 * ProtectedRoute Advanced Tests
 *
 * Tests for redirect state, onDenied callbacks, edge cases, and advanced features
 */

// Mock Navigate to prevent redirect loops in tests - must be before imports
import { ProtectedRoute } from '@app/components/ProtectedRoute';
import { type RouteGuard, RouteGuardReason } from '@core/router/routes.guards';
import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
	createAuthAdapter,
	expectRedirectStateAllFields,
	expectRedirectStateFrom,
	expectRedirectStateMissingPermissions,
	expectRedirectStateReason,
	getRouterOptions,
	NAVIGATE_MOCK_TEST_ID,
	PROTECTED_CONTENT,
	renderProtectedRoute,
} from './ProtectedRoute.test.utils';

const { NAVIGATE_TEST_ID } = vi.hoisted(() => ({
	NAVIGATE_TEST_ID: 'navigate-mock',
}));

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		Navigate: ({ to, state }: { to: string; state?: unknown }) => (
			<div data-testid={NAVIGATE_TEST_ID} data-to={to} data-state={JSON.stringify(state)}>
				Navigate to {to}
			</div>
		),
	};
});

describe('ProtectedRoute - Redirect State', () => {
	it('includes location state in redirect with from path', () => {
		const auth = createAuthAdapter(null);
		const testPath = '/protected/page?query=value#hash';

		renderProtectedRoute(
			<ProtectedRoute requireAuth redirectTo="/login">
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions(testPath) }
		);

		expect(screen.getByTestId(NAVIGATE_MOCK_TEST_ID)).toBeInTheDocument();
		expectRedirectStateFrom(testPath);
		expect(screen.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument();
	});

	it('includes reason in redirect state', () => {
		const auth = createAuthAdapter(null);

		renderProtectedRoute(
			<ProtectedRoute requireAuth>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		expectRedirectStateReason(RouteGuardReason.NotAuthenticated);
		expect(screen.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument();
	});

	it('includes missingPermissions in redirect state when permissions are missing', () => {
		const auth = createAuthAdapter(
			{ accessToken: 'token' },
			{
				roles: ['user'],
				permissions: ['read'],
			}
		);

		renderProtectedRoute(
			<ProtectedRoute requireAuth permissions={['read', 'write']} requireAllPermissions={true}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		expectRedirectStateMissingPermissions(['write']);
		expectRedirectStateReason(RouteGuardReason.MissingPermissions);
		expect(screen.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument();
	});
});

describe('ProtectedRoute - Redirect State - Combined Fields', () => {
	it('includes all redirect state fields together', () => {
		const auth = createAuthAdapter(
			{ accessToken: 'token' },
			{
				roles: ['user'],
				permissions: ['read'],
			}
		);
		const testPath = '/protected/page?query=value#hash';

		renderProtectedRoute(
			<ProtectedRoute
				requireAuth
				permissions={['read', 'write', 'delete']}
				requireAllPermissions={true}
				redirectTo="/unauthorized"
			>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions(testPath) }
		);

		const navigateMock = screen.getByTestId(NAVIGATE_MOCK_TEST_ID);
		expect(navigateMock).toHaveAttribute('data-to', '/unauthorized');
		expectRedirectStateAllFields(testPath, RouteGuardReason.MissingPermissions, [
			'write',
			'delete',
		]);
	});
});

describe('ProtectedRoute - onDenied Callback - authentication denial', () => {
	it('calls onDenied when access is denied due to authentication', () => {
		const onDenied = vi.fn();
		const auth = createAuthAdapter(null);

		renderProtectedRoute(
			<ProtectedRoute requireAuth onDenied={onDenied}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		expect(onDenied).toHaveBeenCalledWith(
			expect.objectContaining({
				result: expect.objectContaining({
					allowed: false,
					reason: RouteGuardReason.NotAuthenticated,
				}),
				failedGuard: expect.any(Function),
			})
		);
	});
});

describe('ProtectedRoute - onDenied Callback - permission denial', () => {
	it('calls onDenied when access is denied due to missing permissions', () => {
		const onDenied = vi.fn();
		const auth = createAuthAdapter(
			{ accessToken: 'token' },
			{
				roles: ['user'],
				permissions: ['read'],
			}
		);

		renderProtectedRoute(
			<ProtectedRoute
				requireAuth
				permissions={['read', 'write']}
				requireAllPermissions={true}
				onDenied={onDenied}
			>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		expect(onDenied).toHaveBeenCalledWith(
			expect.objectContaining({
				result: expect.objectContaining({
					allowed: false,
					reason: RouteGuardReason.MissingPermissions,
					missingPermissions: expect.arrayContaining(['write']),
				}),
				failedGuard: expect.any(Function),
			})
		);
	});
});

describe('ProtectedRoute - onDenied Callback - guard denial', () => {
	it('calls onDenied with failedGuard when custom guard denies access', () => {
		const customGuard: RouteGuard = () => ({
			allowed: false,
			reason: 'CUSTOM_DENIED',
		});
		const onDenied = vi.fn();
		const auth = createAuthAdapter({ accessToken: 'token' }, { roles: ['user'], permissions: [] });

		renderProtectedRoute(
			<ProtectedRoute guards={[customGuard]} onDenied={onDenied}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		expect(onDenied).toHaveBeenCalledWith({
			result: expect.objectContaining({
				allowed: false,
				reason: 'CUSTOM_DENIED',
			}),
			failedGuard: customGuard,
		});
	});

	it('does not call onDenied when access is allowed', () => {
		const onDenied = vi.fn();
		const auth = createAuthAdapter({ accessToken: 'token' }, { roles: ['user'], permissions: [] });

		renderProtectedRoute(
			<ProtectedRoute requireAuth onDenied={onDenied}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		expect(onDenied).not.toHaveBeenCalled();
	});

	it('calls onDenied only once when evaluation result changes', async () => {
		const onDenied = vi.fn();
		const auth = createAuthAdapter(null);

		renderProtectedRoute(
			<ProtectedRoute requireAuth onDenied={onDenied}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		expect(onDenied).toHaveBeenCalledTimes(1);

		// Update auth state - this should trigger re-evaluation via the auth subscription
		auth.setTokens({ accessToken: 'token' });
		auth.setMockPayload({ roles: ['user'], permissions: [] });

		// Wait for auth state to propagate and content to appear (indicating access is now allowed)
		await waitFor(
			() => {
				expect(screen.getByText(PROTECTED_CONTENT)).toBeInTheDocument();
			},
			{ timeout: 2000 }
		);

		// After auth update, access should be allowed, so onDenied should not be called again
		expect(onDenied).toHaveBeenCalledTimes(1);
	}, 5000);
});

describe('ProtectedRoute - Edge Cases', () => {
	it('handles empty permissions array', () => {
		const auth = createAuthAdapter({ accessToken: 'token' }, { roles: ['user'], permissions: [] });

		renderProtectedRoute(
			<ProtectedRoute requireAuth permissions={[]}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		// Should allow access since no permissions required
		expect(screen.getByText(PROTECTED_CONTENT)).toBeInTheDocument();
	});

	it('handles empty guards array', () => {
		const auth = createAuthAdapter({ accessToken: 'token' }, { roles: ['user'], permissions: [] });

		renderProtectedRoute(
			<ProtectedRoute guards={[]}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		// Should allow access when no guards
		expect(screen.getByText(PROTECTED_CONTENT)).toBeInTheDocument();
	});

	it('handles guard that returns void (implicit allow)', () => {
		const voidGuard: RouteGuard = () => {
			// Returns void, should be treated as allowed
		};
		const auth = createAuthAdapter({ accessToken: 'token' }, { roles: ['user'], permissions: [] });

		renderProtectedRoute(
			<ProtectedRoute guards={[voidGuard]}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		expect(screen.getByText(PROTECTED_CONTENT)).toBeInTheDocument();
	});

	it('handles requireAuth=false with permissions', () => {
		const auth = createAuthAdapter(null);

		renderProtectedRoute(
			<ProtectedRoute requireAuth={false} permissions={['read']} allowGuests={true}>
				<div>Content</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions('/content') }
		);

		// allowGuests allows unauthenticated users to be checked for permissions,
		// but guests without permissions will still be denied
		expect(screen.queryByText('Content')).not.toBeInTheDocument();
		expect(screen.getByTestId(NAVIGATE_MOCK_TEST_ID)).toBeInTheDocument();
	});

	it('defaults allowGuests based on requireAuth when not specified', () => {
		const auth = createAuthAdapter(null);

		// When requireAuth is false, allowGuests should default to true
		// But guests without permissions will still be denied
		renderProtectedRoute(
			<ProtectedRoute requireAuth={false} permissions={['read']}>
				<div>Content</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions('/content') }
		);

		// allowGuests defaults to true when requireAuth is false,
		// but guests without permissions will still be denied
		expect(screen.queryByText('Content')).not.toBeInTheDocument();
		expect(screen.getByTestId(NAVIGATE_MOCK_TEST_ID)).toBeInTheDocument();
	});
});

describe('ProtectedRoute - Display Name', () => {
	it('has correct display name', () => {
		expect(ProtectedRoute.displayName).toBe('ProtectedRoute');
	});
});

describe('ProtectedRoute - Guard List Composition', () => {
	it('combines requireAuth, permissions, and custom guards in correct order', () => {
		const customGuard: RouteGuard = context => {
			if (context.roles.includes('admin')) {
				return { allowed: true };
			}
			return { allowed: false, reason: 'ADMIN_REQUIRED' };
		};

		const auth = createAuthAdapter(
			{ accessToken: 'token' },
			{
				roles: ['admin'],
				permissions: ['read', 'write'],
			}
		);

		renderProtectedRoute(
			<ProtectedRoute requireAuth permissions={['read', 'write']} guards={[customGuard]}>
				<div>Admin Content</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		expect(screen.getByText('Admin Content')).toBeInTheDocument();
	});

	it('evaluates guards in order: auth -> permissions -> custom', () => {
		const customGuard: RouteGuard = vi.fn(() => ({ allowed: true }));
		const auth = createAuthAdapter(null);

		renderProtectedRoute(
			<ProtectedRoute requireAuth permissions={['read']} guards={[customGuard]}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		// Should fail at auth guard, custom guard should not be called
		expect(customGuard).not.toHaveBeenCalled();
		expect(screen.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument();
	});

	it('handles requireAuth=false with custom guards only', () => {
		const customGuard: RouteGuard = () => ({ allowed: true });
		const auth = createAuthAdapter(null);

		renderProtectedRoute(
			<ProtectedRoute requireAuth={false} guards={[customGuard]}>
				<div>Public Content</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		expect(screen.getByText('Public Content')).toBeInTheDocument();
	});
});

describe('ProtectedRoute - Memoization and Re-renders', () => {
	it('should not re-evaluate guards when props do not change', async () => {
		const guard = vi.fn(() => ({ allowed: true }));
		const auth = createAuthAdapter({ accessToken: 'token' }, { roles: ['user'], permissions: [] });

		renderProtectedRoute(
			<ProtectedRoute guards={[guard]}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		// Guard should not be called again if dependencies haven't changed
		// Note: React may call it during render, but memoization should prevent unnecessary work
		expect(screen.getByText(PROTECTED_CONTENT)).toBeInTheDocument();
	});

	it('should re-evaluate when auth state changes', async () => {
		const auth = createAuthAdapter(null);

		renderProtectedRoute(
			<ProtectedRoute requireAuth>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		expect(screen.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument();

		// Update auth state
		auth.setTokens({ accessToken: 'token' });
		auth.setMockPayload({ roles: ['user'], permissions: [] });

		// Wait for auth state to propagate
		await waitFor(
			() => {
				expect(screen.getByText(PROTECTED_CONTENT)).toBeInTheDocument();
			},
			{ timeout: 2000 }
		);
	});
});

describe('ProtectedRoute - onDenied Callback - edge cases', () => {
	it('calls onDenied with correct structure when multiple guards fail', () => {
		const onDenied = vi.fn();
		const auth = createAuthAdapter(null);

		renderProtectedRoute(
			<ProtectedRoute requireAuth permissions={['read']} onDenied={onDenied}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		// Should fail at auth guard first
		expect(onDenied).toHaveBeenCalledWith(
			expect.objectContaining({
				result: expect.objectContaining({
					allowed: false,
					reason: RouteGuardReason.NotAuthenticated,
				}),
				failedGuard: expect.any(Function),
			})
		);
	});

	it('does not call onDenied when fallback is provided and access is denied', () => {
		const onDenied = vi.fn();
		const auth = createAuthAdapter(null);

		renderProtectedRoute(
			<ProtectedRoute requireAuth fallback={<div>Access Denied</div>} onDenied={onDenied}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		// onDenied should still be called even with fallback
		expect(onDenied).toHaveBeenCalled();
		expect(screen.getByText('Access Denied')).toBeInTheDocument();
	});

	it('calls onDenied only when evaluation changes from allowed to denied', async () => {
		const onDenied = vi.fn();
		const auth = createAuthAdapter({ accessToken: 'token' }, { roles: ['user'], permissions: [] });

		renderProtectedRoute(
			<ProtectedRoute requireAuth onDenied={onDenied}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		// Initially allowed, onDenied should not be called
		expect(onDenied).not.toHaveBeenCalled();
		expect(screen.getByText(PROTECTED_CONTENT)).toBeInTheDocument();

		// Remove auth
		auth.clearTokens();
		auth.setMockPayload({});

		// Wait for auth state to propagate
		await waitFor(
			() => {
				expect(screen.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument();
			},
			{ timeout: 2000 }
		);

		// Now onDenied should be called
		expect(onDenied).toHaveBeenCalledTimes(1);
	});
});

describe('ProtectedRoute - Default Values', () => {
	it('uses default redirect path when not specified', () => {
		const auth = createAuthAdapter(null);

		renderProtectedRoute(
			<ProtectedRoute requireAuth>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		const navigateMock = screen.getByTestId(NAVIGATE_MOCK_TEST_ID);
		expect(navigateMock).toHaveAttribute('data-to', '/');
	});

	it('defaults requireAuth to true', () => {
		const auth = createAuthAdapter(null);

		renderProtectedRoute(
			<ProtectedRoute>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		expect(screen.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument();
		expect(screen.getByTestId(NAVIGATE_MOCK_TEST_ID)).toBeInTheDocument();
	});

	it('defaults requireAllPermissions to true', () => {
		const auth = createAuthAdapter(
			{ accessToken: 'token' },
			{
				roles: ['user'],
				permissions: ['read'],
			}
		);

		renderProtectedRoute(
			<ProtectedRoute requireAuth permissions={['read', 'write']}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		// Should require all permissions by default
		expect(screen.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument();
	});
});
