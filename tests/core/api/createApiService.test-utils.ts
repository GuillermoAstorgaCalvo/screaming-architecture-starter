import type { HttpClientResponse } from '@core/ports/HttpPort';
import { MockHttpAdapter } from '@tests/utils/mocks/MockHttpAdapter';
import { vi } from 'vitest';

// Mock buildApiUrl to return the endpoint as-is for testing
vi.mock('@core/constants/endpoints', () => ({
	buildApiUrl: (endpoint: string) => endpoint,
}));

// Mock i18n
vi.mock('@core/i18n/i18n', () => ({
	default: {
		t: (key: string) => key,
	},
}));

export function createMockHttpResponse<T>(data: T): HttpClientResponse<T> {
	return {
		data,
		status: 200,
		statusText: 'OK',
		headers: new Headers(),
		response: new Response(),
	};
}

export function createMockHttpAdapter(): MockHttpAdapter {
	return new MockHttpAdapter();
}

export const API_ENDPOINT = '/api/users';
