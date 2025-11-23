/**
 * ProtectedRoute Test Utilities
 *
 * Shared utilities, helpers, and mocks for ProtectedRoute tests
 */

import type { RouteGuardReasonType } from '@core/router/routes.guards';
import { type RenderResult, screen } from '@testing-library/react';
import { MockAuthAdapter } from '@tests/utils/mocks/MockAuthAdapter';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'vitest';

export const PROTECTED_CONTENT = 'Protected Content';
export const DEFAULT_PROTECTED_PATH = '/protected';
export const NAVIGATE_MOCK_TEST_ID = 'navigate-mock';

// Helper to create auth adapter with tokens and payload
export function createAuthAdapter(
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
export function getRouterOptions(initialPath = DEFAULT_PROTECTED_PATH) {
	return {
		router: MemoryRouter,
		routerProps: { initialEntries: [initialPath] },
	};
}

// Helper to render ProtectedRoute - Navigate is mocked so we don't need Routes wrapper
export function renderProtectedRoute(
	element: ReactElement,
	options: Parameters<typeof renderWithProviders>[1] = {}
): RenderResult {
	return renderWithProviders(element, options);
}

// Helper to get navigate mock state from the rendered component
function getNavigateMockState() {
	const navigateMock = screen.getByTestId(NAVIGATE_MOCK_TEST_ID);
	const stateJson = navigateMock.dataset.state ?? '{}';
	return JSON.parse(stateJson);
}

// Helper to assert redirect state includes from path
export function expectRedirectStateFrom(testPath: string) {
	const state = getNavigateMockState();
	expect(state.from).toBe(testPath);
}

// Helper to assert redirect state includes reason
export function expectRedirectStateReason(reason: RouteGuardReasonType) {
	const state = getNavigateMockState();
	expect(state.reason).toBe(reason);
}

// Helper to assert redirect state includes missing permissions
export function expectRedirectStateMissingPermissions(permissions: string[]) {
	const state = getNavigateMockState();
	expect(state.missingPermissions).toEqual(permissions);
}

// Helper to assert redirect state includes all fields
export function expectRedirectStateAllFields(
	testPath: string,
	reason: RouteGuardReasonType,
	missingPermissions: string[]
) {
	const navigateMock = screen.getByTestId(NAVIGATE_MOCK_TEST_ID);
	expect(navigateMock).toBeInTheDocument();
	const state = getNavigateMockState();
	expect(state.from).toBe(testPath);
	expect(state.reason).toBe(reason);
	expect(state.missingPermissions).toEqual(missingPermissions);
}

export { RouteGuardReason } from '@core/router/routes.guards';
export { MemoryRouter } from 'react-router-dom';
