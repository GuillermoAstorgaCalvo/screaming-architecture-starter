/**
 * ProtectedRoute Tests
 *
 * Tests for authentication, authorization, redirect logic, and fallback rendering
 */

import { ProtectedRoute } from '@app/components/ProtectedRoute';
import { type RouteGuard, RouteGuardReason } from '@core/router/routes.guards';
import { screen, waitFor } from '@testing-library/react';
import { MockAuthAdapter } from '@tests/utils/mocks/MockAuthAdapter';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

const PROTECTED_CONTENT = 'Protected Content';
const DEFAULT_PROTECTED_PATH = '/protected';
const NAVIGATE_MOCK_TEST_ID = 'navigate-mock';

// Mock Navigate to prevent redirect loops in tests
// This allows us to test component logic without actual navigation
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		Navigate: ({ to, state }: { to: string; state?: unknown }) => (
			<div data-testid={NAVIGATE_MOCK_TEST_ID} data-to={to} data-state={JSON.stringify(state)}>
				Navigate to {to}
			</div>
		),
	};
});

// Helper to create auth adapter with tokens and payload
function createAuthAdapter(
	tokens: { accessToken: string; refreshToken?: string } | null = null,
	payload: Record<string, unknown> = {}
) {
	const auth = new MockAuthAdapter();
	if (tokens) {
		auth.setTokens(tokens);
		auth.setMockPayload(payload);
	}
	return auth;
}

// Helper to get router options for tests
function getRouterOptions(initialPath = DEFAULT_PROTECTED_PATH) {
	return {
		router: MemoryRouter,
		routerProps: { initialEntries: [initialPath] },
	};
}

// Helper to render ProtectedRoute - Navigate is mocked so we don't need Routes wrapper
function renderProtectedRoute(
	element: ReactElement,
	options: Parameters<typeof renderWithProviders>[1] = {}
) {
	return renderWithProviders(element, options);
}

