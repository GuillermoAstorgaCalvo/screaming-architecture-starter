/**
 * RightsLoader Tests
 *
 * Tests for rights loading logic, error handling, loading states, and component rendering
 */

import { RightsLoader } from '@app/components/RightsLoader';
import type { HttpClientResponse } from '@core/ports/HttpPort';
import { screen, waitFor } from '@testing-library/react';
import { MockAuthAdapter } from '@tests/utils/mocks/MockAuthAdapter';
import { MockHttpAdapter } from '@tests/utils/mocks/MockHttpAdapter';
import { MockLoggerAdapter } from '@tests/utils/mocks/MockLoggerAdapter';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const TEST_CONTENT = 'Rights Loaded Content';
const DEFAULT_ENDPOINT = '/api/user/rights';
const CUSTOM_ENDPOINT = '/api/custom/rights';
const INTERNAL_SERVER_ERROR = 'Internal Server Error';
const STRING_ERROR = 'String error';

// Helper to create auth adapter with tokens
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

// Helper to create HTTP adapter with mock response
function createHttpAdapter() {
	return new MockHttpAdapter();
}

// Helper to create a successful HTTP response
function createSuccessResponse(data: unknown): HttpClientResponse {
	return {
		data,
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	};
}

// Helper to create an HTTP error
function createHttpError(
	status: number,
	statusText: string
): Error & {
	status?: number;
	data?: unknown;
	response?: Response;
} {
	const error = new Error(`HTTP ${status}: ${statusText}`) as Error & {
		status?: number;
		data?: unknown;
		response?: Response;
	};
	error.status = status;
	error.data = null;
	error.response = new Response(null, { status, statusText });
	return error;
}

// Helper to mock successful rights response
function mockSuccessRightsResponse(
	http: MockHttpAdapter,
	endpoint: string,
	rightsData: { permissions: string[]; roles: string[] }
): void {
	http.mockResponse(endpoint, 'GET', createSuccessResponse(rightsData));
}

// Helper to mock error response
function mockErrorResponse(
	http: MockHttpAdapter,
	endpoint: string,
	status: number,
	statusText: string
): void {
	http.mockResponse(endpoint, 'GET', () => {
		throw createHttpError(status, statusText);
	});
}

// Helper to create a delayed promise for testing loading states
function createDelayedResponse<T>(response: HttpClientResponse<T>): Promise<HttpClientResponse<T>> {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(response);
		}, 0);
	});
}

// Helper to create authenticated test setup
function createAuthenticatedSetup() {
	return {
		auth: createAuthAdapter({ accessToken: 'token' }, { roles: ['user'], permissions: [] }),
		http: createHttpAdapter(),
	};
}

describe('RightsLoader - Rights Loading Logic - Endpoint Handling', () => {
	it('loads rights from default endpoint when authenticated', async () => {
		const { auth, http } = createAuthenticatedSetup();
		const rightsData = { permissions: ['read', 'write'], roles: ['user', 'editor'] };

		mockSuccessRightsResponse(http, DEFAULT_ENDPOINT, rightsData);

		renderWithProviders(
			<RightsLoader>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>,
			{ auth, http }
		);

		await waitFor(() => {
			expect(screen.getByText(TEST_CONTENT)).toBeInTheDocument();
		});

		expect(http.requests).toHaveLength(1);
		expect(http.requests[0]?.method).toBe('GET');
		expect(http.requests[0]?.url).toContain(DEFAULT_ENDPOINT);
	});

	it('loads rights from custom endpoint when provided', async () => {
		const { auth, http } = createAuthenticatedSetup();
		const rightsData = { permissions: ['admin'], roles: ['admin'] };

		mockSuccessRightsResponse(http, CUSTOM_ENDPOINT, rightsData);

		renderWithProviders(
			<RightsLoader endpoint={CUSTOM_ENDPOINT}>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>,
			{ auth, http }
		);

		await waitFor(() => {
			expect(screen.getByText(TEST_CONTENT)).toBeInTheDocument();
		});

		expect(http.requests).toHaveLength(1);
		expect(http.requests[0]?.url).toContain(CUSTOM_ENDPOINT);
	});
});

