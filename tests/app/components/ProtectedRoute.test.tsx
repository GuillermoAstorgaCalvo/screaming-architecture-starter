/**
 * ProtectedRoute Tests
 *
 * Tests for authentication, authorization, redirect logic, and fallback rendering
 */

import { ProtectedRoute } from '@app/components/ProtectedRoute';
import type { RouteGuard } from '@core/router/routes.guards';
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
	createAuthAdapter,
	getRouterOptions,
	MemoryRouter,
	NAVIGATE_MOCK_TEST_ID,
	PROTECTED_CONTENT,
	renderProtectedRoute,
} from './ProtectedRoute.test.utils';

// Mock Navigate to prevent redirect loops in tests - must be before imports
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
