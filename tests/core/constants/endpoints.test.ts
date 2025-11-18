import { API_ENDPOINTS, buildApiUrl } from '@core/constants/endpoints';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getCachedRuntimeConfigMock } = vi.hoisted(() => ({
	getCachedRuntimeConfigMock: vi.fn(),
}));

vi.mock('@core/config/runtime', () => ({
	getCachedRuntimeConfig: getCachedRuntimeConfigMock,
}));

describe('API_ENDPOINTS definitions', () => {
	it('exposes the current endpoint map (empty placeholder)', () => {
		expect(API_ENDPOINTS).toBeDefined();
		expect(API_ENDPOINTS).toMatchObject({});
		expect(Object.keys(API_ENDPOINTS)).toHaveLength(0);
	});
});

describe('buildApiUrl', () => {
	beforeEach(() => {
		getCachedRuntimeConfigMock.mockReset();
	});

	it('returns the endpoint path when no base URL is available', () => {
		getCachedRuntimeConfigMock.mockReturnValue(null);

		const url = buildApiUrl('/health');

		expect(url).toBe('/health');
	});

	it('uses the provided runtime config override when present', () => {
		getCachedRuntimeConfigMock.mockReturnValue(null);

		const url = buildApiUrl('/users', { API_BASE_URL: 'https://api.example.com' });

		expect(url).toBe('https://api.example.com/users');
	});

	it('falls back to the cached runtime config when no override is provided', () => {
		getCachedRuntimeConfigMock.mockReturnValue({ API_BASE_URL: 'https://cached.example.com/' });

		const url = buildApiUrl('users');

		expect(getCachedRuntimeConfigMock).toHaveBeenCalledTimes(1);
		expect(url).toBe('https://cached.example.com/users');
	});

	it('supports endpoint builder functions and forwards arguments', () => {
		getCachedRuntimeConfigMock.mockReturnValue({ API_BASE_URL: 'https://api.example.com' });
		const detailEndpoint = (...args: unknown[]) => `/users/${String(args[0])}`;

		const url = buildApiUrl(detailEndpoint, undefined, 'user-123');

		expect(url).toBe('https://api.example.com/users/user-123');
	});
});