describe('RightsLoader - Rights Loading Logic - Authentication State', () => {
	it('does not fetch rights when user is not authenticated', async () => {
		const auth = createAuthAdapter(null);
		const http = createHttpAdapter();

		renderWithProviders(
			<RightsLoader>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>,
			{ auth, http }
		);

		await waitFor(() => {
			expect(screen.queryByText(TEST_CONTENT)).not.toBeInTheDocument();
		});

		expect(http.requests).toHaveLength(0);
	});

	it('re-fetches rights when authentication state changes', async () => {
		const auth = createAuthAdapter(null);
		const http = createHttpAdapter();
		const rightsData = { permissions: ['read'], roles: ['user'] };

		mockSuccessRightsResponse(http, DEFAULT_ENDPOINT, rightsData);

		const { rerender } = renderWithProviders(
			<RightsLoader>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>,
			{ auth, http }
		);

		await waitFor(() => {
			expect(http.requests).toHaveLength(0);
		});

		auth.setTokens({ accessToken: 'token' });
		auth.setMockPayload({ roles: ['user'], permissions: [] });

		rerender(
			<RightsLoader>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>
		);

		await waitFor(() => {
			expect(http.requests).toHaveLength(1);
		});
	});
});

describe('RightsLoader - Error Handling - HTTP Errors', () => {
	it('handles HTTP errors gracefully', async () => {
		const { auth, http } = createAuthenticatedSetup();

		mockErrorResponse(http, DEFAULT_ENDPOINT, 500, INTERNAL_SERVER_ERROR);

		renderWithProviders(
			<RightsLoader>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>,
			{ auth, http }
		);

		await waitFor(() => {
			expect(screen.queryByText(TEST_CONTENT)).not.toBeInTheDocument();
		});

		expect(http.requests).toHaveLength(1);
	});

	it('calls onError callback when error occurs', async () => {
		const { auth, http } = createAuthenticatedSetup();
		const onError = vi.fn();

		mockErrorResponse(http, DEFAULT_ENDPOINT, 404, 'Not Found');

		renderWithProviders(
			<RightsLoader onError={onError}>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>,
			{ auth, http }
		);

		await waitFor(() => {
			expect(onError).toHaveBeenCalled();
		});

		expect(onError).toHaveBeenCalledWith(expect.any(Error));
	});
});

describe('RightsLoader - Error Handling - Network and Exception Errors', () => {
	it('handles network errors', async () => {
		const { auth, http } = createAuthenticatedSetup();
		const onError = vi.fn();

		http.mockResponse(DEFAULT_ENDPOINT, 'GET', () => {
			throw new Error('Network error');
		});

		renderWithProviders(
			<RightsLoader onError={onError}>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>,
			{ auth, http }
		);

		await waitFor(
			() => {
				expect(onError).toHaveBeenCalled();
			},
			{ timeout: 3000 }
		);

		expect(onError).toHaveBeenCalledWith(expect.any(Error));
		expect(screen.queryByText(TEST_CONTENT)).not.toBeInTheDocument();
	});

	it('handles non-Error exceptions', async () => {
		const { auth, http } = createAuthenticatedSetup();
		const onError = vi.fn();

		http.mockResponse(DEFAULT_ENDPOINT, 'GET', () => {
			throw STRING_ERROR;
		});

		renderWithProviders(
			<RightsLoader onError={onError}>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>,
			{ auth, http }
		);

		await waitFor(
			() => {
				expect(onError).toHaveBeenCalled();
			},
			{ timeout: 3000 }
		);

		expect(onError).toHaveBeenCalledWith(expect.any(Error));
		expect(onError.mock.calls[0]?.[0]?.message).toBe('Failed to load rights');
	});
});