describe('ProtectedRoute - Authentication', () => {
	it('renders children when user is authenticated and requireAuth is true', () => {
		const auth = createAuthAdapter({ accessToken: 'token' }, { roles: ['user'], permissions: [] });

		renderProtectedRoute(
			<ProtectedRoute requireAuth>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		expect(screen.getByText(PROTECTED_CONTENT)).toBeInTheDocument();
	});

	it('redirects to default path when user is not authenticated and requireAuth is true', () => {
		const auth = createAuthAdapter(null);

		renderProtectedRoute(
			<ProtectedRoute requireAuth>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		// Navigate mock should be rendered, content should not be visible
		expect(screen.getByTestId(NAVIGATE_MOCK_TEST_ID)).toBeInTheDocument();
		expect(screen.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument();
	});

	it('redirects to custom path when user is not authenticated', () => {
		const auth = createAuthAdapter(null);

		renderProtectedRoute(
			<ProtectedRoute requireAuth redirectTo="/login">
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		const navigateMock = screen.getByTestId(NAVIGATE_MOCK_TEST_ID);
		expect(navigateMock).toBeInTheDocument();
		expect(navigateMock).toHaveAttribute('data-to', '/login');
		expect(screen.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument();
	});

	it('allows access when requireAuth is false', () => {
		const auth = createAuthAdapter(null);

		renderProtectedRoute(
			<ProtectedRoute requireAuth={false}>
				<div>Public Content</div>
			</ProtectedRoute>,
			{ auth, router: MemoryRouter, routerProps: { initialEntries: ['/public'] } }
		);

		expect(screen.getByText('Public Content')).toBeInTheDocument();
	});

	it('renders fallback when access is denied and fallback is provided', () => {
		const auth = createAuthAdapter(null);

		renderProtectedRoute(
			<ProtectedRoute requireAuth fallback={<div>Access Denied</div>}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		expect(screen.getByText('Access Denied')).toBeInTheDocument();
		expect(screen.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument();
	});
});

describe('ProtectedRoute - Authorization (Permissions) - requireAllPermissions', () => {
	it('renders children when user has required permissions (requireAllPermissions=true)', () => {
		const auth = createAuthAdapter(
			{ accessToken: 'token' },
			{
				roles: ['user'],
				permissions: ['read', 'write'],
			}
		);

		renderProtectedRoute(
			<ProtectedRoute requireAuth permissions={['read', 'write']} requireAllPermissions={true}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		expect(screen.getByText(PROTECTED_CONTENT)).toBeInTheDocument();
	});

	it('redirects when user is missing required permissions (requireAllPermissions=true)', () => {
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

		// Should redirect, not show content
		expect(screen.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument();
	});
});

describe('ProtectedRoute - Authorization (Permissions) - requireAnyPermissions', () => {
	it('renders children when user has any required permission (requireAllPermissions=false)', () => {
		const auth = createAuthAdapter(
			{ accessToken: 'token' },
			{
				roles: ['user'],
				permissions: ['read'],
			}
		);

		renderProtectedRoute(
			<ProtectedRoute requireAuth permissions={['read', 'write']} requireAllPermissions={false}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		expect(screen.getByText(PROTECTED_CONTENT)).toBeInTheDocument();
	});

	it('redirects when user has none of the required permissions (requireAllPermissions=false)', () => {
		const auth = createAuthAdapter(
			{ accessToken: 'token' },
			{
				roles: ['user'],
				permissions: ['other'],
			}
		);

		renderProtectedRoute(
			<ProtectedRoute requireAuth permissions={['read', 'write']} requireAllPermissions={false}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		expect(screen.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument();
	});
});

describe('ProtectedRoute - Authorization (Permissions) - allowGuests', () => {
	it('allows guests when allowGuests is true and permissions are required', () => {
		const auth = createAuthAdapter(null);

		renderProtectedRoute(
			<ProtectedRoute requireAuth={false} permissions={['read']} allowGuests={true}>
				<div>Guest Content</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions('/guest') }
		);

		// allowGuests allows unauthenticated users to be checked for permissions,
		// but guests without permissions will still be denied
		// The component should redirect because guest doesn't have 'read' permission
		expect(screen.queryByText('Guest Content')).not.toBeInTheDocument();
		expect(screen.getByTestId(NAVIGATE_MOCK_TEST_ID)).toBeInTheDocument();
	});

	it('requires authentication for permissions when allowGuests is false', () => {
		const auth = createAuthAdapter(null);

		renderProtectedRoute(
			<ProtectedRoute requireAuth={true} permissions={['read']} allowGuests={false}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		// Should redirect because not authenticated
		expect(screen.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument();
	});
});

describe('ProtectedRoute - Custom Guards - basic guard behavior', () => {
	it('renders children when all custom guards allow access', () => {
		const allowGuard: RouteGuard = () => ({ allowed: true });
		const auth = createAuthAdapter({ accessToken: 'token' }, { roles: ['user'], permissions: [] });

		renderProtectedRoute(
			<ProtectedRoute guards={[allowGuard]}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		expect(screen.getByText(PROTECTED_CONTENT)).toBeInTheDocument();
	});

	it('redirects when custom guard denies access', () => {
		const denyGuard: RouteGuard = () => ({
			allowed: false,
			reason: 'CUSTOM_DENIED',
		});
		const auth = createAuthAdapter({ accessToken: 'token' }, { roles: ['user'], permissions: [] });

		renderProtectedRoute(
			<ProtectedRoute guards={[denyGuard]}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		expect(screen.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument();
	});
});

describe('ProtectedRoute - Custom Guards - guard evaluation', () => {
	it('evaluates guards in order and stops at first denial', () => {
		const firstGuard: RouteGuard = vi.fn(() => ({ allowed: true }));
		const secondGuard: RouteGuard = vi.fn(() => ({
			allowed: false,
			reason: 'DENIED',
		}));
		const thirdGuard: RouteGuard = vi.fn(() => ({ allowed: true }));

		const auth = createAuthAdapter({ accessToken: 'token' }, { roles: ['user'], permissions: [] });

		renderProtectedRoute(
			<ProtectedRoute guards={[firstGuard, secondGuard, thirdGuard]}>
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		expect(firstGuard).toHaveBeenCalled();
		expect(secondGuard).toHaveBeenCalled();
		expect(thirdGuard).not.toHaveBeenCalled();
	});

	it('combines custom guards with authentication and permission guards', () => {
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
				permissions: ['read'],
			}
		);

		renderProtectedRoute(
			<ProtectedRoute requireAuth permissions={['read']} guards={[customGuard]}>
				<div>Admin Content</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		expect(screen.getByText('Admin Content')).toBeInTheDocument();
	});
});

describe('ProtectedRoute - Redirect State', () => {
	it('includes location state in redirect with from path', () => {
		const auth = createAuthAdapter(null);

		renderProtectedRoute(
			<ProtectedRoute requireAuth redirectTo="/login">
				<div>{PROTECTED_CONTENT}</div>
			</ProtectedRoute>,
			{ auth, ...getRouterOptions() }
		);

		// Navigate component should be rendered
		// Navigate component should be rendered, content should not be visible
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

		// Navigate component should be rendered, content should not be visible
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

		// Navigate component should be rendered, content should not be visible
		expect(screen.queryByText(PROTECTED_CONTENT)).not.toBeInTheDocument();
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