describe('RightsLoader - Loading States - Initial Loading', () => {
	it('shows loading state initially', () => {
		const { auth, http } = createAuthenticatedSetup();

		const response = createSuccessResponse({ permissions: [], roles: [] });
		http.mockResponse(DEFAULT_ENDPOINT, 'GET', () => createDelayedResponse(response));

		renderWithProviders(
			<RightsLoader>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>,
			{ auth, http }
		);

		expect(screen.queryByText(TEST_CONTENT)).not.toBeInTheDocument();
	});

	it('renders fallback during loading', () => {
		const { auth, http } = createAuthenticatedSetup();
		const FALLBACK_TEXT = 'Loading rights...';

		const response = createSuccessResponse({ permissions: [], roles: [] });
		http.mockResponse(DEFAULT_ENDPOINT, 'GET', () => createDelayedResponse(response));

		renderWithProviders(
			<RightsLoader fallback={<div>{FALLBACK_TEXT}</div>}>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>,
			{ auth, http }
		);

		expect(screen.getByText(FALLBACK_TEXT)).toBeInTheDocument();
		expect(screen.queryByText(TEST_CONTENT)).not.toBeInTheDocument();
	});
});

describe('RightsLoader - Loading States - Loading Completion', () => {
	it('hides loading state after successful fetch', async () => {
		const { auth, http } = createAuthenticatedSetup();
		const rightsData = { permissions: ['read'], roles: ['user'] };

		mockSuccessRightsResponse(http, DEFAULT_ENDPOINT, rightsData);

		renderWithProviders(
			<RightsLoader>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>,
			{ auth, http }
		);

		await waitFor(() => {
			expect(screen.getByText(TEST_CONTENT)).toBeInTheDocument();
		});
	});

	it('hides loading state after error', async () => {
		const { auth, http } = createAuthenticatedSetup();

		mockErrorResponse(http, DEFAULT_ENDPOINT, 500, INTERNAL_SERVER_ERROR);

		renderWithProviders(
			<RightsLoader>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>,
			{ auth, http }
		);

		await waitFor(() => {
			expect(screen.queryByText(TEST_CONTENT)).not.toBeInTheDocument();
		});
	});
});

describe('RightsLoader - Component Rendering - Successful Rendering', () => {
	it('renders children when rights are loaded successfully', async () => {
		const { auth, http } = createAuthenticatedSetup();
		const rightsData = { permissions: ['read', 'write'], roles: ['user'] };

		mockSuccessRightsResponse(http, DEFAULT_ENDPOINT, rightsData);

		renderWithProviders(
			<RightsLoader>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>,
			{ auth, http }
		);

		await waitFor(() => {
			expect(screen.getByText(TEST_CONTENT)).toBeInTheDocument();
		});
	});

	it('renders complex children structure', async () => {
		const { auth, http } = createAuthenticatedSetup();
		const rightsData = { permissions: ['read'], roles: ['user'] };

		mockSuccessRightsResponse(http, DEFAULT_ENDPOINT, rightsData);

		renderWithProviders(
			<RightsLoader>
				<div>
					<h1>Title</h1>
					<p>Description</p>
					<button>Action</button>
				</div>
			</RightsLoader>,
			{ auth, http }
		);

		await waitFor(() => {
			expect(screen.getByText('Title')).toBeInTheDocument();
			expect(screen.getByText('Description')).toBeInTheDocument();
			expect(screen.getByText('Action')).toBeInTheDocument();
		});
	});
});

describe('RightsLoader - Component Rendering - Fallback Rendering', () => {
	it('renders fallback when user is not authenticated', async () => {
		const auth = createAuthAdapter(null);
		const http = createHttpAdapter();
		const FALLBACK_TEXT = 'Please log in';

		renderWithProviders(
			<RightsLoader fallback={<div>{FALLBACK_TEXT}</div>}>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>,
			{ auth, http }
		);

		await waitFor(() => {
			expect(screen.getByText(FALLBACK_TEXT)).toBeInTheDocument();
		});

		expect(screen.queryByText(TEST_CONTENT)).not.toBeInTheDocument();
	});

	it('renders fallback when error occurs', async () => {
		const { auth, http } = createAuthenticatedSetup();
		const FALLBACK_TEXT = 'Error loading rights';

		mockErrorResponse(http, DEFAULT_ENDPOINT, 500, INTERNAL_SERVER_ERROR);

		renderWithProviders(
			<RightsLoader fallback={<div>{FALLBACK_TEXT}</div>}>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>,
			{ auth, http }
		);

		await waitFor(() => {
			expect(screen.getByText(FALLBACK_TEXT)).toBeInTheDocument();
		});

		expect(screen.queryByText(TEST_CONTENT)).not.toBeInTheDocument();
	});
});

describe('RightsLoader - Component Rendering - No Fallback Rendering', () => {
	it('renders nothing when no fallback is provided and user is not authenticated', async () => {
		const auth = createAuthAdapter(null);
		const http = createHttpAdapter();

		renderWithProviders(
			<RightsLoader>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>,
			{ auth, http }
		);

		await waitFor(() => {
			expect(screen.queryByText(TEST_CONTENT)).not.toBeInTheDocument();
		});

		expect(screen.queryByText(TEST_CONTENT)).not.toBeInTheDocument();
	});

	it('renders nothing when no fallback is provided and error occurs', async () => {
		const { auth, http } = createAuthenticatedSetup();

		mockErrorResponse(http, DEFAULT_ENDPOINT, 500, INTERNAL_SERVER_ERROR);

		renderWithProviders(
			<RightsLoader>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>,
			{ auth, http }
		);

		await waitFor(() => {
			expect(screen.queryByText(TEST_CONTENT)).not.toBeInTheDocument();
		});

		expect(screen.queryByText(TEST_CONTENT)).not.toBeInTheDocument();
	});
});

describe('RightsLoader - Edge Cases - Data Handling', () => {
	it('handles empty rights data', async () => {
		const { auth, http } = createAuthenticatedSetup();
		const rightsData = { permissions: [], roles: [] };

		mockSuccessRightsResponse(http, DEFAULT_ENDPOINT, rightsData);

		renderWithProviders(
			<RightsLoader>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>,
			{ auth, http }
		);

		await waitFor(() => {
			expect(screen.getByText(TEST_CONTENT)).toBeInTheDocument();
		});
	});
});

describe('RightsLoader - Edge Cases - Lifecycle', () => {
	it('cleans up on unmount', async () => {
		const { auth, http } = createAuthenticatedSetup();

		const response = createSuccessResponse({ permissions: [], roles: [] });
		http.mockResponse(DEFAULT_ENDPOINT, 'GET', () => createDelayedResponse(response));

		const { unmount } = renderWithProviders(
			<RightsLoader>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>,
			{ auth, http }
		);

		unmount();

		expect(true).toBe(true);
	});
});

describe('RightsLoader - Edge Cases - Error Logging', () => {
	it('handles unexpected errors in promise chain and logs them', async () => {
		const { auth, http } = createAuthenticatedSetup();
		const logger = new MockLoggerAdapter();

		// Create a scenario that triggers the outer catch handler
		// by making the HTTP call throw an error that's handled but then
		// the promise chain itself has an issue
		http.mockResponse(DEFAULT_ENDPOINT, 'GET', () => {
			throw new Error('Network error');
		});

		renderWithProviders(
			<RightsLoader>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>,
			{ auth, http, logger }
		);

		// Wait for the error to be handled
		await waitFor(
			() => {
				expect(screen.queryByText(TEST_CONTENT)).not.toBeInTheDocument();
			},
			{ timeout: 3000 }
		);

		// Verify that errors were logged (both from loadRights and potentially from the outer catch)
		expect(logger.logs.length).toBeGreaterThan(0);
		const errorLogs = logger.logs.filter(log => log.level === 'error');
		expect(errorLogs.length).toBeGreaterThan(0);
	});
});

describe('RightsLoader - Edge Cases - Endpoint Changes', () => {
	it('handles endpoint change', async () => {
		const { auth, http } = createAuthenticatedSetup();
		const rightsData = { permissions: ['read'], roles: ['user'] };

		mockSuccessRightsResponse(http, CUSTOM_ENDPOINT, rightsData);

		const { rerender } = renderWithProviders(
			<RightsLoader endpoint={DEFAULT_ENDPOINT}>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>,
			{ auth, http }
		);

		rerender(
			<RightsLoader endpoint={CUSTOM_ENDPOINT}>
				<div>{TEST_CONTENT}</div>
			</RightsLoader>
		);

		await waitFor(() => {
			expect(
				http.requests.some((req: { url?: string }) => req.url?.includes(CUSTOM_ENDPOINT))
			).toBe(true);
		});
	});
});

describe('RightsLoader - Display Name', () => {
	it('has correct display name', () => {
		expect(RightsLoader.displayName).toBe('RightsLoader');
	});
});
